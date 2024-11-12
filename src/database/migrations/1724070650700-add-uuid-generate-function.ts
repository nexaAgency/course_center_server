import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUuidGenerateFunction1724070650700
  implements MigrationInterface
{
  name = 'AddUuidGenerateFunction1724070650700';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP EXTENSION IF EXISTS "uuid-ossp";
        `);
  }
}
