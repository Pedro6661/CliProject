import { Product } from '../models/Product';
import { CategoryService } from './CategoryService';
import { AppDataSource } from '../config/data-source';

export class ProductService {
    private productRepository = AppDataSource.getRepository(Product);
    private categoryService: CategoryService;

    constructor(categoryService: CategoryService) {
        this.categoryService = categoryService;
    }

    async addProduct(product: Product): Promise<void> {
        const existingProduct = await this.productRepository.findOneBy({ id: product.id });
        if (existingProduct) {
            throw new Error('Produto já existe com este ID');
        }

        // Validar se a categoria existe
        await this.categoryService.validateCategoryExists(product.categoryId);
        await this.productRepository.save(product);
    }

    async getAllProducts(): Promise<Product[]> {
        return await this.productRepository.find({
            relations: ['category']
        });
    }

    async getProductById(id: string): Promise<Product | null> {
        return await this.productRepository.findOneBy({ id });
    }

    async getProductsByCategory(categoryId: string): Promise<Product[]> {
        return await this.productRepository.find({
            where: { categoryId }
        });
    }

    async updateProduct(id: string, updatedProduct: Partial<Product>): Promise<void> {
        const product = await this.getProductById(id);
        if (!product) {
            throw new Error('Produto não encontrado');
        }

        // Se estiver atualizando a categoria, validar se a nova categoria existe
        if (updatedProduct.categoryId) {
            await this.categoryService.validateCategoryExists(updatedProduct.categoryId);
        }

        await this.productRepository.update(id, updatedProduct);
    }

    async deleteProduct(id: string): Promise<void> {
        const result = await this.productRepository.delete(id);
        if (result.affected === 0) {
            throw new Error('Produto não encontrado');
        }
    }

    async updateStock(id: string, quantity: number): Promise<void> {
        const product = await this.getProductById(id);
        if (!product) {
            throw new Error('Produto não encontrado');
        }
        await this.productRepository.update(id, { quantity });
    }
} 