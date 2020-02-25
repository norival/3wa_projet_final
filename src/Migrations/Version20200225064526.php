<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200225064526 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE view_asset (id INT AUTO_INCREMENT NOT NULL, view_id INT NOT NULL, asset_id INT NOT NULL, INDEX IDX_608CFD4F31518C7 (view_id), INDEX IDX_608CFD4F5DA1941 (asset_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE view_content (id INT AUTO_INCREMENT NOT NULL, view_id INT NOT NULL, content_id INT NOT NULL, INDEX IDX_D798255331518C7 (view_id), INDEX IDX_D798255384A0A3ED (content_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE view_asset ADD CONSTRAINT FK_608CFD4F31518C7 FOREIGN KEY (view_id) REFERENCES view (id)');
        $this->addSql('ALTER TABLE view_asset ADD CONSTRAINT FK_608CFD4F5DA1941 FOREIGN KEY (asset_id) REFERENCES asset (id)');
        $this->addSql('ALTER TABLE view_content ADD CONSTRAINT FK_D798255331518C7 FOREIGN KEY (view_id) REFERENCES view (id)');
        $this->addSql('ALTER TABLE view_content ADD CONSTRAINT FK_D798255384A0A3ED FOREIGN KEY (content_id) REFERENCES content (id)');
        $this->addSql('ALTER TABLE view ADD user_id INT DEFAULT NULL, DROP content_type, CHANGE updated_at updated_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE view ADD CONSTRAINT FK_FEFDAB8EA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_FEFDAB8EA76ED395 ON view (user_id)');
        $this->addSql('ALTER TABLE user CHANGE roles roles JSON NOT NULL');
        $this->addSql('ALTER TABLE asset ADD user_id INT DEFAULT NULL, CHANGE description description VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE asset ADD CONSTRAINT FK_2AF5A5CA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_2AF5A5CA76ED395 ON asset (user_id)');
        $this->addSql('ALTER TABLE content CHANGE updated_at updated_at DATETIME DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE view_asset');
        $this->addSql('DROP TABLE view_content');
        $this->addSql('ALTER TABLE asset DROP FOREIGN KEY FK_2AF5A5CA76ED395');
        $this->addSql('DROP INDEX IDX_2AF5A5CA76ED395 ON asset');
        $this->addSql('ALTER TABLE asset DROP user_id, CHANGE description description VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE content CHANGE updated_at updated_at DATETIME DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE user CHANGE roles roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE view DROP FOREIGN KEY FK_FEFDAB8EA76ED395');
        $this->addSql('DROP INDEX IDX_FEFDAB8EA76ED395 ON view');
        $this->addSql('ALTER TABLE view ADD content_type LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci` COMMENT \'(DC2Type:array)\', DROP user_id, CHANGE updated_at updated_at DATETIME DEFAULT \'NULL\'');
    }
}
