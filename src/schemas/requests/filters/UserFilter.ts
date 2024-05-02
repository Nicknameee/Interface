export class UserFilter {
    page: number;
    size: number;
    sortBy: string | 'loginTime';
    direction: string | 'DESC';
    userIds: number[];
    usernamePrompt: string;
    emailPrompt: string;
    telegramPrompt: string;
    loginTimeFrom: string;
    loginTimeTo: string;
    logoutTimeFrom: string;
    logoutTimeTo: string;
    creatingTimeFrom: string;
    creatingTimeTo: string;
    roles: string[];
    statuses: string[];
    timeArea: string;
    isOnline: boolean;

    query() {
        return {
            page: this.page,
            size: this.size || 100,
            sortBy: this.sortBy || 'loginTime',
            direction: this.direction || 'DESC'
        }
    }

    filter() {
        return {
            userIds: this.userIds,
            usernamePrompt: this.usernamePrompt,
            emailPrompt: this.emailPrompt,
            telegramPrompt: this.telegramPrompt,
            loginTimeFrom: this.loginTimeFrom,
            loginTimeTo: this.loginTimeTo,
            logoutTimeFrom: this.logoutTimeFrom,
            logoutTimeTo: this.logoutTimeTo,
            creatingTimeFrom: this.creatingTimeFrom,
            creatingTimeTo: this.creatingTimeTo,
            roles: this.roles,
            statuses: this.statuses,
            timeArea: this.timeArea,
            isOnline: this.isOnline
        }
    }

    static build(data: any): UserFilter {
        const userFilter: UserFilter = new UserFilter();

        userFilter.page = data.page
        userFilter.size = data.size
        userFilter.sortBy = data.sortBy
        userFilter.direction = data.direction
        userFilter.userIds = data.userIds
        if (data.usernamePrompt !== '') {
            userFilter.usernamePrompt = data.usernamePrompt
        }
        if (data.telegramPrompt !== '') {
            userFilter.telegramPrompt = data.telegramPrompt
        }
        if (data.emailPrompt !== '') {
            userFilter.emailPrompt = data.emailPrompt
        }
        userFilter.loginTimeFrom = data.loginTimeFrom
        userFilter.loginTimeTo = data.loginTimeTo
        userFilter.logoutTimeFrom = data.logoutTimeFrom
        userFilter.logoutTimeTo = data.logoutTimeTo
        userFilter.creatingTimeFrom = data.creatingTimeFrom
        userFilter.creatingTimeTo = data.creatingTimeTo
        userFilter.roles = data.roles
        userFilter.statuses = data.statuses
        userFilter.timeArea = data.timeArea
        userFilter.isOnline = data.isOnline

        return userFilter;
    }
}