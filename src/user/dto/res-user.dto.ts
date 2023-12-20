import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "./req-user.dto";

export class TokenDto {
    @ApiProperty({ description: 'token(需要放到 headers 中)', example: '112313ssdf' })
    accessToken: string

    @ApiProperty({ description: '当accessToken过期时，使用该token更新token', example: '112313ssdf' })
    refreshToken: string

    @ApiProperty({ description: '用户信息', type: () => UserDto, example: UserDto })
    user: UserDto
}

export class WxLoginResDto {
    @ApiProperty({ description: '会话密钥' })
    session_key: string

    @ApiProperty({ description: '用户在开放平台的唯一标识符，若当前小程序已绑定到微信开放平台账号下会返回，详见 UnionID 机制说明。' })
    unionid: string

    @ApiProperty({ description: '用户唯一标识' })
    openid: string

    /** 
        40029 = 'code 无效',
        45011 = '频率限制，每个用户每分钟100次',
        40226 = '缺少 appid',
        -1 = '缺少 secret' 
    */
    @ApiProperty({ description: '错误码' })
    errcode: number

    @ApiProperty({ description: '错误信息' })
    errmsg: string
}