import { applyDecorators, SetMetadata } from '@nestjs/common';

export const TRANSACTION = Symbol('TRANSACTION');

export function Transactionl() {
  return applyDecorators(SetMetadata(TRANSACTION, true));
}
