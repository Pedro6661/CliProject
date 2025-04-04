import { Product } from '../models/Product';
import { CategoryService } from './CategoryService';

export class ProductService {
    private products: Product[] = [];
    private categoryService: CategoryService;

    constructor(categoryService: CategoryService) {
        this.categoryService = categoryService;
    }

    addProduct(product: Product): void {
        if (this.products.some(p => p.id === product.id)) {
            throw new Error('Produto já existe com este ID');
        }

        // Validar se a categoria existe
        this.categoryService.validateCategoryExists(product.categoryId);
        this.products.push(product);
    }

    getAllProducts(): Product[] {
        return [...this.products];
    }

    getProductById(id: string): Product | undefined {
        return this.products.find(p => p.id === id);
    }

    getProductsByCategory(categoryId: string): Product[] {
        return this.products.filter(p => p.categoryId === categoryId);
    }

    updateProduct(id: string, updatedProduct: Partial<Product>): void {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Produto não encontrado');
        }

        // Se estiver atualizando a categoria, validar se a nova categoria existe
        if (updatedProduct.categoryId) {
            this.categoryService.validateCategoryExists(updatedProduct.categoryId);
        }

        this.products[index] = { ...this.products[index], ...updatedProduct };
    }

    deleteProduct(id: string): void {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Produto não encontrado');
        }
        this.products.splice(index, 1);
    }

    updateStock(id: string, quantity: number): void {
        const product = this.getProductById(id);
        if (!product) {
            throw new Error('Produto não encontrado');
        }
        product.quantity = quantity;
    }
} 