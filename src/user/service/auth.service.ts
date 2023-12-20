import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AppletLoginDto, LoginDto } from '../dto/req-user.dto';
import { Auth } from '../entities/auth.entity';
import { ResponseData } from 'src/request/response-data';
import { JwtService } from '@nestjs/jwt';
import { CookieExtend } from '../user.session';
import { UserService } from './user.service';
import axios from 'axios';
import { envConfig } from 'src/app.config';
import { WxLoginResDto } from '../dto/res-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Auth)
        private authRepository: Repository<Auth>,
        private jwtService: JwtService,
        private userService: UserService,
    ) {}

    async register(
        loginInfo: LoginDto,
    ) {
        let user = await this.userRepository.findOneBy({
            account: loginInfo.account,
        });
        if (user) {
            return ResponseData.fail('该账户已存在');
        }
        let auth = new Auth();
        user = new User();
        // 也可使用key-value的对象直接创建并赋值，和上面一样区别不大
        // auth = this.authRepository.create({password: '123'})
        auth.password = loginInfo.password;
        user.account = loginInfo.account;
        try {
            await this.userRepository.save(user);
            auth.user = user;//给谁添加的外键(JoinColumn)，谁需要被赋值，这个靠映射关联，因此保存之前确定映射关系也没问题
            // auth.userId = user.id;//给谁添加的外键(JoinColumn)，谁需要被赋值，注意userid保存前id不存在
            await this.authRepository.save(auth);
        } catch (err) {
            //有一个操作失败，回退操作😂
            await this.userRepository.delete({ id: user.id })
            await this.authRepository.delete({ id: auth.id })
            return ResponseData.fail();
        }
        user.desc = undefined; //返回时省略字段就设置为undefined
        return ResponseData.ok(user);
    }

    async loginWithCookie(
        loginInfo: LoginDto,
        session: CookieExtend,
    ) {
        let user = await this.userRepository.findOne({
            where: {
                account: loginInfo.account
            },
            relations: {
                auth: true,
            },
        });
        if (!user || user.auth.password !== loginInfo.password) {
            return ResponseData.fail('用户名或者密码不正确')
        }
        session.user = user
        session.cookie.sameSite = 'strict' //严格模式
        user.auth = undefined; //不想返回该字段设置为 undefined
        return ResponseData.ok({
            user,
        });
    }

    generateToken(
        user: User
    ) {
        return {
            access_token: this.jwtService.sign({
                id: user.id
            }, {
                expiresIn: '0.003h' //1小时过期
            }), //将token返回给客户端
            refresh_token: this.jwtService.sign({
                id: user.id,
            }, {
                expiresIn: '2d' //7天过期
            })
        }
    }

    async login(
        loginInfo: LoginDto,
    ) {
        let user = await this.userRepository.findOne({
            //默认选项都为 null 或 undefined时，搜索条件为没条件
            //为了避免选填内容，可以加上 Equal(name)，如果需要查询为 null 的，用 IsNull()即可
            where: {
                account: loginInfo.account,
            },
            relations: {
                auth: true,
            },
        });
        if (!user || user.auth.password !== loginInfo.password) {
            return ResponseData.fail('用户名或者密码不正确')
        }
        user.auth = undefined;
        return ResponseData.ok({
            user,
            ...this.generateToken(user)
        })
    }

    async wxLogin(loginInfo: AppletLoginDto) {
        let user = await this.userRepository.findOneBy({ id : loginInfo.userid})
        const { data } = await axios.get<WxLoginResDto>('https://api.weixin.qq.com/sns/jscode2session', {
            params: {
                appid: envConfig.appId,
                secret: envConfig.secret,
                js_code: loginInfo.wxCode,
                grant_type: 'authorization_code'
            }
        })
        if (data.errcode) {
            return ResponseData.fail(data.errmsg);
        } else {
            // 账户存在 获取账户信息 生成key
            if (user?.openId) {
                return ResponseData.ok({ ...user, session_id: this.jwtService.sign({ openId: data.openid,session_key: data.session_key}) })
            } else {
                // 注册新用户
                user = new User();
                user.openId = data.openid
                if(!user.nickname) user.nickname = '取个名字吧'
                if(!user.desc) user.desc = '点击去编辑个人信息'
                try {
                    await this.userRepository.save(user);
                    return ResponseData.ok({ ...user, session_id: this.jwtService.sign({ openId: data.openid,session_key: data.session_key}) })
                } catch (err) {
                    console.log(err);
                    //有一个操作失败，回退操作😂
                    await this.userRepository.delete({ id: user.id })
                    return ResponseData.fail();
                }
            }
        }
    }

    async refreshToken(
        user: User,
    ) {
        //获取新token
        return ResponseData.ok(
            this.generateToken(user)
        );
    }

    async logout() {
        return ResponseData.ok({
            access_token: ''
        })
    }

    async recoverUser(
        loginInfo: LoginDto,
    ) {
        let user = await this.userRepository.findOne({
            where: {
                account: loginInfo.account,
            },
            relations: {
                auth: true,
            },
        });
        if (!user || user.auth.password !== loginInfo.password) {
            return ResponseData.fail('用户名或者密码不正确')
        }
        await this.userService.recoverUser(user);
        return ResponseData.ok('恢复成功');
    }

    async deleteUser(
        loginInfo: LoginDto,
    ) {
        let user = await this.userRepository.findOne({
            where: {
                account: loginInfo.account,
            },
            relations: {
                auth: true,
            },
        });
        if (!user || user.auth.password !== loginInfo.password) {
            return ResponseData.fail('用户名或者密码不正确')
        }
        await this.authRepository.delete({ id: user.auth.id })
        await this.userRepository.delete({ account: loginInfo.account })
        await this.userService.deleteBlackList(user.openId)
        return ResponseData.ok('删除成功');
    }
}
