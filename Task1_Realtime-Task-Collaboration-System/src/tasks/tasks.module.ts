import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspacesModule } from 'src/workspaces/workspaces.module';
import { TasksGateway } from './tasks/tasks.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), WorkspacesModule, JwtModule],

  providers: [TasksService, TasksGateway],
  controllers: [TasksController],
})
export class TasksModule {}
