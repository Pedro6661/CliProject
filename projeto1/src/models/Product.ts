export class Product {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public price: number,
        public quantity: number,
        public categoryId: string
    ) {}
} 