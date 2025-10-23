import UserEntity from "./user.entity";

export interface UserUsecase {
    bulkRegister(users: Array<{
        email: string;
        password: string;
        role: 'admin' | 'staff';
    }>): Promise<void>;

    login(email: string, password: string): Promise<UserEntity>;
}