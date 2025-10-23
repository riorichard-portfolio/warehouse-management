import ProductEntity from "../product.entity";

export default interface ProductQueryRepository {
    findById(productId: string): Promise<ProductEntity>;
    findAll(limit: number, offset: number): Promise<ProductEntity[]>;
    upsertProducts(products: ProductEntity[]): string; // for sync from write db
}