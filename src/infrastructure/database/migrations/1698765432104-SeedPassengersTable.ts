import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPassengersTable1698765432104 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO passengers (id, name, phone, created_at)
      VALUES
        ('550e8400-e29b-41d4-a716-446655440003', 'Ana Martínez', '1112223333', NOW()),
        ('550e8400-e29b-41d4-a716-446655440004', 'Luis Fernández', '4445556666', NOW())
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM passengers WHERE id IN (
        '550e8400-e29b-41d4-a716-446655440003',
        '550e8400-e29b-41d4-a716-446655440004'
      )
    `);
  }
}
