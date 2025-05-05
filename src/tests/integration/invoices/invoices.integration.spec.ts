import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../app.module';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { typeOrmTestConfig } from '../../../infrastructure/database/typeorm.test.config';

describe('Invoices Integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          AppModule,
          TypeOrmModule.forRoot(typeOrmTestConfig),
        ],
      }).compile();

      app = moduleFixture.createNestApplication();
      const dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
      console.log('Running migrations...');
      await dataSource.runMigrations();
      console.log('Migrations completed.');

      console.log('Initializing app...');
      await app.init();
      console.log('App initialized.');
    } catch (error) {
      console.error('Error during app initialization:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await app.close();
    } catch (error) {
      console.error('Error during app cleanup:', error);
    }
  });

  it('should list invoices with passenger filter', async () => {
    const passengerId = '550e8400-e29b-41d4-a716-446655440004'; // De SeedTestData
    const response = await request(app.getHttpServer())
      .get('/invoices')
      .query({ passengerId })
      .expect(200);
    expect(response.body).toMatchObject({
      invoices: expect.any(Array),
      total: expect.any(Number),
    });
  });

  it('should return 400 for invalid trip invoice ID', async () => {
    await request(app.getHttpServer())
      .get('/trips/invalid-id/invoice')
      .expect(400);
  });

  it('should return invoice for existing trip', async () => {
    const tripId = '550e8400-e29b-41d4-a716-446655440006'; // De SeedTestData
    const response = await request(app.getHttpServer())
      .get(`/trips/${tripId}/invoice`)
      .expect(200);
    expect(response.body).toMatchObject({
      trip_id: tripId,
      amount: '20.00',
    });
  });
});