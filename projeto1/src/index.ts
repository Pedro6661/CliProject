import promptSync from 'prompt-sync';
import { CategoryService } from './services/CategoryService';
import { ProductService } from './services/ProductService';
import { Category } from './models/Category';
import { Product } from './models/Product';

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

function showMainMenu(): void {
    while (true) {
        console.clear();
        console.log('=== Sistema de Gerenciamento de Inventário ===');
        console.log('1. Gerenciar Categorias');
        console.log('2. Gerenciar Produtos');
        console.log('0. Sair');

        const option = prompt('Escolha uma opção: ');

        switch (option) {
            case '1':
                showCategoryMenu();
                break;
            case '2':
                showProductMenu();
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

function showCategoryMenu(): void {
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
                addCategory();
                break;
            case '2':
                listCategories();
                break;
            case '3':
                updateCategory();
                break;
            case '4':
                deleteCategory();
                break;
            case '0':
                return;
            default:
                console.log('Opção inválida!');
                prompt('Pressione ENTER para continuar...');
        }
    }
}

function showProductMenu(): void {
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
                addProduct();
                break;
            case '2':
                listProducts();
                break;
            case '3':
                updateProduct();
                break;
            case '4':
                deleteProduct();
                break;
            case '5':
                updateStock();
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
function addCategory(): void {
    console.clear();
    console.log('=== Adicionar Categoria ===');
    
    const id = prompt('ID: ');
    const name = prompt('Nome: ');
    const description = prompt('Descrição: ');

    try {
        categoryService.addCategory(new Category(id, name, description));
        console.log('Categoria adicionada com sucesso!');
    } catch (error: any) {
        console.log('Erro:', error.message);
    }
    prompt('Pressione ENTER para continuar...');
}

function listCategories(): void {
    console.clear();
    console.log('=== Lista de Categorias ===');
    
    const categories = categoryService.getAllCategories();
    if (categories.length === 0) {
        console.log('Nenhuma categoria cadastrada.');
    } else {
        categories.forEach(category => {
            console.log(`\nID: ${category.id}`);
            console.log(`Nome: ${category.name}`);
            console.log(`Descrição: ${category.description}`);
        });
    }
    prompt('Pressione ENTER para continuar...');
}

function updateCategory(): void {
    console.clear();
    console.log('=== Atualizar Categoria ===');
    
    const id = prompt('ID da categoria a ser atualizada: ');
    const name = prompt('Novo nome (deixe em branco para manter): ');
    const description = prompt('Nova descrição (deixe em branco para manter): ');

    try {
        const updates: Partial<Category> = {};
        if (name) updates.name = name;
        if (description) updates.description = description;
        
        categoryService.updateCategory(id, updates);
        console.log('Categoria atualizada com sucesso!');
    } catch (error: any) {
        console.log('Erro:', error.message);
    }
    prompt('Pressione ENTER para continuar...');
}

function deleteCategory(): void {
    console.clear();
    console.log('=== Remover Categoria ===');
    
    const id = prompt('ID da categoria a ser removida: ');

    try {
        categoryService.deleteCategory(id);
        console.log('Categoria removida com sucesso!');
    } catch (error: any) {
        console.log('Erro:', error.message);
    }
    prompt('Pressione ENTER para continuar...');
}

// Funções de gerenciamento de produtos
function addProduct(): void {
    console.clear();
    console.log('=== Adicionar Produto ===');
    
    const id = prompt('ID: ');
    const name = prompt('Nome: ');
    const description = prompt('Descrição: ');
    const price = parseFloat(prompt('Preço: '));
    const quantity = parseInt(prompt('Quantidade: '));
    const categoryId = prompt('ID da Categoria: ');

    try {
        productService.addProduct(new Product(id, name, description, price, quantity, categoryId));
        console.log('Produto adicionado com sucesso!');
    } catch (error: any) {
        console.log('Erro:', error.message);
    }
    prompt('Pressione ENTER para continuar...');
}

function listProducts(): void {
    console.clear();
    console.log('=== Lista de Produtos ===');
    
    const products = productService.getAllProducts();
    if (products.length === 0) {
        console.log('Nenhum produto cadastrado.');
    } else {
        products.forEach(product => {
            console.log(`\nID: ${product.id}`);
            console.log(`Nome: ${product.name}`);
            console.log(`Descrição: ${product.description}`);
            console.log(`Preço: R$ ${product.price.toFixed(2)}`);
            console.log(`Quantidade: ${product.quantity}`);
            console.log(`ID da Categoria: ${product.categoryId}`);
        });
    }
    prompt('Pressione ENTER para continuar...');
}

function updateProduct(): void {
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
        
        productService.updateProduct(id, updates);
        console.log('Produto atualizado com sucesso!');
    } catch (error: any) {
        console.log('Erro:', error.message);
    }
    prompt('Pressione ENTER para continuar...');
}

function deleteProduct(): void {
    console.clear();
    console.log('=== Remover Produto ===');
    
    const id = prompt('ID do produto a ser removido: ');

    try {
        productService.deleteProduct(id);
        console.log('Produto removido com sucesso!');
    } catch (error: any) {
        console.log('Erro:', error.message);
    }
    prompt('Pressione ENTER para continuar...');
}

function updateStock(): void {
    console.clear();
    console.log('=== Atualizar Estoque ===');
    
    const id = prompt('ID do produto: ');
    const quantity = parseInt(prompt('Nova quantidade: '));

    try {
        productService.updateStock(id, quantity);
        console.log('Estoque atualizado com sucesso!');
    } catch (error: any) {
        console.log('Erro:', error.message);
    }
    prompt('Pressione ENTER para continuar...');
}

// Iniciar a aplicação
showMainMenu(); 