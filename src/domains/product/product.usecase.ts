import ProductEntity from "./product.entity";

export default interface ProductUsecase {
    getProductById(productId: string): Promise<ProductEntity>;
    productList(limit: number, offset: number): Promise<ProductEntity[]>;
    // pre-validate add product
    addProductValidate(productName: string, productStock: number): string; 
    // pre-validate update product
    updateProductValidate(products: ProductEntity[]): string; 
}