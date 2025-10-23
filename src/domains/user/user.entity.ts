export default class UserEntity {
    constructor(
        public userId: string,
        public email: string,
        public password: string,
        public role: 'admin' | 'staff'
    ) { }
}