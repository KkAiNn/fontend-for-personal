/*
 * @Author: wurangkun
 * @Date: 2023-11-20 15:10:50
 * @LastEditTime: 2023-11-27 11:41:11
 * @LastEditors: wurangkun
 * @FilePath: \fontend-for-personal\src\main.ts
 * @Description: 
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './request/filter/http-exception.filter';
import { TransformInterceptor } from './request/filter/transform.interceptor';
import * as session from 'express-session';
import * as express from 'express';
import { envConfig } from './app.config';
import { join } from 'path';
import { json } from 'express'
const fs = require('fs')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //设置跨域支持
  app.enableCors();
  //设置全局前缀
  app.setGlobalPrefix(envConfig.prefix);
  //设置校验
  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '10mb' })) //默认就是100kb
  app.use(
    session({
      secret: envConfig.secret,
      resave: false,
      saveUninitialized: false,
    })
  );
  //设置我们的public文件夹可以直接访问
  app.use('/public', express.static(join(__dirname, '../public')));
  const options = new DocumentBuilder()
    .setTitle('nest demo api')
    .setDescription('This is nest demo api')
    .setVersion('1.0')
    .build();
  //设置文档
  const document = SwaggerModule.createDocument(app, options);
  fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));
  SwaggerModule.setup('api-docs', app, document);
  // //注册全局错误过滤器(校验和自己抛出的异常)
  // app.useGlobalFilters(new HttpExceptionFilter());
  // //添加成功后的参数过滤器
  // app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(8089);
}

bootstrap();