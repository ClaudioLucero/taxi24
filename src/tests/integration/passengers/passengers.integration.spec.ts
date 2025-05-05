import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../app.module';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { typeOrmTestConfig } from '../../../infrastructure/database/typeorm.test.config';

describe('Passengers Integration', () => {
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

  it('should list passengers', async () => {
    const response = await request(app.getHttpServer())
      .get('/passengers')
      .expect(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a passenger by ID', async () => {
    const passengerId = '550e8400-e29b-41d4-a716-446655440003'; // De SeedTestData
    const response = await request(app.getHttpServer())
      .get(`/passengers/${passengerId}`)
      .expect(200);
    expect(response.body).toMatchObject({
      id: passengerId,
      name: 'Ana Martínez',
    });
  });

  it('should create a passenger', async () => {
    const response = await request(app.getHttpServer())
      .post('/passengers')
      .send({ name: 'Test Passenger', phone: '1234567890' })
      .expect(201);
    expect(response.body).toMatchObject({
      name: 'Test Passenger',
      phone: '1234567890',
    });
  });

  it('should return 400 for invalid passenger ID', async () => {
    await request(app.getHttpServer())
      .get('/passengers/non-existent-id')
      .expect(400);
  });

  it('should return 404 for non-existent passenger', async () => {
    const nonExistentId = '550e8400-e29b-41d4-a716-999999999999'; // UUID válido pero inexistente
    await request(app.getHttpServer())
      .get(`/passengers/${nonExistentId}`)
      .expect(404);
  });
  it('should list nearby drivers for passenger', async () => {
    const passengerId = '550e8400-e29b-41d4-a716-446655440003';
    const response = await request(app.getHttpServer())
      .get(`/passengers/${passengerId}/nearby-drivers`)
      .expect(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(
      response.body.every(
        (driver: { status: string }) => driver.status === 'available'
      )
    ).toBe(true);
  });
});
