import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultValue1733287669257 implements MigrationInterface {
  name = 'AddDefaultValue1733287669257';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_discount\` CHANGE \`date_used\` \`date_used\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` CHANGE \`status\` \`status\` enum ('scheduled', 'ongoing', 'finished') NOT NULL DEFAULT 'scheduled'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event\` CHANGE \`status\` \`status\` enum ('scheduled', 'ongoing', 'finished') NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_discount\` CHANGE \`date_used\` \`date_used\` timestamp NOT NULL`,
    );
  }
}
