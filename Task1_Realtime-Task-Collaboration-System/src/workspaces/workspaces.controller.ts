import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from 'src/auth/dto/create-workspace.dto';
import { User } from 'src/tasks/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AddMemberDto } from 'src/auth/dto/add-member.dto';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  async create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @GetUser() user: User,
  ) {
    return this.workspacesService.create(createWorkspaceDto, user);
  }

  @Get()
  async findAll(@GetUser('id') userId: string) {
    return this.workspacesService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.workspacesService.findOne(id, userId);
  }

  @Post(':id/members')
  async addMember(
    @Param('id') workspaceId: string,
    @Body() addMemberDto: AddMemberDto,
    @GetUser('id') ownerId: string,
  ) {
    return this.workspacesService.addMember(
      workspaceId,
      addMemberDto.email,
      ownerId,
    );
  }
}
