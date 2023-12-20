/*
 * @Author: wurangkun
 * @Date: 2023-11-20 14:54:04
 * @LastEditTime: 2023-11-29 16:05:50
 * @LastEditors: wurangkun
 * @FilePath: \fontend-for-personal\src\market\market.service.ts
 * @Description: 
 */
import { Injectable } from '@nestjs/common';
import { CollectMarketDto, CreateMarketDto, MarketIdDto, MarketListDto, UpdateMarketDto } from './dto/req-market.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Market } from './entities/market.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ResponseData } from 'src/request/response-data';
import { MarketStatus } from './market.enum';
import { PageDto } from 'src/request/page.dto';
import { MarketItem } from './entities/marketItem.entity';
import { Task } from 'src/task/entities/task.entity';
import { TaskStatus } from 'src/task/task.enum';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(Market)
    private marketRepository: Repository<Market>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(MarketItem)
    private marketItemRepository: Repository<MarketItem>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}
  async create(body: CreateMarketDto, user: User) {
    const userInfo = await this.userRepository.findOneBy({ openId: user.openId })
    if (userInfo?.ass_openId) {
      const market = new Market();
      market.title = body.title;
      market.desc = body.desc;
      market.credit = body.credit;
      market.status = MarketStatus.published;
      market.openId = userInfo?.ass_openId;//设置外键关联，属于某一个用户
      market.isDelete = false;
      await this.marketRepository.manager.save(market);
      return ResponseData.ok(market);
    } else
      return ResponseData.fail('请先绑定好友！')
  }

  async list(
    body: MarketListDto,
    user: User
  ) {
    let page = new PageDto(body)
    const markets = await this.marketRepository
      .createQueryBuilder('market')
      .where("market.openId = :openId AND market.title LIKE :title", { openId: user.openId, title: `%${body.name}%` })
      .andWhere('market.isDelete = :isDelete', { isDelete: false })
      .andWhere('market.status = :status', { status: body.status ? body.status : MarketStatus.published })
      .orderBy('market.createTime', 'DESC')
      .skip(page.skip)
      .take(page.take)
      .getManyAndCount()
    return ResponseData.pageOk(markets, page);
  }



  async detail(id: number) {
    const market = await this.marketRepository.findOneBy({
      id,
    });
    if (!market) {
      return ResponseData.fail('该商品不存在');
    }
    return ResponseData.ok(market);
  }

  async update(updateMarketDto: UpdateMarketDto) {
    const market = await this.marketRepository.findOneBy({
      id: updateMarketDto.id,
      isDelete: false,
      status: MarketStatus.published
    });
    if (!market) {
      return ResponseData.fail('该商品不存在');
    }
    market.title = updateMarketDto.title;
    market.desc = updateMarketDto.desc;
    market.credit = updateMarketDto.credit;
    await this.marketRepository.save(market);
    return ResponseData.ok(market);
  }

  async remove(id: number) {
    const market = await this.marketRepository
      .createQueryBuilder('market')
      .where("market.id = :id AND market.status = :status AND market.isDelete = :isDelete", { id, status: `${MarketStatus.published}`, isDelete: false, })
      .getOne();

    if (!market) {
      return ResponseData.fail('该商品不存在');
    }
    market.isDelete = true;
    await this.marketRepository.save(market);
    return ResponseData.ok(market);
  }

  async collect(
    body: CollectMarketDto,
  ) {
    let market = await this.marketRepository.findOne({
      where: {
        id: body.id,
        isDelete: false,
      }
    })
    if (!market) {
      return ResponseData.fail('该商品不存在');
    }
    market.isCollect = body.isCollect ? true : false;
    await this.marketRepository.save(market);
    return ResponseData.ok(market);
  }
  async buy(body: MarketIdDto, user: User) {
    const market = await this.marketRepository.findOne({
      where: {
        id: body.id,
        isDelete: false
      }
    });
    if (!market) {
      return ResponseData.fail('该商品不存在');
    }
    const userInfo = await this.userRepository.findOne({
      where: { openId: user.openId }
    })
    if (userInfo.credit < market.credit) {
      return ResponseData.fail('积分不足')
    }
    const orderItem = new MarketItem();
    orderItem.user = userInfo;
    orderItem.market = market;
    orderItem.quantity = 1;
    orderItem.status = MarketStatus.pending;

    userInfo.credit = userInfo.credit - market.credit
    market.buyTime = new Date();
    await this.marketItemRepository.save(orderItem);
    await this.marketRepository.save(market);
    await this.userRepository.save(userInfo);
    return ResponseData.ok(market);
  }

  async use(id: number, user: User) {
    const marketItem = await this.marketItemRepository.findOne({
      where: {
        id: id,
        status: MarketStatus.pending,
      },
      relations: ['market']
    });
    const market = await this.marketRepository.findOne({
      where: {
        id: marketItem.market.id,
      }
    });
    const userInfo = await this.userRepository.findOneBy({ openId: user.openId })
    if (!marketItem) {
      return ResponseData.fail('该商品不存在');
    }

    marketItem.status = MarketStatus.used;
    const task = new Task();
    task.credit = 0
    task.title = `${market.title}(卡券任务)`
    task.desc = `${market.desc}-->由(${userInfo.nickname})发起`
    task.status = TaskStatus.pending;
    task.openId = userInfo.ass_openId;
    task.isDelete = false;
    task.sticky_id = 1
    task.isSticky = false
    await this.taskRepository.save(task)
    await this.marketItemRepository.save(marketItem);
    return ResponseData.ok();
  }
}
