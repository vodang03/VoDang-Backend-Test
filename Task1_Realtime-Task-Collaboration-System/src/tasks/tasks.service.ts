import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task, TaskStatus } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspacesService } from 'src/workspaces/workspaces.service';
import { CreateTaskDto } from 'src/auth/dto/create-task.dto';
import { TasksGateway } from './tasks/tasks.gateway';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    // Inject WorkspacesService để kiểm tra quyền thành viên
    private readonly workspacesService: WorkspacesService,
    private readonly tasksGateway: TasksGateway,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const { workspaceId } = createTaskDto;

    const workspace = await this.workspacesService.findOne(workspaceId, userId);
    if (!workspace) {
      throw new NotFoundException(
        'Workspace not found or you are not a member',
      );
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      workspace,
      status: TaskStatus.TODO,
    });

    const newTask = await this.taskRepository.save(task);

    this.tasksGateway.server
      .to(`workspace_${workspaceId}`)
      .emit('taskCreated', newTask);

    return newTask;
  }

  async findAllByWorkspace(
    workspaceId: string,
    userId: string,
  ): Promise<Task[]> {
    await this.workspacesService.findOne(workspaceId, userId);

    return await this.taskRepository.find({
      where: { workspaceId },
      relations: ['assignee'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(
    taskId: string,
    status: TaskStatus,
    userId: string,
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['workspace', 'workspace.members'],
    });

    if (!task) throw new NotFoundException('Task not found');

    const isMember = task.workspace.members.some((m) => m.id === userId);
    if (!isMember)
      throw new ForbiddenException('You cannot update tasks in this workspace');

    task.status = status;
    const updatedTask = await this.taskRepository.save(task);

    this.tasksGateway.emitTaskUpdated(task.workspaceId, updatedTask);

    return await this.taskRepository.save(task);
  }

  async remove(taskId: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['workspace', 'workspace.members'],
    });

    if (!task) throw new NotFoundException('Task not found');

    const isMember = task.workspace.members.some((m) => m.id === userId);
    if (!isMember) throw new ForbiddenException('You cannot delete this task');

    await this.taskRepository.remove(task);

    this.tasksGateway.server
      .to(`workspace_${task.workspaceId}`)
      .emit('taskDeleted', { id: taskId });
  }
}
