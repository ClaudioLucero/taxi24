import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../app.module';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { typeOrmTestConfig } from '../../../infrastructure/database/typeorm.test.config';
import { Driver } from '../../../domain/entities/driver.entity';

describe('Drivers Integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule, TypeOrmModule.forRoot(typeOrmTestConfig)],
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

  it('should list all drivers', async () => {
    const response = await request(app.getHttpServer())
      .get('/drivers')
      .expect(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should list available drivers', async () => {
    const response = await request(app.getHttpServer())
      .get('/drivers/available')
      .expect(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(
      (response.body as Driver[]).every(
        (driver) => driver.status === 'available'
      )
    ).toBe(true);
  });

  it('should list nearby drivers', async () => {
    const response = await request(app.getHttpServer())
      .get('/drivers/nearby')
      .query({ latitude: 40.7128, longitude: -74.006, radius: 3 })
      .expect(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return empty list for no nearby drivers', async () => {
    const response = await request(app.getHttpServer())
      .get('/drivers/nearby')
      .query({ latitude: 0, longitude: 0, radius: 1 })
      .expect(200);
    expect(response.body).toEqual([]);
  });

  it('should return 400 for invalid latitude', async () => {
    await request(app.getHttpServer())
      .get('/drivers/nearby')
      .query({ latitude: 'invalid', longitude: -74.006, radius: 3 })
      .expect(400);
  });

  it('should return 400 for negative radius', async () => {
    await request(app.getHttpServer())
      .get('/drivers/nearby')
      .query({ latitude: 40.7128, longitude: -74.006, radius: -1 })
      .expect(400);
  });
});
