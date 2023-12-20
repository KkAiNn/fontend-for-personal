/*
 * @Author: wurangkun
 * @Date: 2023-11-27 10:03:50
 * @LastEditTime: 2023-11-27 10:38:33
 * @LastEditors: wurangkun
 * @FilePath: \fontend-for-personal\src\middleware\request.ts
 * @Description: 
 */
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request,Response } from "express";

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request... baseUrl --> ${req.baseUrl} ---  body --> ${JSON.stringify(req.body)} --- query --> ${JSON.stringify(req.query)}  --- header --> ${JSON.stringify(req.headers)}`);
    next();
  }
}