export class User {
    constructor(public username: string, public email: string, public role: string) {
        this.username = username;
        this.email = email;
        this.role = role;
    }

    static ReadUser(data: any) {
        if (data) {
            return new User(data.username, data.email, data.role)
        } else {
            return {}
        }
    }
}