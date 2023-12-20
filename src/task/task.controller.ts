/*
 * @Author: wurangkun
 * @Date: 2023-11-20 11:50:39
 * @LastEditTime: 2023-11-29 10:01:07
 * @LastEditors: wurangkun
 * @FilePath: \fontend-for-personal\src\task\task.controller.ts
 * @Description: 
 */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CompleteTaskDto, CreateTaskDto, TaskListDto, UpdateTaskDto } from './dto/req-task.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { APIResponse } from 'src/request/response';
import { TaskDto } from './dto/res-task.dto';
import { PublicUser, ReqUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: '创建任务' })
  @APIResponse(TaskDto)
  @PublicUser()
  @Post('create')
  create(
    @Body() body: CreateTaskDto,
    @ReqUser() user: User,
  ) {
    return this.taskService.create(body, user);
  }

  @ApiOperation({ summary: '获取任务列表' })
  @APIResponse(TaskDto)
  @PublicUser()
  @Post('list')
  list(
    @Body() body: TaskListDto,
    @ReqUser() user: User,
  ) {
    return this.taskService.list(body, user);
  }

  @ApiOperation({ summary: '获取任务详情' })
  @APIResponse(TaskDto)
  @PublicUser()
  @Get('detail')
  detail(@Query('id') id: string) {
    return this.taskService.detail(+id);
  }

  @ApiOperation({ summary: '更新任务内容' })
  @APIResponse(TaskDto)
  @PublicUser()
  @Post('update')
  update(@Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(updateTaskDto);
  }

  @ApiOperation({ summary: '删除任务' })
  @APIResponse(TaskDto)
  @PublicUser()
  @Get('remove')
  remove(@Query('id') id: string) {
    return this.taskService.remove(+id);
  }

  @ApiOperation({ summary: '完成任务' })
  @APIResponse(TaskDto)
  @PublicUser()
  @Get('complete')
  complete(
    @Query() query: CompleteTaskDto,
    @ReqUser() user: User,
  ) {
    return this.taskService.complete(query, user.openId);
  }

  @ApiOperation({ summary: '审核任务' })
  @APIResponse(TaskDto)
  @PublicUser()
  @Get('audit')
  audit(
    @Query('id') id: string
  ) {
    return this.taskService.audit(+id);
  }

  @ApiOperation({ summary: '取消置顶' })
  @APIResponse(TaskDto)
  @PublicUser()
  @Get('cancelSticky')
  cancelSticky(@Query('id') id: string) {
    return this.taskService.cancelSticky(+id);
  }

  @ApiOperation({ summary: '置顶' })
  @APIResponse(TaskDto)
  @PublicUser()
  @Get('sticky')
  sticky(@Query('id') id: string) {
    return this.taskService.sticky(+id);
  }
}
