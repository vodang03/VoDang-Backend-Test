import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWorkspaceDto } from 'src/auth/dto/create-workspace.dto';
import { User } from 'src/tasks/entities/user.entity';
import { Workspace } from 'src/tasks/entities/workspace.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    private usersService: UsersService,
  ) {}

  async create(
    createWorkspaceDto: CreateWorkspaceDto,
    user: User,
  ): Promise<Workspace> {
    const workspace = this.workspaceRepository.create({
      ...createWorkspaceDto,
      ownerId: user.id,
      members: [user],
    });

    return await this.workspaceRepository.save(workspace);
  }

  async findAll(userId: string): Promise<Workspace[]> {
    return await this.workspaceRepository.find({
      where: { members: { id: userId } },
      relations: ['owner'],
    });
  }

  async findOne(id: string, userId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id },
      relations: ['owner', 'members', 'tasks'],
    });

    if (!workspace) throw new NotFoundException('Workspace not found');

    const isMember = workspace.members.some((member) => member.id === userId);
    if (!isMember)
      throw new ForbiddenException('You are not a member of this workspace');

    return workspace;
  }

  async addMember(workspaceId: string, email: string, ownerId: string) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: ['members', 'owner'],
    });

    if (!workspace) {
      throw new NotFoundException('No workspace found');
    }

    if (workspace?.owner?.id !== ownerId)
      throw new ForbiddenException('Only owner can add members');

    const userToAdd = await this.usersService.findByEmail(email);
    if (!userToAdd) throw new NotFoundException('User to add not found');

    const isAlreadyMember = workspace.members.some(
      (member) => member.id === userToAdd.id,
    );
    if (isAlreadyMember) {
      throw new ConflictException('User is already a member of this workspace');
    }

    workspace.members.push(userToAdd);
    return await this.workspaceRepository.save(workspace);
  }
}
