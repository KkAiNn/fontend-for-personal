/*
 * @Author: wurangkun
 * @Date: 2023-11-20 14:15:49
 * @LastEditTime: 2023-11-29 14:12:31
 * @LastEditors: wurangkun
 * @FilePath: \fontend-for-personal\src\market\entities\market.entity.ts
 * @Description: 
 */
import { Column, CreateDateColumn, Entity, JoinColumn,  JoinTable,  ManyToMany,  ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { MarketStatus } from "../market.enum";
import { MarketItem } from "./marketItem.entity";

@Entity()
export class Market {
  @PrimaryGeneratedColumn()
  id: number

  /** 任务名称 */
  @Column({ default: '' })
  title: string

  /** 任务描述 */
  @Column({ default: '' })
  desc: string

  /** 任务分数 */
  @Column({ default: 0 })
  credit: number

  /** 创建人 */
  // @ManyToOne(() => User, user => user.markets)
  // @JoinColumn()
  // user: User
  @Column({ default: null })
  openId: string

  @CreateDateColumn()
  createTime: Date

  @UpdateDateColumn()
  updateTime: Date

  /** 是否被删除 */
  @Column({ default: false, select: false })
  isDelete: boolean

  /** 库存 */
  @Column({ default: 0 })
  stock: number

  /** 是否被收藏 */
  @Column({ default: false })
  isCollect: boolean
  /** 
   * 购买时间
   */
  @Column({ default: null })
  buyTime: Date
  /** 
   * 使用时间
   */
  @Column({ default: null })
  useTime: Date
  
  /** 商品状态 */
  @Column({ default: MarketStatus.published })
  status: MarketStatus


  //一篇商品会被多个人收藏，一个人可以收藏多个商品
  @ManyToMany(() => User, user => user.collects)
  @JoinTable() //多对多，会自动生成两个{nameId} + 主键的新表，表名:当前表名_当前键名_关联表名 例如：market_collects_user
  collects: User[]

  @OneToMany(() => MarketItem, marketItem => marketItem.market)
  marketItems: MarketItem[];
}
