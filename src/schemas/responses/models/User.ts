export class User {
    id: number;
    username: string;
    email: string;
    role: string;
    timezone: string;

    static build(data: any): User {
        if (data !== undefined && data !== null) {
            return JSON.parse(data);
        } else {
            return null;
        }
    }
}