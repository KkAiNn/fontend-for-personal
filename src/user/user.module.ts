/*
 * @Author: wurangkun
 * @Date: 2023-11-20 15:10:51
 * @LastEditTime: 2023-11-28 17:14:06
 * @LastEditors: wurangkun
 * @FilePath: \fontend-for-personal\src\user\user.module.ts
 * @Description: 
 */
import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Auth } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from 'src/app.config';
import { AuthService } from './service/auth.service';
import { APP_GUARD } from '@nestjs/core';
import { UserGuard } from './user.guard';
import { UserController } from './user.controller';
import { BlackList } from './entities/blacklist.entity';
import { Market } from 'src/market/entities/market.entity';
import { Task } from 'src/task/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Auth]),
    TypeOrmModule.forFeature([BlackList]),
    TypeOrmModule.forFeature([Market]),
    TypeOrmModule.forFeature([Task]),
    JwtModule.register({
      global: true, //设置为全局
      secret: envConfig.secret,
      signOptions: {
        expiresIn: '7d', //失效时长设置为7天
      },
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService, 
    AuthService,
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
  ],
})
export class UserModule { }
// export class UserModule  implements NestModule {

//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(RequestMiddleware)
//       .forRoutes(UserController, ArticleController);
//   }
// }
