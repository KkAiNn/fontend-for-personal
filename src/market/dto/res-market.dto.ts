import { ApiProperty } from "@nestjs/swagger";

export class MarketDto {
  @ApiProperty({ description: '商品id', example: 1 })
  id: number

  @ApiProperty({ description: '商品名称', example: '商品1' })
  title: string

  @ApiProperty({ description: '商品描述', example: '商品描述' })
  desc: string

  @ApiProperty({ description: '商品分数', example: 0 })
  credit: number

  @ApiProperty({ description: '是否置顶:不置顶=0,置顶=1', example: 0 })
  sticky_id: number

  @ApiProperty({ description: '商品创建时间', example: '2021-01-01' })
  createTime: Date

  @ApiProperty({ description: '用户信息', example: 1 })
  userId: number

  @ApiProperty({ description: '是否收藏', example: false })
  isCollects:boolean
}

