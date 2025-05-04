import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInvoicesTable1698765432108 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO invoices (id, trip_id, amount, created_at)
      VALUES
        ('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440006', 20.00, NOW())
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM invoices WHERE id = '550e8400-e29b-41d4-a716-446655440007'
    `);
  }
}