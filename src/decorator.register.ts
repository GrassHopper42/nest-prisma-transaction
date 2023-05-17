import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  DiscoveryService,
  MetadataScanner,
  ModuleRef,
  Reflector,
} from '@nestjs/core';
import { ClsServiceManager } from 'nestjs-cls';
import { PrismaService } from './prisma.service';
import { TRANSACTION } from './transaction.decorator';

@Injectable()
export class DecoratorRegister implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    return this.discoveryService
      .getProviders()
      .filter((provider) => provider.isDependencyTreeStatic())
      .filter(({ instance }) => instance && Object.getPrototypeOf(instance))
      .forEach((provider) => {
        const { instance, host } = provider;
        this.metadataScanner.scanFromPrototype(
          instance,
          Object.getPrototypeOf(instance),
          (methodName) => {
            const isTransaction = this.reflector.get(
              TRANSACTION,
              instance[methodName],
            );

            if (!isTransaction || !host) {
              return;
            }

            const prisma = this.moduleRef.get(PrismaService, {
              strict: false,
            });

            const originalMethod = instance[methodName];

            instance[methodName] = async function (...args: any[]) {
              console.log('Transaction start');
              const cls = ClsServiceManager.getClsService();
              if (cls.get('PRISMA_TRANSACTION')) {
                return await originalMethod.apply(this, [...args]);
              }
              return await cls.run(async () => {
                const result = await prisma
                  .$transaction(async (tx) => {
                    cls.set('PRISMA_TRANSACTION', tx);
                    return await originalMethod.apply(this, [...args]);
                  })
                  .finally(() => {
                    cls.set('PRISMA_TRANSACTION', null);
                    console.log('Transaction end');
                  });
                return result;
              });
            };
          },
        );
      });
  }
}
