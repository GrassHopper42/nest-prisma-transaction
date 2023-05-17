import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it('success', async () => {
    const users = [
      {
        email: 'success1@test.com',
        name: 'success1',
      },
      {
        email: 'success2@test.com',
        name: 'success2',
      },
      {
        email: 'success3@test.com',
        name: 'success3',
      },
    ];

    return await request(app.getHttpServer())
      .post('/success')
      .send(users)
      .expect(200)
      .then(async () => {
        const result = await prisma.user.findMany();
        expect(result.length).toBe(3);
      });
  });

  it('fail', async () => {
    const users = [
      {
        email: 'fail1@test.com',
        name: 'fail1',
      },
      {
        email: 'fail2@test.com',
        name: 'fail2',
      },
    ];

    return await request(app.getHttpServer())
      .post('/fail')
      .send(users)
      .expect(400)
      .then(async () => {
        const result = await prisma.user.findMany();
        expect(result.length).toBe(0);
      });
  });

  it('non-transaction', async () => {
    const users = [
      {
        email: 'success1@test.com',
        name: 'success1',
      },
      {
        email: 'success2@test.com',
        name: 'success2',
      },
      {
        email: 'success3@test.com',
        name: 'success3',
      },
    ];

    return await request(app.getHttpServer())
      .post('/non-transaction')
      .send(users)
      .expect(400)
      .then(async () => {
        const result = await prisma.user.findMany();
        expect(result.length).toBe(1);
      });
  });
});
