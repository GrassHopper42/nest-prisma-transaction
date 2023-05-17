import { User } from '@prisma/client';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository {
  async create(user: Pick<User, 'email' | 'name'>): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
      },
    });
  }
}
