/*
 * @Author: wurangkun
 * @Date: 2023-11-20 14:54:04
 * @LastEditTime: 2023-11-29 10:19:02
 * @LastEditors: wurangkun
 * @FilePath: \fontend-for-personal\src\task\entities\task.entity.ts
 * @Description: 
 */
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TaskStatus, TaskStickyType } from "../task.enum";

@Entity()
export class Task {
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

  /** 是否可以置顶 */
  @Column({ default: true })
  isSticky: boolean

  /** 不置顶=0,置顶=1 */
  @Column('simple-enum', {
    enum: [0, 1],
    default: 0
  })
  sticky_id: TaskStickyType

  /** 任务状态 待完成 失败 已完成 */
  @Column('simple-enum', {
    enum: [
      TaskStatus.pending,
      TaskStatus.failure,
      TaskStatus.complete,
      TaskStatus.audit,
    ],
    default: TaskStatus.pending
  })
  status: TaskStatus

  /** 创建人 */
  @Column({ default: null })
  openId: string

  @CreateDateColumn()
  createTime: Date

  @UpdateDateColumn()
  updateTime: Date

  @Column({ default: null })
  auditTime: Date
  
  @Column({ default: null })
  submitTime: Date

  @Column({ default: false, select: false })
  isDelete: boolean
}
