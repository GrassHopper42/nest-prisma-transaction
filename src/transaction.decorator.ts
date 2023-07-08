import {
  Aspect,
  createDecorator,
  LazyDecorator,
  WrapParams,
} from '@toss/nestjs-aop';
import { ClsServiceManager } from 'nestjs-cls';
import { PrismaService } from './prisma.service';

export const TRANSACTION = Symbol('TRANSACTION');

@Aspect(TRANSACTION)
export class TransactionDecorator implements LazyDecorator {
  constructor(private readonly prisma: PrismaService) {}

  wrap({ method }: WrapParams<any, unknown>) {
    return async (...args: any) => {
      console.log('Transaction start');
      const cls = ClsServiceManager.getClsService();
      if (cls.get('PRISMA_TRANSACTION')) {
        return await method(...args);
      }
      return await cls.run(async () => {
        const result = await this.prisma
          .$transaction(async (tx) => {
            cls.set('PRISMA_TRANSACTION', tx);
            return await method.apply(this, [...args]);
          })
          .finally(() => {
            cls.set('PRISMA_TRANSACTION', null);
            console.log('Transaction end');
          });
        return result;
      });
    };
  }
}

export const Transactional = () => createDecorator(TRANSACTION);
