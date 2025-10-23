export default interface UserCommandRepository {
    bulkInsert(emails: string[], roles: string[], passwords: string[]): Promise<void>;
}
