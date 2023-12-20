import { PageDto } from './../../request/page.dto';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserUpdateDto } from '../dto/req-user.dto';
import { ResponseData } from 'src/request/response-data';
import { BlackList } from '../entities/blacklist.entity';
import { Market } from 'src/market/entities/market.entity';
import { MarketStatus } from 'src/market/market.enum';
import { MarketListDto } from 'src/market/dto/req-market.dto';
import { Task } from 'src/task/entities/task.entity';
import { TaskStatus } from 'src/task/task.enum';

@Injectable()
export class UserService {
    blackSet = new Set<string>()

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(BlackList)
        private blackRepository: Repository<BlackList>,
        @InjectRepository(Market)
        private marketRepository: Repository<Market>,
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) {
        this.initBlackList()
    }

    queryUserById(id: string) {
        return this.userRepository.findOneBy({ openId: id })
    }

    async findUser(id: string) {
        //nest的查询语句，这句意思和 findOne 一样，根据表当中的某个字段获取一个
        let user = await this.userRepository.findOneBy({ openId: id })
        //可以通过find系列获取多个，那时需要代码和数量了
        if (!user) {
            // throw new HttpException('没找到用户', 204)
            return ResponseData.fail('该用户不存在')
        }
        if (user.ass_openId) {
            let assUser = await this.userRepository.findOneBy({ openId: user.ass_openId })
            user.assUser = assUser
        }
        const count = await this.getUserCollectCount(id)
        return ResponseData.ok({ ...user, ...count });
    }

    //更新用户信息
    async updateUser(
        userInfo: UserUpdateDto,
        user: User,
    ) {
        user = await this.userRepository.findOneBy({
            openId: user.openId
        })
        if (!user) {
            // 可以抛出一个异常告诉没找到，一般直接返回
            // throw new HttpException('该用户不存在', 204)
            return ResponseData.fail('该用户不存在')
        }

        // 手动赋值，最累，但是存在问题最少
        // if (userInfo.age) user.age = userInfo.age;
        // if (userInfo.mobile) user.mobile = userInfo.mobile;
        if (userInfo.nickname) user.nickname = userInfo.nickname;
        if (userInfo.desc) user.desc = userInfo.desc;
        // if (userInfo.sex) user.sex = userInfo.sex;
        if (userInfo.face) user.face = userInfo.face;
        if (userInfo.ass_openId) {
            user.ass_openId = userInfo.ass_openId;

            /** 给另一方也绑定 */
            let assUser = await this.userRepository.findOneBy({
                openId: user.ass_openId
            })
            assUser.ass_openId = user.openId
            if (!assUser.nickname) assUser.nickname = '取个名字吧'
            if (!user.desc) user.desc = '点击去编辑个人信息'
            await this.userRepository.save(assUser)
            user.assUser = assUser
        } else if (user.ass_openId) {
            let assUser = await this.userRepository.findOneBy({ openId: user.ass_openId })
            user.assUser = assUser
        }

        await this.userRepository.save(user)
        return ResponseData.ok(user)
    }


    //注销用户
    async unregister(
        user: User,
    ) {
        let black = await this.blackRepository.findOneBy({
            openId: user.openId
        })
        console.log(user)
        if (!black) {
            this.blackSet.add(user.openId)
            black = new BlackList()
            black.openId = user.openId
            await this.blackRepository.save(black)
        }
        return ResponseData.ok('注销成功');
    }

    //恢复用户
    async recoverUser(
        user: User,
    ) {
        let black = await this.blackRepository.findOneBy({
            openId: user.openId
        })
        if (black) {
            await this.blackRepository.delete({
                openId: user.openId
            })
            this.blackSet.delete(user.openId)
        }
        return ResponseData.ok('恢复成功');
    }

    async initBlackList() {
        //初始化黑名单
        let blackList = await this.blackRepository.find()
        let set = this.blackSet
        blackList.forEach(function (e) {
            set.add(e.openId)
        })
    }

    async deleteBlackList(
        openId: string,
    ) {
        this.blackSet.delete(openId)
        await this.blackRepository.delete({ openId })
    }

    //我的收藏
    async getUserCollectCard(
        body: MarketListDto,
        user: User,
    ) {
        let page = new PageDto(body)
        const market = await this.marketRepository
            .createQueryBuilder('market')
            .where('market.openId = :openId', { openId: user.openId })
            .andWhere('market.status = :status', { status: `${MarketStatus.published}` })
            .andWhere('market.isCollect = :isCollect', { isCollect: true })
            .orderBy('market.createTime', 'DESC')
            .skip(page.skip)
            .take(page.take)
            .getManyAndCount()
        return ResponseData.pageOk(market, page);
    }
    //我的商品卡券
    async getUserCard(
        body: MarketListDto,
        user: User,
    ) {
        let page = new PageDto(body)
        const { id } = await this.marketRepository.findOneBy({
            openId: user.openId
        })
        const markets = await this.userRepository
            .createQueryBuilder("user")
            // .select(["market.*", "marketItem.userId"])
            .select(["marketItem.*", "market.title AS title", "market.credit AS credit", "market.buyTime AS buyTime"])
            .leftJoin("user.marketItems", "marketItem")
            .leftJoin("marketItem.market", "market")
            .andWhere("user.id = :id", { id })
            .andWhere('marketItem.status = :status', { status: `${MarketStatus.pending}` })
            .skip(page.skip)
            .take(page.take)
            .getRawMany()
        const count = await this.getUserCardCount(user.openId)
        return ResponseData.pageOk([markets, count], page);
    }
    async getUserCollectCount(openId: string) {
        const collect = await this.marketRepository
            .createQueryBuilder('market')
            .where('market.openId = :openId', { openId })
            .andWhere('market.status = :status', { status: `${MarketStatus.published}` })
            .andWhere('market.isCollect = :isCollect', { isCollect: true })
            .getCount()
        const market = await this.getUserCardCount(openId)
        const completeTask = await this.getUserTaskCount(openId, TaskStatus.complete)
        const failureTask = await this.getUserTaskCount(openId, TaskStatus.failure)
        const auditTask = await this.getUserTaskCount(openId, TaskStatus.audit)
        return {
            market,
            completeTask,
            failureTask,
            auditTask,
            collect
        }
    }

    async getUserCardCount(openId: string) {
        const { id } = await this.marketRepository.findOneBy({ openId })
        const market = await this.userRepository
            .createQueryBuilder("user")
            .select(["market.*", "marketItem.userId"])
            .leftJoin("user.marketItems", "marketItem")
            .leftJoin("marketItem.market", "market")
            .andWhere("user.id = :id", { id })
            .andWhere("marketItem.status = :status", { status: `${MarketStatus.pending}` })
            .getRawMany()
        return market.length
    }
    async getUserTaskCount(openId: string, status: TaskStatus) {
        const task = await this.taskRepository
            .createQueryBuilder('task')
            .where('task.openId = :openId', { openId })
            .andWhere('task.status = :status', { status })
            .getCount()
        return task
    }
}
