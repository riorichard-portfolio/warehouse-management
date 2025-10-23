import ProductEntity from "./product.entity";

export default interface ProductUsecase {
    getProductById(productId: string): Promise<ProductEntity>;
    productList(limit: number, offset: number): Promise<ProductEntity[]>;
    addProductValidate(productName: string, productStock: number): string; // token for insert product
}