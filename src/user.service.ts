import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Transactionl } from './transaction.decorator';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  @Transactionl()
  async test(users: Pick<User, 'email' | 'name'>[], fail: boolean) {
    const user1 = users.reverse().pop();
    if (!user1) throw new Error('User not found');
    await this.repository.create(user1);
    if (fail) throw new Error('fail');
    await Promise.all(
      users.reverse().map(async (user) => await this.repository.create(user)),
    );
  }

  async test2(users: Pick<User, 'email' | 'name'>[], fail: boolean) {
    const user1 = users.reverse().pop();
    if (!user1) throw new Error('User not found');
    await this.repository.create(user1);
    if (fail) throw new Error('fail');
    await Promise.all(
      users.reverse().map(async (user) => await this.repository.create(user)),
    );
  }
}
