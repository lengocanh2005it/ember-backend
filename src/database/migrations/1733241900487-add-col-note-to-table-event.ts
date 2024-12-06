import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColNoteToTableEvent1733241900487 implements MigrationInterface {
  name = 'AddColNoteToTableEvent1733241900487';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`note\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`note\``);
  }
}
