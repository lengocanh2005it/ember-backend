import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultValueAndNullableToTables1733286588632
  implements MigrationInterface
{
  name = 'AddDefaultValueAndNullableToTables1733286588632';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` CHANGE \`status\` \`status\` enum ('pending', 'success', 'error') NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` CHANGE \`currency\` \`currency\` enum ('usd', 'vnd') NOT NULL DEFAULT 'usd'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` CHANGE \`status\` \`status\` enum ('pending', 'success', 'error') NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`review\` CHANGE \`rating_number\` \`rating_number\` int NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`review\` CHANGE \`rating_number\` \`rating_number\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` CHANGE \`status\` \`status\` enum ('pending', 'success', 'error') NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` CHANGE \`currency\` \`currency\` enum ('usd', 'vnd') NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` CHANGE \`status\` \`status\` enum ('pending', 'success', 'error') NOT NULL`,
    );
  }
}
