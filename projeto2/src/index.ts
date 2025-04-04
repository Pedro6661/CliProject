import promptSync from 'prompt-sync';
import { CategoryService } from './services/CategoryService';
import { ProductService } from './services/ProductService';
import { Category } from './models/Category';
import { Product } from './models/Product';
import { AppDataSource } from './config/data-source';

const prompt = promptSync();

// Inicialização dos serviços com resolução da dependência circular
const productService = new ProductService(null as any); // Temporariamente passa null
const categoryService = new CategoryService(productService);
// Atualiza a referência do categoryService no productService
Object.defineProperty(productService, 'categoryService', {
    value: categoryService,
    writable: false,
    configurable: false
});

async function initializeDatabase() {
    try {
        await AppDataSource.initialize();
        console.log('Banco de dados inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
        process.exit(1);
    }
}

async function showMainMenu(): Promise<void> {
    while (true) {
        console.clear();
        console.log('=== Sistema de Gerenciamento de Inventário ===');
        console.log('1. Gerenciar Categorias');
        console.log('2. Gerenciar Produtos');
        console.log('0. Sair');

        const option = prompt('Escolha uma opção: ');

        switch (option) {
            case '1':
                await showCategoryMenu();
                break;
            case '2':
                await showProductMenu();
                break;
            case '0':
                console.log('Até logo!');
                return;
            default:
                console.log('Opção inválida!');
                prompt('Pressione ENTER para continuar...');
        }
    }
}

async function showCategoryMenu(): Promise<void> {
    while (true) {
        console.clear();
        console.log('=== Gerenciamento de Categorias ===');
        console.log('1. Adicionar Categoria');
        console.log('2. Listar Categorias');
        console.log('3. Atualizar Categoria');
        console.log('4. Remover Categoria');
        console.log('0. Voltar');

        const option = prompt('Escolha uma opção: ');

        switch (option) {
            case '1':
                await addCategory();
                break;
            case '2':
                await listCategories();
                break;
            case '3':
                await updateCategory();
                break;
            case '4':
                await deleteCategory();
                break;
            case '0':
                return;
            default:
                console.log('Opção inválida!');
                prompt('Pressione ENTER para continuar...');
        }
    }
}

async function showProductMenu(): Promise<void> {
    while (true) {
        console.clear();
        console.log('=== Gerenciamento de Produtos ===');
        console.log('1. Adicionar Produto');
        console.log('2. Listar Produtos');
        console.log('3. Atualizar Produto');
        console.log('4. Remover Produto');
        console.log('5. Atualizar Estoque');
        console.log('0. Voltar');

        const option = prompt('Escolha uma opção: ');

        switch (option) {
            case '1':
                await addProduct();
                break;
            case '2':
                await listProducts();
                break;
            case '3':
                await updateProduct();
                break;
            case '4':
                await deleteProduct();
                break;
            case '5':
                await updateStock();
                break;
            case '0':
                return;
            default:
                console.log('Opção inválida!');
                prompt('Pressione ENTER para continuar...');
        }
    }
}

// Funções de gerenciamento de categorias
async function addCategory(): Promise<void> {
    console.clear();
    console.log('=== Adicionar Categoria ===');
    
    const id = prompt('ID: ');
    const name = prompt('Nome: ');
    const description = prompt('Descrição: ');

    try {
        await categoryService.addCategory(new Category(id, name, description));
        console.log('Categoria adicionada com sucesso!');
    } catch (error: any) {
        console.log('Erro:', error.message);
    }
    prompt('Pressione ENTER para continuar...');
}

async function listCategories(): Promise<void> {
    console.clear();
    console.log('=== Lista de Categorias ===');
    
    try {
        const categories = await categoryService.getAllCategories();
        if (categories.length === 0) {
            console.log('Nenhuma categoria cadastrada.');
        } else {
            categories.forEach(category => {
                console.log(`\nID: ${category.id}`);
                console.log(`Nome: ${category.name}`);
                console.log(`Descrição: ${category.description}`);
            });
        }
    } catch (error: any) {
        console.log('Erro:', error.message);
    }
    prompt('Pressione ENTER para continuar...');
}

async function updateCategory(): Promise<void> {
    console.clear();
    console.log('=== Atualizar Categoria ===');
    
    const id = prompt('ID da categoria a ser atualizada: ');
    const name = prompt('Novo nome (deixe em branco para manter): ');
    const description = prompt('Nova descrição (deixe em branco para manter): ');

    try {
        const updates: Partial<Category> = {};
        if (name) updates.name = name;
        if (description) updates.description = description;
        
        await categoryService.updateCategory(id, updates);
        console.log('Categoria atualizada com sucesso!');
    } catch (error: any) {
        console.log('Erro:', error.message);
    }
    prompt('Pressione ENTER para continuar...');
}

async function deleteCategory(): Promise<void> {
    console.clear();
    console.log('=== Remover Categoria ===');
    
    const id = prompt('ID da categoria a ser removida: ');

    try {
        await categoryService.deleteCategory(id);
        console.log('Categoria removida com sucesso!');
    } catch (error: any) {
        console.log('Erro:', error.message);
    }
    prompt('Pressione ENTER para continuar...');
}

// Funções de gerenciamento de produtos
async function addProduct(): Promise<void> {
    console.clear();
    console.log('=== Adicionar Produto ===');
    
    const id = prompt('ID: ');
    const name = prompt('Nome: ');
    const description = prompt('Descrição: ');
    const price = parseFloat(prompt('Preço: '));
    const quantity = parseInt(prompt('Quantidade: '));
    const categoryId = prompt('ID da Categoria: ');

    try {
        await productService.addProduct(new Product(id, name, description, price, quantity, categoryId));
        console.log('Produto adicionado com sucesso!');
    } catch (error: any) {
        console.log('Erro:', error.message);
    }
    prompt('Pressione ENTER para continuar...');
}

async function listProducts(): Promise<void> {
    console.clear();
    console.log('=== Lista de Produtos ===');
    
    try {
        const products = await productService.getAllProducts();
        if (products.length === 0) {
            console.log('Nenhum produto cadastrado.');
        } else {
            products.forEach(product => {
                console.log(`\nID: ${product.id}`);
                console.log(`Nome: ${product.name}`);
                console.log(`Descrição: ${product.description}`);
                console.log(`Preço: R$ ${product.price.toFixed(2)}`);
                console.log(`Quantidade: ${product.quantity}`);
                console.log(`Categoria: ${product.category?.name || 'N/A'}`);
            });
        }
    } catch (error: any) {
        console.log('Erro:', error.message);
    }
    prompt('Pressione ENTER para continuar...');
}

async function updateProduct(): Promise<void> {
    console.clear();
    console.log('=== Atualizar Produto ===');
    
    const id = prompt('ID do produto a ser atualizado: ');
    const name = prompt('Novo nome (deixe em branco para manter): ');
    const description = prompt('Nova descrição (deixe em branco para manter): ');
    const priceStr = prompt('Novo preço (deixe em branco para manter): ');
    const quantityStr = prompt('Nova quantidade (deixe em branco para manter): ');
    const categoryId = prompt('Novo ID da categoria (deixe em branco para manter): ');

    try {
        const updates: Partial<Product> = {};
        if (name) updates.name = name;
        if (description) updates.description = description;
        if (priceStr) updates.price = parseFloat(priceStr);
        if (quantityStr) updates.quantity = parseInt(quantityStr);
        if (categoryId) updates.categoryId = categoryId;
        
        await productService.updateProduct(id, updates);
        console.log('Produto atualizado com sucesso!');
    } catch (error: any) {
        console.log('Erro:', error.message);
    }
    prompt('Pressione ENTER para continuar...');
}

async function deleteProduct(): Promise<void> {
    console.clear();
    console.log('=== Remover Produto ===');
    
    const id = prompt('ID do produto a ser removido: ');

    try {
        await productService.deleteProduct(id);
        console.log('Produto removido com sucesso!');
    } catch (error: any) {
        console.log('Erro:', error.message);
    }
    prompt('Pressione ENTER para continuar...');
}

async function updateStock(): Promise<void> {
    console.clear();
    console.log('=== Atualizar Estoque ===');
    
    const id = prompt('ID do produto: ');
    const quantity = parseInt(prompt('Nova quantidade: '));

    try {
        await productService.updateStock(id, quantity);
        console.log('Estoque atualizado com sucesso!');
    } catch (error: any) {
        console.log('Erro:', error.message);
    }
    prompt('Pressione ENTER para continuar...');
}

// Iniciar a aplicação
async function main() {
    await initializeDatabase();
    await showMainMenu();
    await AppDataSource.destroy();
}

main().catch(error => {
    console.error('Erro fatal:', error);
    process.exit(1);
}); 