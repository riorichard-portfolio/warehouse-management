export default interface UserCommandRepository {
    bulkInsert(users: { email: string; role: string; password: string }[]): Promise<void>;
}
