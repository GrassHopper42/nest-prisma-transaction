import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { PrismaService } from './prisma.service';

@Injectable()
export class BaseRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clsService: ClsService,
  ) {}

  get prisma() {
    const tx = this.clsService.get('PRISMA_TRANSACTION') as PrismaService;
    if (this.clsService.isActive() && tx) return tx;
    return this.prismaService;
  }
}
