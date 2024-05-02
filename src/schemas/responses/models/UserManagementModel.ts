export class UserManagementModel {
    id: number;
    username: string;
    email: string;
    telegramUsername: string;
    loginTime: any;
    logoutTime: any;
    creationTime: any;
    role: string;
    status: string;
    timezone: string;

    static build(data: any): UserManagementModel {
        const user: UserManagementModel = new UserManagementModel();

        user.id = data.id
        user.username = data.username
        user.email = data.email
        user.telegramUsername = data.telegramUsername
        user.loginTime = data.loginTime
        user.logoutTime = data.logoutTime
        user.creationTime = data.creationTime
        user.role = data.role
        user.status = data.status
        user.timezone = data.timezone

        return user;
    }
}