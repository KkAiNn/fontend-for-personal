import { ApiProperty } from "@nestjs/swagger";

export class TaskDto {
  @ApiProperty({ description: '任务id', example: 1 })
  id: number

  @ApiProperty({ description: '任务名称', example: '任务1' })
  title: string

  @ApiProperty({ description: '任务描述', example: '任务描述' })
  desc: string

  @ApiProperty({ description: '任务分数', example: 0 })
  credit: number

  @ApiProperty({ description: '是否置顶:不置顶=0,置顶=1', example: 0 })
  sticky_id: number

  @ApiProperty({ description: '任务创建时间', example: '2021-01-01' })
  createTime: Date

  @ApiProperty({ description: '用户信息', example: 1 })
  userId: number
}

