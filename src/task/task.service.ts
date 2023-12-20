/*
 * @Author: wurangkun
 * @Date: 2023-11-20 14:54:04
 * @LastEditTime: 2023-11-29 16:04:14
 * @LastEditors: wurangkun
 * @FilePath: \fontend-for-personal\src\task\task.service.ts
 * @Description: 
 */
import { Injectable } from '@nestjs/common';
import { CompleteTaskDto, CreateTaskDto, TaskListDto, UpdateTaskDto } from './dto/req-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ResponseData } from 'src/request/response-data';
import { TaskStatus, TaskStickyType } from './task.enum';
import { PageDto } from 'src/request/page.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(body: CreateTaskDto, user: User) {
    const userInfo = await this.userRepository.findOneBy({ openId: user.openId })
    if (userInfo?.ass_openId) {
      const task = new Task();
      task.title = body.title;
      task.desc = body.desc;
      task.credit = body.credit;
      task.status = TaskStatus.pending;
      task.openId = userInfo?.ass_openId;//设置外键关联，属于某一个用户
      task.isDelete = false;
      await this.taskRepository.save(task);
      return ResponseData.ok(task);
    } else {
      return ResponseData.fail('请先绑定好友！')
    }
  }

  async list(
    body: TaskListDto,
    user: User
  ) {
    let page = new PageDto(body)
    const userInfo = await this.userRepository.findOneBy({ openId: user.openId })
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .where("task.openId = :openId AND task.title LIKE :title", { openId: userInfo.ass_openId, title: `%${body.name}%` })
      .andWhere('task.isDelete = :isDelete', { isDelete: false })
      .andWhere('task.status = :status', { status: `${body.status ? body.status : TaskStatus.pending}` })
      .orderBy('task.sticky_id', 'DESC')
      .addOrderBy('task.createTime', 'DESC')
      .skip(page.skip)
      .take(page.take)
      .getManyAndCount()
    return ResponseData.pageOk(tasks, page);
  }

  async detail(id: number) {
    const task = await this.taskRepository.findOneBy({
      id,
    });
    if (!task) {
      return ResponseData.fail('该任务不存在');
    }
    return ResponseData.ok(task);
  }

  async update(updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.findOneBy({
      id: updateTaskDto.id,
      isDelete: false,
      status: TaskStatus.pending
    });
    if (!task) {
      return ResponseData.fail('该任务不存在');
    }
    task.title = updateTaskDto.title;
    task.desc = updateTaskDto.desc;
    task.credit = updateTaskDto.credit;
    await this.taskRepository.save(task);
    return ResponseData.ok(task);
  }

  async remove(id: number) {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .where("task.id = :id AND task.sticky_id = :sticky_id AND task.isDelete = :isDelete", { id, sticky_id: `${TaskStickyType.none}`, isDelete: false, })
      .getOne();

    if (!task) {
      return ResponseData.fail('该任务不存在');
    }
    task.isDelete = true;
    await this.taskRepository.save(task);
    return ResponseData.ok(task);
  }

  async sticky(id: number) {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .where("task.id = :id AND task.sticky_id = :sticky_id", { id, sticky_id: `${TaskStickyType.none}` })
      .getOne();
    if (!task) {
      return ResponseData.fail('该任务不存在');
    }
    if(!task.isSticky){
      return ResponseData.fail('该任务不可取消置顶');
    }
    task.sticky_id = TaskStickyType.sticky
    await this.taskRepository.save(task);
    return ResponseData.ok(task);
  }
  async cancelSticky(id: number) {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .where("task.id = :id AND task.sticky_id = :sticky_id", { id, sticky_id: `${TaskStickyType.sticky}` })
      .getOne();
    if (!task) {
      return ResponseData.fail('该任务不存在');
    }
    task.sticky_id = TaskStickyType.none
    await this.taskRepository.save(task);
    return ResponseData.ok(task);
  }

  // 审核
  async audit(id: number) {
    const task = await this.taskRepository.findOneBy({
      id,
      isDelete: false
    });
    if (!task) {
      return ResponseData.fail('该任务不存在');
    }

    if (task.status === TaskStatus.pending) {
      task.status = TaskStatus.audit;
      task.auditTime = new Date();
      task.submitTime = new Date();
    }

    await this.taskRepository.save(task);
    return ResponseData.ok(task);
  }

  async complete(query: CompleteTaskDto, openId: string) {
    const task = await this.taskRepository.findOneBy({
      id: query.id,
      isDelete: false
    });

    if (!task) {
      return ResponseData.fail('该任务不存在');
    }


    if (task.status === TaskStatus.audit) {
      task.status = query.status;
      task.auditTime = new Date();
    }
    if (task.status === TaskStatus.complete) {
      const user = await this.userRepository.findOneBy({ openId })
      user.credit += task.credit
      await this.userRepository.save(user);
    }
    await this.taskRepository.save(task);
    return ResponseData.ok(task);
  }
}
