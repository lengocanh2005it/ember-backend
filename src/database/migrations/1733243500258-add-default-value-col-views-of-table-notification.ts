import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultValueColViewsOfTableNotification1733243500258
  implements MigrationInterface
{
  name = 'AddDefaultValueColViewsOfTableNotification1733243500258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notification\` CHANGE \`views\` \`views\` int NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notification\` CHANGE \`views\` \`views\` int NOT NULL`,
    );
  }
}
