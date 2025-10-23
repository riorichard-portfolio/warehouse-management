import ProductEntity from "../product.entity"

export default interface ProductCommandRepository {
    bulkInsert(products: {productName: string, productStock: number}): Promise<void>
    bulkUpdate(products: ProductEntity[]): Promise<void>
    bulkDelete(productIds: string[]): Promise<void>
}