import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreateTaskDto } from 'src/auth/dto/create-task.dto';
import { UpdateTaskStatusDto } from 'src/auth/dto/update-task-status.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser('id') userId: string,
  ) {
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get('workspace/:workspaceId')
  async findAllByWorkspace(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @GetUser('id') userId: string,
  ) {
    return this.tasksService.findAllByWorkspace(workspaceId, userId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser('id') userId: string,
  ) {
    return this.tasksService.updateStatus(
      taskId,
      updateTaskStatusDto.status,
      userId,
    );
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') userId: string,
  ) {
    return this.tasksService.remove(id, userId);
  }
}
