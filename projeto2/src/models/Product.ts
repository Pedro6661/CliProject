import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { Category } from "./Category";

@Entity()
export class Product {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price: number;

    @Column()
    quantity: number;

    @Column()
    categoryId: string;

    @ManyToOne(() => Category, category => category.products)
    category!: Category;

    constructor(id: string, name: string, description: string, price: number, quantity: number, categoryId: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.categoryId = categoryId;
    }
} 