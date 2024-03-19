export function redirectToUI() {
    window.location.href = '/home'
}
export function redirectToPersonal() {
    window.location.href = '/personal'
}
export function redirectToSignIn() {
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