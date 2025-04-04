import { Category } from '../models/Category';
import { ProductService } from './ProductService';
import { AppDataSource } from '../config/data-source';

export class CategoryService {
    private categoryRepository = AppDataSource.getRepository(Category);
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    async addCategory(category: Category): Promise<void> {
        const existingCategory = await this.categoryRepository.findOneBy({ id: category.id });
        if (existingCategory) {
            throw new Error('Categoria já existe com este ID');
        }
        await this.categoryRepository.save(category);
    }

    async getAllCategories(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    async getCategoryById(id: string): Promise<Category | null> {
        return await this.categoryRepository.findOneBy({ id });
    }

    async updateCategory(id: string, updatedCategory: Partial<Category>): Promise<void> {
        const category = await this.getCategoryById(id);
        if (!category) {
            throw new Error('Categoria não encontrada');
        }
        await this.categoryRepository.update(id, updatedCategory);
    }

    async deleteCategory(id: string): Promise<void> {
        const linkedProducts = await this.productService.getProductsByCategory(id);
        if (linkedProducts.length > 0) {
            throw new Error('Não é possível remover esta categoria pois existem produtos vinculados a ela');
        }

        const result = await this.categoryRepository.delete(id);
        if (result.affected === 0) {
            throw new Error('Categoria não encontrada');
        }
    }

    async validateCategoryExists(id: string): Promise<void> {
        const category = await this.getCategoryById(id);
        if (!category) {
            throw new Error('Categoria não encontrada');
        }
    }
} 