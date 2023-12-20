/*
 * @Author: wurangkun
 * @Date: 2023-11-20 15:10:51
 * @LastEditTime: 2023-11-29 15:49:08
 * @LastEditors: wurangkun
 * @FilePath: \fontend-for-personal\src\market\market.module.ts
 * @Description: 
 */
import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { Market } from './entities/market.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { MarketItem } from './entities/marketItem.entity';
import { Task } from 'src/task/entities/task.entity';

@Module({
  controllers: [MarketController],
  providers: [MarketService],
  imports: [
    TypeOrmModule.forFeature([Market]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Task]),
    TypeOrmModule.forFeature([MarketItem]),
  ],
})
export class MarketModule {}
