/*
 * @Author: wurangkun
 * @Date: 2023-11-20 14:54:04
 * @LastEditTime: 2023-11-29 15:32:56
 * @LastEditors: wurangkun
 * @FilePath: \fontend-for-personal\src\market\market.controller.ts
 * @Description: 
 */
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { MarketService } from './market.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { APIResponse } from 'src/request/response';
import { User } from 'src/user/entities/user.entity';
import { PublicUser, ReqUser } from 'src/user/user.decorator';
import { MarketDto } from './dto/res-market.dto';
import { CollectMarketDto, CreateMarketDto, MarketIdDto, MarketListDto, UpdateMarketDto } from './dto/req-market.dto';

@ApiTags('market')
@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @ApiOperation({ summary: '创建商品' })
  @APIResponse(MarketDto)
  @PublicUser()
  @Post('create')
  create(
    @Body() body: CreateMarketDto,
    @ReqUser() user: User,
  ) {
    return this.marketService.create(body, user);
  }

  @ApiOperation({ summary: '获取商品列表' })
  @APIResponse(MarketDto)
  @PublicUser()
  @Post('list')
  list(
    @Body() body: MarketListDto,
    @ReqUser() user: User,
  ) {
    return this.marketService.list(body, user);
  }

  @ApiOperation({ summary: '获取商品详情' })
  @APIResponse(MarketDto)
  @PublicUser()
  @Get('detail')
  detail(@Query('id') id: string) {
    return this.marketService.detail(+id);
  }

  @ApiOperation({ summary: '更新商品内容' })
  @APIResponse(MarketDto)
  @PublicUser()
  @Post('update')
  update(@Body() updateMarketDto: UpdateMarketDto) {
    return this.marketService.update(updateMarketDto);
  }

  @ApiOperation({ summary: '删除商品' })
  @APIResponse(MarketDto)
  @PublicUser()
  @Get('remove')
  remove(@Query('id') id: string) {
    return this.marketService.remove(+id);
  }

  @ApiOperation({ summary: '收藏商品' })
  @APIResponse(MarketDto)
  @PublicUser()
  @Post('collect')
  collect(
    @Body() body: CollectMarketDto,
  ) {
    return this.marketService.collect(body);
  }

  @ApiOperation({ summary: '购买商品' })
  @APIResponse(MarketDto)
  @PublicUser()
  @Post('buy')
  complete(
    @Body() body: MarketIdDto,
    @ReqUser() user: User,
  ) {
    return this.marketService.buy(body, user);
  }
  @ApiOperation({ summary: '购买商品' })
  @APIResponse(MarketDto)
  @PublicUser()
  @Get('use')
  use(
    @Query('id') id: string,
    @ReqUser() user: User,
    ) {
    return this.marketService.use(+id,user);
  }
}
