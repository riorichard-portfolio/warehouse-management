import UserEntity from "../user.entity";

export default interface UserQueryRepository {
    findByEmail(email: string): Promise<UserEntity | null>;
    // for sync from write database
    bulkUpsert(users: UserEntity[]): Promise<void>;
    checkEmailExists(email: string): Promise<boolean>
}