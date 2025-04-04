import { DataSource } from "typeorm";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { InitialMigration1709700000000 } from "../migrations/1709700000000-InitialMigration";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: false, // Desativado para usar migrations
    logging: true,
    entities: [Category, Product],
    migrations: [InitialMigration1709700000000],
    subscribers: [],
}); 