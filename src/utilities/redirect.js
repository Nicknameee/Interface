export function redirectToUI() {
    window.location.href = '/home'
}
export function redirectToPersonal() {
    window.location.href = '/personal'
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
    window.location.href = '/personal/orders'
}
export function redirectToPreviousLoginUrl() {
    window.location.href = localStorage.getItem('previousLoginUrl')
    localStorage.removeItem('previousLoginUrl')
}