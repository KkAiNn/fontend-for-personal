import { MiddlewareConsumer, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envConfig } from './app.config';
import { FileModule } from './file/file.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { MarketModule } from './market/market.module';
import { RequestMiddleware } from './middleware/request';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: envConfig.dbhost,
      port: envConfig.dbport,
      username: envConfig.dbusername,
      password: envConfig.dbpassword,
      database: envConfig.dbdatabase,
      synchronize: true, //自动同步创建数据库表
      retryDelay: 500,
      retryAttempts: 10,
      autoLoadEntities: true, //自动查找entity实体
    }),
    FileModule,
    UserModule,
    TaskModule,
    MarketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes('*');
    // consumer
    //   .apply(RequestMiddleware)
    //   .forRoutes(UserController, ArticleController, TaskController , MarketController);
  }
}
