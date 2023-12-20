/*
 * @Author: wurangkun
 * @Date: 2023-11-20 11:50:39
 * @LastEditTime: 2023-11-29 10:00:56
 * @LastEditors: wurangkun
 * @FilePath: \fontend-for-personal\src\task\dto\req-task.dto.ts
 * @Description: 
 */
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { PageDto } from "src/request/page.dto";
import { TaskStatus } from "../task.enum";

export class CreateTaskDto {
  @ApiProperty({ description: '任务标题', example: '任务标题' })
  @IsNotEmpty()
  title: string

  @ApiProperty({ description: '任务描述', example: '任务描述' })
  @IsNotEmpty()
  desc:string

  @ApiProperty({ description: '任务积分', example: 1 })
  @IsNotEmpty()
  credit:number
}

export class UpdateTaskDto extends CreateTaskDto  {
  @ApiProperty({ description: '任务id', example: 1 })
  @IsNotEmpty()
  id:number
}

export class TaskIdDto {
  @ApiProperty({ description: '任务id', example: 1 })
  @IsNotEmpty()
  id:number
}

export class DeleteTaskDto extends TaskIdDto {}

export class StickyTaskDto extends TaskIdDto {
  @ApiProperty({ description: '是否置顶:不置顶=0,置顶=1', example: 1 })
  @IsNotEmpty()
  sticky_id:number
}

export class CompleteTaskDto extends TaskIdDto { 
  @ApiPropertyOptional({ description: '状态', example: TaskStatus.pending })
  status?: TaskStatus
}

export class TaskListDto extends PageDto {
  @ApiPropertyOptional({ description: '模糊查询的名称：搜索标题、描述、内容', example: '标题' })
  name: string
  
  @ApiPropertyOptional({ description: '状态', example: TaskStatus.pending })
  status?: TaskStatus
}

export class TaskDetailDto extends TaskIdDto { }