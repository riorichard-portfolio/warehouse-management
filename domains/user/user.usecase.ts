import UserEntity from "./user.entity";

export default interface UserUsecase {
    login(email: string, password: string): Promise<UserEntity>;
    validateRegistration(email: string, password: string, role: string): Promise<string>; // return token for next registration
}