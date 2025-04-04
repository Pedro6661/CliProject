import { Category } from '../models/Category';
import { ProductService } from './ProductService';

export class CategoryService {
    private categories: Category[] = [];
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    addCategory(category: Category): void {
        if (this.categories.some(c => c.id === category.id)) {
            throw new Error('Categoria já existe com este ID');
        }
        this.categories.push(category);
    }

    getAllCategories(): Category[] {
        return [...this.categories];
    }

    getCategoryById(id: string): Category | undefined {
        return this.categories.find(c => c.id === id);
    }

    updateCategory(id: string, updatedCategory: Partial<Category>): void {
        const index = this.categories.findIndex(c => c.id === id);
        if (index === -1) {
            throw new Error('Categoria não encontrada');
        }
        this.categories[index] = { ...this.categories[index], ...updatedCategory };
    }

    deleteCategory(id: string): void {
        const linkedProducts = this.productService.getProductsByCategory(id);
        if (linkedProducts.length > 0) {
            throw new Error('Não é possível remover esta categoria pois existem produtos vinculados a ela');
        }

        const index = this.categories.findIndex(c => c.id === id);
        if (index === -1) {
            throw new Error('Categoria não encontrada');
        }
        this.categories.splice(index, 1);
    }

    validateCategoryExists(id: string): void {
        if (!this.getCategoryById(id)) {
            throw new Error('Categoria não encontrada');
        }
    }
} 