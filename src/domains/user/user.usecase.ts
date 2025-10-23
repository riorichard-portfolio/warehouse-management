import UserEntity from "./user.entity";

export default interface UserUsecase {
    login(email: string, password: string): Promise<UserEntity>;
    // pre-validate registration
    validateRegistration(email: string, password: string, role: string): Promise<void>;
}