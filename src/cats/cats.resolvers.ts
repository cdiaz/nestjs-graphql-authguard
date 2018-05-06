import { Injectable, UseGuards } from '@nestjs/common';
import {
  Query,
  Mutation,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { Cat } from './interfaces/cat.interface';
import { CatsService } from './cats.service';
import { CatsGuard } from './cats.guard';
import { AuthGuard } from '@nestjs/passport';

const pubSub = new PubSub();

@Resolver('Cat')
export class CatsResolvers {
  constructor(private readonly catsService: CatsService) {}

  @Query()
  @UseGuards(AuthGuard('jwt'))
  async getCats() {
    return await this.catsService.findAll();
  }

  @Query('cat')
  @UseGuards(AuthGuard('jwt'))
  async findOneById(obj, args, context, info): Promise<Cat> {
    const { id } = args;
    return await this.catsService.findOneById(+id);
  }

  @Mutation('createCat')
  @UseGuards(AuthGuard('jwt'))
  async create(obj, args: Cat, context, info): Promise<Cat> {
    const createdCat = await this.catsService.create(args);
    pubSub.publish('catCreated', { catCreated: createdCat });
    return createdCat;
  }

  @Subscription('catCreated')
  catCreated() {
    return {
      subscribe: () => pubSub.asyncIterator('catCreated'),
    };
  }
}
