import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1709700000000 implements MigrationInterface {
    name = 'InitialMigration1709700000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "category" (
                "id" varchar PRIMARY KEY NOT NULL,
                "name" varchar NOT NULL,
                "description" varchar NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "product" (
                "id" varchar PRIMARY KEY NOT NULL,
                "name" varchar NOT NULL,
                "description" varchar NOT NULL,
                "price" decimal(10,2) NOT NULL,
                "quantity" integer NOT NULL,
                "categoryId" varchar NOT NULL,
                CONSTRAINT "FK_Product_Category" FOREIGN KEY ("categoryId") REFERENCES "category"("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }
} 