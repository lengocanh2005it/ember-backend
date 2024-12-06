import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueNameTablePermission1733197952747
  implements MigrationInterface
{
  name = 'AddUniqueNameTablePermission1733197952747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`permission\` ADD UNIQUE INDEX \`IDX_240853a0c3353c25fb12434ad3\` (\`name\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`permission\` DROP INDEX \`IDX_240853a0c3353c25fb12434ad3\``,
    );
  }
}
