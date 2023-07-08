import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { AopModule } from '@toss/nestjs-aop';
import { ClsModule } from 'nestjs-cls';
import { PrismaService } from './prisma.service';
import { TransactionDecorator } from './transaction.decorator';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    DiscoveryModule,
    ClsModule.forRoot({
      global: true,
    }),
    AopModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: PrismaService,
      useFactory: () => {
        return new PrismaService({
          log: ['query', 'info', 'warn', 'error'],
          errorFormat: 'pretty',
        });
      },
    },
    UserRepository,
    TransactionDecorator,
  ],
})
export class AppModule {}
