/*
 * @Author: wurangkun
 * @Date: 2023-11-27 15:22:46
 * @LastEditTime: 2023-11-28 15:46:41
 * @LastEditors: wurangkun
 * @FilePath: \fontend-for-personal\src\market\dto\req-market.dto.ts
 * @Description: 
 */
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { PageDto } from "src/request/page.dto";
import { MarketStatus } from "../market.enum";

export class CreateMarketDto {
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

export class UpdateMarketDto extends CreateMarketDto  {
  @ApiProperty({ description: '任务id', example: 1 })
  @IsNotEmpty()
  id:number
}

export class MarketIdDto {
  @ApiProperty({ description: '任务id', example: 1 })
  @IsNotEmpty()
  id:number
}

export class DeleteMarketDto extends MarketIdDto {}

export class CollectMarketDto extends MarketIdDto {
  @ApiProperty({ description: '是否收藏:不收藏=0,收藏=1', example: 0 })
  @IsNotEmpty()
  isCollect: number
}

export class MarketListDto extends PageDto {
  @ApiPropertyOptional({ description: '模糊查询的名称：搜索标题、描述、内容', example: '标题' })
  name: string
  
  @ApiPropertyOptional({ description: '状态', example: MarketStatus.published })
  status?: MarketStatus
}

export class MarketDetailDto extends MarketIdDto { }