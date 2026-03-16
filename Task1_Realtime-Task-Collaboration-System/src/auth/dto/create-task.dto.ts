import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  workspaceId: string;

  @IsUUID()
  @IsOptional()
  assigneeId?: string;
}
