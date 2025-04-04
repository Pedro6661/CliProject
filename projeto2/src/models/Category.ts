import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Category {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => Product, product => product.category)
    products!: Product[];

    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
} 