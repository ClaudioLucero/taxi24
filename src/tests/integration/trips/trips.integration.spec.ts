import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../app.module';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { typeOrmTestConfig } from '../../../infrastructure/database/typeorm.test.config';

describe('Trips Integration', () => {
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

  it('should list trips', async () => {
    const response = await request(app.getHttpServer())
      .get('/trips')
      .query({ page: 1, limit: 10 })
      .expect(200);
    expect(response.body).toMatchObject({
      trips: expect.any(Array),
      total: expect.any(Number),
    });
  });

  it('should get a trip by ID', async () => {
    const tripId = '550e8400-e29b-41d4-a716-446655440006';
    const response = await request(app.getHttpServer())
      .get(`/trips/${tripId}`)
      .expect(200);
    expect(response.body).toMatchObject({
      id: tripId,
      status: 'completed',
    });
  });

  it('should create a trip, complete it, and generate an invoice', async () => {
    const passengerResponse = await request(app.getHttpServer())
      .post('/passengers')
      .send({ name: 'Test Passenger', phone: '1234567890' })
      .expect(201);
    const passengerId = passengerResponse.body.id;

    const driverId = '550e8400-e29b-41d4-a716-446655440000';

    const tripResponse = await request(app.getHttpServer())
      .post('/trips')
      .send({
        driver_id: driverId,
        passenger_id: passengerId,
        start_latitude: 40.7128,
        start_longitude: -74.0060,
        end_latitude: 40.7300,
        end_longitude: -74.0000,
        status: 'active',
        cost: 25.00,
      })
      .expect(201);
    const tripId = tripResponse.body.id;

    await request(app.getHttpServer())
      .patch(`/trips/${tripId}/complete`)
      .send({ cost: 25.00 })
      .expect(200);

    const invoiceResponse = await request(app.getHttpServer())
      .get(`/trips/${tripId}/invoice`)
      .expect(200);

    expect(invoiceResponse.body).toMatchObject({
      trip_id: tripId,
      amount: '25.00',
    });
  });

  it('should return 400 for invalid passenger ID', async () => {
    await request(app.getHttpServer())
      .post('/trips')
      .send({
        driver_id: '550e8400-e29b-41d4-a716-446655440000',
        passenger_id: 'non-existent-id',
        start_latitude: 40.7128,
        start_longitude: -74.0060,
        end_latitude: 40.7300,
        end_longitude: -74.0000,
        status: 'active',
        cost: 25.00,
      })
      .expect(400);
  });

  it('should fail to create a trip with non-existent passenger', async () => {
    const nonExistentId = '550e8400-e29b-41d4-a716-999999999999';
    await request(app.getHttpServer())
      .post('/trips')
      .send({
        driver_id: '550e8400-e29b-41d4-a716-446655440000',
        passenger_id: nonExistentId,
        start_latitude: 40.7128,
        start_longitude: -74.0060,
        end_latitude: 40.7300,
        end_longitude: -74.0000,
        status: 'active',
        cost: 25.00,
      })
      .expect(404);
  });

  it('should fail to complete a non-active trip', async () => {
    const tripId = '550e8400-e29b-41d4-a716-446655440006';
    await request(app.getHttpServer())
      .patch(`/trips/${tripId}/complete`)
      .send({ cost: 25.00 })
      .expect(400);
  });
});