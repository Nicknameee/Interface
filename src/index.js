import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import reportWebVitals from './test/reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as endpoints from './constants/endpoints.js'
import {redirectToUI} from "./utilities/redirect";
import {CategoryFilter} from "./schemas/CategoryFilter.ts";
import {Category} from "./schemas/Category.ts";
import categoryResponse from './test/categories.json'
import novaPostCities from './test/novaPostCities.json'
import novaPostWarehouses from './test/novaPostWarehouses.json'
import productResponse from './test/products.json'
import {ProductFilter} from "./schemas/ProductFilter.ts";
import {CustomerProduct} from "./schemas/CustomerProduct.ts";
import {Location} from "react-router-dom";
import {CartProduct} from "./schemas/CartProduct.ts";
import moment from 'moment';

const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * Default headers for communication with backend
 * @returns {Headers}
 */
export function getDefaultHeaders() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (getCookie('token')) {
        headers.append('Authorization', 'Bearer ' + getCookie('token'));
    }

    return headers;
}

export function setCookie(name, value, expirationDate) {
    const expires = new Date(expirationDate);
    console.log(expires)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export function getCookie(cookieName) {
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    return null;
}

export const signIn = async (login, password) => {
    const requestData = {
        username: login,
        password: password
    };
    const queryParams = new URLSearchParams(requestData).toString();

    const requestOptions = {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify(requestData),
    };

    await fetch(`${endpoints.signInEndpoint}${queryParams}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        })
        .then(json => {
            setCookie('token', json.data['token'], json.data['expires_at'])
            redirectToUI()
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

export const logout = async () => {
    const apiUrl = process.env.REACT_APP_USER_SERVICE_ADDRESS;
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: getDefaultHeaders()
    };
    await fetch(`${apiUrl}/logout`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        })
        .then(() => {
            clearCookies()
            redirectToUI()
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

export function clearCookies() {
    document.cookie = ''
}

export function isLoggedIn() {
    return getCookie('token');
}

export async function getCategories(categoryFilter: CategoryFilter): Category[] {
    if (categoryFilter === undefined) {
        categoryFilter = CategoryFilter.build({enabled: false})
    }

    if (process.env.REACT_APP_PROFILE === 'test') {
        try {
            if (categoryResponse.status === 'OK') {
                const applyFilters = (data: any[], filter: CategoryFilter) => {
                    const filteredData = data.filter((categoryData: any) => {
                        let meetsEnabledFilter: boolean = true;

                        if (filter.enabled !== undefined && filter.enabled !== null) {
                            meetsEnabledFilter = categoryData.enabled === filter.enabled;
                        }

                        const meetsParentCategoryIdFilter = categoryData.parentCategoryId === filter.parentCategoryId;

                        return meetsEnabledFilter && meetsParentCategoryIdFilter;
                    });

                    const startIndex = (filter.page - 1) * filter.size;
                    const endIndex = startIndex + filter.size;
                    const paginatedData = filteredData.slice(startIndex, endIndex);

                    return paginatedData.map((categoryData: any) => ({
                        id: categoryData.id,
                        name: categoryData.name,
                        categoryId: categoryData.categoryId,
                        parentCategoryId: categoryData.parentCategoryId,
                        pictureUrl: categoryData.pictureUrl,
                        enabled: categoryData.enabled
                    }));
                };

                return applyFilters(categoryResponse.data, categoryFilter);
            } else {
                console.error('Failed to fetch categories:', categoryResponse.error);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Error fetching categories');
        }
    } else {
        const requestData = categoryFilter.formAsRequestParameters();

        const requestFilteredData = Object.fromEntries(
            Object.entries(requestData).filter(([_, value]) => value !== null && value !== undefined)
        );

        const queryParams = new URLSearchParams(requestFilteredData).toString();

        const requestOptions = {
            method: 'GET',
            headers: getDefaultHeaders()
        };

        let response = await fetch(`${endpoints.getCategoriesEndpoint}?${queryParams}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return response.json();
            })
            .catch(error => {
                console.error('Error: ', error);
            });

        return response.data.map((categoryData: any) => ({
            id: categoryData.id,
            name: categoryData.name,
            categoryId: categoryData.categoryId,
            parentCategoryId: categoryData.parentCategoryId,
            pictureUrl: categoryData.pictureUrl,
            enabled: categoryData.enabled
        }));
    }
}

export async function getProducts(productFilter: ProductFilter): CustomerProduct[] {
    if (productFilter === undefined) {
        productFilter = CategoryFilter.build({blocked: false})
    }

    if (process.env.REACT_APP_PROFILE === 'test') {
        try {
            console.log('ProductComponent response:', productResponse);
            console.log('ProductComponent filter:', productFilter);

            if (productResponse.status === 'OK') {
                const applyFilters = (data: any[], filter: ProductFilter) => {
                    const filteredData = data.filter((productData: any) => {
                        let meetsEnabledFilter = true;

                        if (filter.blocked !== undefined && filter.blocked !== null) {
                            meetsEnabledFilter = productData.blocked === filter.blocked;
                        }
                        let meetsParentCategoryIdFilter = true;

                        if (filter.categoryId !== undefined && filter.categoryId !== null) {
                            meetsParentCategoryIdFilter = productData.categoryId === filter.categoryId;
                        }

                        let productIdsMatch = true;

                        if (filter.productIds !== undefined && filter.productIds !== null && filter.productIds.length > 0) {
                            productIdsMatch = filter.productIds.includes(productData.productId)
                        }

                        return meetsEnabledFilter && meetsParentCategoryIdFilter && productIdsMatch;
                    });

                    const startIndex = (filter.page - 1) * filter.size;
                    const endIndex = startIndex + filter.size;
                    const paginatedData = filteredData.slice(startIndex, endIndex);

                    const mappedProducts: CustomerProduct[] = paginatedData.map((productData: any) => ({
                        id: productData.id,
                        name: productData.name,
                        brand: productData.brand,
                        parameters: productData.parameters,
                        description: productData.description,
                        vendorId: productData.vendorId,
                        productId: productData.productId,
                        cost: productData.cost,
                        currency: productData.currency,
                        itemsLeft: productData.itemsLeft,
                        blocked: productData.blocked,
                        categoryId: productData.categoryId,
                        introductionPictureUrl: productData.introductionPictureUrl,
                        pictureUrls: productData.pictureUrls,
                        marginRate: productData.marginRate
                    }));

                    return mappedProducts;
                };

                return applyFilters(productResponse.data, productFilter);
            } else {
                console.error('Failed to fetch categories:', productResponse.error);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Error fetching categories');
        }
    } else {
        const requestData = productFilter.formAsRequestParameters();

        const queryParams = new URLSearchParams(requestData).toString();

        const requestOptions = {
            method: 'POST',
            headers: getDefaultHeaders(),
            body: JSON.stringify(productFilter.formAsRequestBody())
        };

        let response = await fetch(`${endpoints.getProductsEndpoint}?${queryParams}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return response.json();
            })
            .catch(error => {
                console.error('Error: ', error);
            });

        if (response === undefined || response === null || response.status !== 'OK') {
            console.log('Product retrieving response is undefined or null')
            return [];
        }

        return response.data.map((productData: any) => ({
            id: productData.id,
            name: productData.name,
            brand: productData.brand,
            parameters: productData.parameters,
            description: productData.description,
            vendorId: productData.vendorId,
            productId: productData.productId,
            cost: productData.cost,
            currency: productData.currency,
            itemsLeft: productData.itemsLeft,
            blocked: productData.blocked,
            categoryId: productData.categoryId,
            introductionPictureUrl: productData.introductionPictureUrl,
            pictureUrls: productData.pictureUrls,
            marginRate: productData.marginRate
        }));
    }
}

export function getQueryParam(paramName: string, location: Location) {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(paramName);
}

export function addToCart(cartProduct: CartProduct) {
    let cart = getCookie('cart');
    let cartItems: CartProduct[] = cart ? JSON.parse(cart) : [];
    let matchInCart: CartProduct | undefined = cartItems.find((item: CartProduct) => item.productId === cartProduct.productId);

    if (matchInCart) {
        matchInCart.itemsBooked = cartProduct.itemsBooked;
    } else {
        cartItems.push(cartProduct)
    }

    let newExpirationDate = moment().add(1, 'day').toDate();

    setCookie('cart', JSON.stringify(cartItems), newExpirationDate);
}

export function getCart(): CartProduct[] {
    let cart = getCookie('cart');
    return cart ? JSON.parse(cart) : [];
}

export function removeFromCart(cartProduct: CartProduct) {
    let cart = getCookie('cart');
    let cartItems: CartProduct[] = cart ? JSON.parse(cart) : [];
    cartItems = cartItems.filter((item: CartProduct) => item.productId !== cartProduct.productId);

    let newExpirationDate = moment().add(1, 'day').toDate();

    setCookie('cart', JSON.stringify(cartItems), newExpirationDate);
}

export function getNovaPostCities(searchString: string) {
    if (process.env.REACT_APP_PROFILE === 'test') {
        try {
            if (novaPostCities.status === 'OK') {
                const applyFilters = (data: any[], searchString: string) => {
                    return data.filter((novaPostCity: any) => {
                        return String(novaPostCity.Description).startsWith(searchString)
                    });
                };

                let value = applyFilters(novaPostCities.data, searchString);

                return value;
            } else {
                console.error('Failed to fetch categories:', novaPostCities.error);
            }
        } catch (error) {
            throw new Error('Error fetching data');
        }
    } else {
        return []
    }
};


export function getNovaPostWarehouses(city: string) {
    if (process.env.REACT_APP_PROFILE === 'test') {
        try {
            if (novaPostWarehouses.status === 'OK') {
                const applyFilters = (data: any[], city: string) => {
                    return data.filter((novaPostWarehouses: any) => {
                        return String(novaPostWarehouses.CityDescription) === (city)
                    });
                };

                let uwu = applyFilters(novaPostWarehouses.data, city);

                return uwu;
            } else {
                console.error('Failed to fetch warehouses:', novaPostWarehouses.error);
            }
        } catch (error) {
            throw new Error('Error fetching data');
        }
    } else {
        return []
    }
}
export default endpoints;

root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);

reportWebVitals();
