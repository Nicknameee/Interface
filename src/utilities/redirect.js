import {getCookie} from "../index";
import {User} from "../schemas/responses/models/User.ts";

export function redirectToUI() {
    window.location.href = '/home'
}
export function redirectToPersonal() {
    let userInfo: User = JSON.parse(getCookie('userInfo'));

    if (userInfo) {
        switch (userInfo.role) {
            case 'ROLE_OPERATOR':
                window.location.href = '/operator/personal';
                break;
            case 'ROLE_CUSTOMER':
                window.location.href = '/customer/personal';
                break;
            case 'ROLE_MANAGER':
                window.location.href = '/manager/personal';
                break;
            default:
                window.location.href = '/personal'
        }
    } else {
        console.log('User info is undefined, so basically user auth is not provided yet')
        redirectToSignIn()
    }
}
export function redirectToSignIn() {
    localStorage.setItem('previousLoginUrl', window.location.href)
    window.location.href = '/sign/in'
}
export function redirectToSignUp() {
    window.location.href = '/sign/up'
}
export function redirectToCategory(categoryId: string) {
    window.location.href = '/home?categoryId=' + categoryId
}
export function redirectToProductPage(productId: string) {
    window.location.href = '/product?productId=' + productId
}
export function redirectToNotFound() {
    window.location.href = '/NOT_FOUND';
}
export function redirectToPurchase() {
    window.location.href = '/purchase'
}
export function redirectToOrderHistory() {
    window.location.href = '/customer/personal?mode=orders'
}
export function redirectToWaitingList() {
    window.location.href = '/customer/personal?mode=waitingList'
}
export function redirectToPreviousLoginUrl() {
    let previousHref = localStorage.getItem('previousLoginUrl');

    window.location.href = previousHref ? previousHref : '/home';

    localStorage.removeItem('previousLoginUrl');
}
export function redirectToViewingUsers() {
    window.location.href = '/manager/personal?option=viewUser';
}
export function redirectToAddingUser() {
    window.location.href = '/manager/personal?option=addUser';
}
export function redirectToViewingOrders() {
    window.location.href = '/manager/personal?option=viewOrder';
}
export function redirectToViewProducts() {
    window.location.href = '/manager/personal?option=viewProduct';
}
export function redirectToAddingProduct() {
    window.location.href = '/manager/personal?option=addProduct';
}
export function redirectToViewCategory() {
    window.location.href = '/manager/personal?option=viewCategory';
}
export function redirectToAddingCategory() {
    window.location.href = '/manager/personal?option=addCategory';
}
export function redirectToViewPayments() {
    window.location.href = '/manager/personal?option=viewPayment';
}
export function redirectToViewStatistic() {
    window.location.href = '/manager/personal?option=viewStatistic';
}