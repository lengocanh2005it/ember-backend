import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveColProductIdFromTableCart1733213140974
  implements MigrationInterface
{
  name = 'RemoveColProductIdFromTableCart1733213140974';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`cart\` DROP COLUMN \`productId\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`cart\` ADD \`productId\` varchar(255) NOT NULL`,
    );
  }
}
