/*
 * @Author: wurangkun
 * @Date: 2023-11-29 11:29:58
 * @LastEditTime: 2023-11-29 15:26:20
 * @LastEditors: wurangkun
 * @FilePath: \fontend-for-personal\src\market\entities\marketItem.entity.ts
 * @Description: 
 */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Market } from "./market.entity";
import { User } from "src/user/entities/user.entity";
import { MarketStatus } from "../market.enum";

@Entity()
export class MarketItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.marketItems)
  user: User;

  @ManyToOne(() => Market, market => market.marketItems)
  @JoinColumn({ name: "marketId"}) // Specify the join column name
  market: Market;
  
  @Column({default: 1})
  quantity: number;
  
  @Column({default: MarketStatus.pending ,select:false})
  status: MarketStatus;
}