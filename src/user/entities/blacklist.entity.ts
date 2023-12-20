import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('black_list')  //默认带的 entity
export class BlackList {
	@PrimaryGeneratedColumn()
    id: number

    @Column({  default: null })
    openId: string

	@CreateDateColumn()
	createDate: Date
}