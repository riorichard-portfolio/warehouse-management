import UserEntity from "./user.entity";

export interface UserUsecase {
    bulkRegister(emails: string[], roles: string[], passwords: string[]): Promise<void>;

    login(email: string, password: string): Promise<UserEntity>;
}