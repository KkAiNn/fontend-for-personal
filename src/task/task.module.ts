/*
 * @Author: wurangkun
 * @Date: 2023-11-20 15:10:51
 * @LastEditTime: 2023-11-28 15:22:09
 * @LastEditors: wurangkun
 * @FilePath: \fontend-for-personal\src\task\task.module.ts
 * @Description: 
 */
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [
    TypeOrmModule.forFeature([Task]),
    TypeOrmModule.forFeature([User])
  ],
})
export class TaskModule {}
