/*
 * @Author: wurangkun
 * @Date: 2023-11-20 15:10:51
 * @LastEditTime: 2023-11-29 17:12:40
 * @LastEditors: wurangkun
 * @FilePath: \fontend-for-personal\src\user\dto\req-user.dto.ts
 * @Description: 
 */
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, Validate, isNumber } from "class-validator";
import { IsMoney } from "../user.validate";

export class UserDto {
    //api属性备注，必填
    @ApiProperty({ description: '名字', example: '迪丽热巴' })
    //设置了 IsNotEmpty 就是必填属性了，文档也会根据该验证来显示是否必填
    @IsNotEmpty({ message: 'nickname不能为空' })//可以返回指定message，返回为数组
    // @IsNotEmpty()//返回默认message，默认为为原字段的英文提示
    readonly nickname: string

    //可选参数
    @ApiPropertyOptional({ description: '年龄', example: 20 })
    readonly age: number

    @ApiPropertyOptional({ description: '手机号', example: '133****3333' })
    readonly mobile: string

    @ApiPropertyOptional({ description: '性别 1男 2女 0未知', example: 1 })
    @Min(0)
    @Max(1)
    readonly sex: number

    @ApiProperty({ description: '积分', example: 0 })
    readonly credit: number

    @ApiProperty({ description: '剩余任务数量', example: 0 })
    readonly task_count: number

    @ApiProperty({ description: '介绍', example: 0 })
    readonly desc: string

    @ApiProperty({ description: '头像', example: '' })
    readonly face: string

    @ApiProperty({ description: '关联对象id', example: '' })
    readonly ass_openId: string

    @ApiProperty({ description: 'session_id', example: '' })
    readonly session_id: string

    @ApiProperty({ description: 'openId', example: '' })
    readonly openId: string
}

export class LoginDto {
    @ApiProperty({ description: '用户名', example: '12222222222' })
    @IsNotEmpty()
    account: string

    @ApiProperty({ description: '密码', example: '111111' })
    password: string
}

export class AppletLoginDto {
    @ApiProperty({ description: '微信code' })
    @IsNotEmpty()
    wxCode: string

    @ApiProperty({ description: '用户id' })
    userid: number
}

export class UserUpdateDto {
    //api属性备注，必填
    @ApiProperty({ description: '名字', example: '迪丽热巴' })
    readonly nickname: string

    //可选参数
    @ApiPropertyOptional({ description: '年龄', example: 20 })
    age?: number

    @ApiPropertyOptional({ description: '手机号', example: '133****3333' })
    mobile?: string

    // @ApiProperty({ description: '性别 1男 2女 0未知', example: 1 })
    // @Min(0)
    // @Max(2)
    // sex?: number

    @ApiPropertyOptional({ description: '性别 1男 2女 0未知', example: 1 })
    ass_openId?: string
    @ApiPropertyOptional({ description: '简介', example: 1 })
    desc?: string
    @ApiPropertyOptional({ description: '头像', example: '' })
    face?: string
}

