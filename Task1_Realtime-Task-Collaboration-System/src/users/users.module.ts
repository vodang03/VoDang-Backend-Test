import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/tasks/entities/user.entity';

@Module({
  imports: [
    // Khai báo Entity User để sử dụng được Repository trong Service
    TypeOrmModule.forFeature([User]),
  ],

  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
