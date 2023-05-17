import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';
import { DecoratorRegister } from './decorator.register';
import { PrismaService } from './prisma.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    DiscoveryModule,
    ClsModule.forRoot({
      global: true,
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    DecoratorRegister,
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
  ],
})
export class AppModule {}
