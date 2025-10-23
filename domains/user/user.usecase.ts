import UserEntity from "./user.entity";

export interface UserUsecase {
    login(email: string, password: string): Promise<UserEntity>;
}