export class User {
    constructor(public id: number, public username: string, public email: string, public role: string, public timezone: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.timezone = timezone;
    }

    static ReadUser(data: any) {
        if (data !== undefined && data !== null) {
            let user: User = JSON.parse(data)

            return user;
        } else {
            return {}
        }
    }
}