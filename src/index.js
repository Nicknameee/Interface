import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import reportWebVitals from './test/reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as endpoints from './constants/endpoints.js'
import {redirectToOrderHistory, redirectToUI} from "./utilities/redirect";
import {CategoryFilter} from "./schemas/CategoryFilter.ts";
import {Category} from "./schemas/Category.ts";
import categoryResponse from './test/categories.json'
import novaPostCities from './test/novaPostCities.json'
import novaPostWarehouses from './test/novaPostWarehouses.json'
import cities from './handbook/cities.json'
import citiesCount from './handbook/citiesCountByName.json'
import productResponse from './test/products.json'
import {ProductFilter} from "./schemas/ProductFilter.ts";
import {CustomerProduct} from "./schemas/CustomerProduct.ts";
import {Location} from "react-router-dom";
import {CartProduct} from "./schemas/CartProduct.ts";
import moment from 'moment';
import {TransactionInitiativeModel} from "./schemas/TransactionInitiativeModel.ts";
import {CreateOrder} from "./schemas/CreateOrder.ts";

const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * Function that return new Headers() {Content-Type and Auth if user is authenticated}
 * @returns {Headers} - Default headers for communication with backend
 */
export function getDefaultHeaders(): Headers {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (getCookie('token')) {
        headers.append('Authorization', 'Bearer ' + getCookie('token'));
    }

    return headers;
}

/**
 *
 * @param name - name of cookie param
 * @param value - value of cookie param
 * @param expirationDate - any possible constructor arg for Date, expiration of cookie entry
 */
export function setCookie(name: string, value: string, expirationDate) {
    const expires = new Date(expirationDate);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

/**
 *
 * @param cookieName - name of cookie entry to search for
 * @returns {null|string} - cookie value if entry was found, null otherwise
 */
export function getCookie(cookieName: string): string {
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

/**
 * Sign In endpoint - performs request to backend server
 * @param login - user login
 * @param password - user password
 * @returns {Promise<void>} - return value is not used, the result of invocation of this function is setting auth token to cookie
 */
export const signIn = async (login, password) => {
    const requestData = {
        login: login,
        password: password
    };

    const queryParams = new URLSearchParams(requestData).toString();

    const requestOptions = {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify(requestData),
    };

    await fetch(`${endpoints.signInEndpoint}?${queryParams}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        })
        .then(json => {
            if (json.status === 'OK') {
                setCookie('token', json.data['token'], json.data['expires_at'])
            } else {
                console.error(json.data)
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    await getUserInfo()
};

/**
 * Log Out endpoint - performs request to backend server
 * @returns {Promise<void>} - return value is not used, the result of invocation of this function is clearing cookies except cart's one
 */
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
        .then(response => {
            if (String(response['logout']) === 'true') {
                clearCookiesExcept('cart')
                redirectToUI()
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

/**
 *
 * @param keepCookies - list of names of cookies to be kept
 */
export function clearCookiesExcept(keepCookies: string[]): void {
    const cookies = document.cookie.split(';');

    cookies.forEach(cookie => {
        const cookieParts = cookie.split('=');
        const cookieName = cookieParts[0].trim();

        if (!keepCookies.includes(cookieName)) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
    });
}

/**
 *
 * @returns {string} - cookie's auth token, if present therefore user is authenticated, otherwise he's not
 */
export function isLoggedIn(): string {
    return getCookie('token');
}

/**
 *
 * @param categoryFilter
 * @returns {Promise<{pictureUrl: *, name: *, parentCategoryId: *, id: *, categoryId: *, enabled: *}[]|*>}
 */
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

/**
 *
 * @param productFilter
 * @returns {Promise<CustomerProduct[]|*|*[]>}
 */
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

/**
 *
 * @param paramName - query param name
 * @param location - from useLocation() hook
 * @returns {string} - query param value
 */
export function getQueryParam(paramName: string, location: Location): string {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(paramName);
}

/**
 *
 * @param cartProduct
 */
export function addToCart(cartProduct: CartProduct): void {
    let cart = getCookie('cart');
    let newExpirationDate = moment().add(1, 'day').toDate();
    let cartItems: CartProduct[] = cart ? JSON.parse(cart) : [];
    let matchInCart: CartProduct | undefined = cartItems.find((item: CartProduct) => item.productId === cartProduct.productId);

    if (matchInCart) {
        matchInCart.itemsBooked = cartProduct.itemsBooked;
    } else {
        cartItems.push(cartProduct)
    }

    setCookie('cart', JSON.stringify(cartItems), newExpirationDate);
}

/**
 *
 * @returns {any|*[]}
 */
export function getCart(): CartProduct[] {
    let cart = getCookie('cart');
    return cart ? JSON.parse(cart) : [];
}

/**
 * Function removes entry from cart in cookies and updates or removes cart if no other products are left
 * @param cartProduct
 */
export function removeFromCart(cartProduct: CartProduct) {
    let cart = getCookie('cart');
    let cartItems: CartProduct[] = cart ? JSON.parse(cart) : [];
    cartItems = cartItems.filter((item: CartProduct) => item.productId !== cartProduct.productId);

    let newExpirationDate = moment().add(1, 'day').toDate();

    if (cartItems.length > 0) {
        setCookie('cart', JSON.stringify(cartItems), newExpirationDate);
    } else {
        setCookie('cart', null, new Date(0))
    }
}

/**
 *
 * @param searchString - prefix for city to be searched by
 * @returns {*|*[]} - list of JSON from cities.json
 * function is optimised, the data is loaded to JSON file, one contains alphabetically sorted list of cities with region, other contains count for cities by first letter
 * that allows to slice array of data only for required samples using first letter of searching prompt, which saves time
 * possible ways to improve it even more to include into slicing a second letter, but this logic might be a bit of preprocessing kind of dependable solution
 */
export function getNovaPostCities(searchString: string) {
    if (process.env.REACT_APP_PROFILE === 'test') {
        try {
            if (novaPostCities.status === 'OK') {
                const applyFilters = (data: any[], searchString: string) => {
                    return data.filter((novaPostCity: any) => {
                        return String(novaPostCity.Description).startsWith(searchString)
                    });
                };

                return applyFilters(novaPostCities.data, searchString);
            } else {
                console.error('Failed to fetch categories:', novaPostCities.error);
            }
        } catch (error) {
            throw new Error('Error fetching data');
        }
    } else {
        try {
            const letter = String(searchString).length > 0 ? String(searchString).at(0) : '0';

            const applyFilters = (data, searchString) => {

                let min = 0;
                let max = data.length;

                for (let loopI = 0; loopI < citiesCount.length; loopI++) {
                    let counts = citiesCount[loopI];

                    if (counts.letter !== String(letter).toLowerCase()) {
                        if (counts.count !== undefined && counts.count !== null) {
                            min += counts.count;
                        }
                    } else {
                        max = min + counts.count;
                        break;
                    }
                }

                return data.slice(min, max).filter(city => String(city.Description).startsWith(searchString));
            };

            return applyFilters(cities, searchString);
        } catch (error) {
            throw new Error('Error fetching data');
        }
    }
}

export async function getNovaPostWarehouses(city: string) {
    if (process.env.REACT_APP_PROFILE === 'test') {
        try {
            if (novaPostWarehouses.status === 'OK') {
                const applyFilters = (data: any[], city: string) => {
                    return data.filter((novaPostWarehouses: any) => {
                        return String(novaPostWarehouses.CityDescription) === (city)
                    });
                };

                return applyFilters(novaPostWarehouses.data, city);
            } else {
                console.error('Failed to fetch warehouses:', novaPostWarehouses.error);
            }
        } catch (error) {
            throw new Error('Error fetching data');
        }
    } else {
        const requestData = {
            cityName: city
        }

        const queryParams = new URLSearchParams(requestData).toString();

        const requestOptions = {
            method: 'GET',
            headers: getDefaultHeaders()
        };

        let response = await fetch(`${endpoints.getNovaPostDepartments}?${queryParams}`, requestOptions)
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

        return response.data.map((novaPostDepartment: any) => ({
            Description: novaPostDepartment.Description,
            ShortAddress: novaPostDepartment.ShortAddress,
            Number: novaPostDepartment.Number,
            CategoryOfWarehouse: novaPostDepartment.CategoryOfWarehouse,
            TypeOfWarehouse: novaPostDepartment.TypeOfWarehouse
        }));
    }
}

export async function processPayment(paymentToken: any, amount: number, currency: string, customerId: number) {
    let transactionInitiativeModel: TransactionInitiativeModel = new TransactionInitiativeModel();
    transactionInitiativeModel.amount = amount;
    transactionInitiativeModel.paymentToken = paymentToken;
    transactionInitiativeModel.currency = currency;
    transactionInitiativeModel.customerId = customerId;

    const requestOptions = {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify(transactionInitiativeModel)
    };

    let response = await fetch(`${endpoints.initiateTransaction}`, requestOptions)
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
        console.log('Transaction initiation response is undefined or null')
    }
}

export function createOrder(createOrderModel: CreateOrder) {
    const requestOptions = {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify(createOrderModel)
    };

    console.log(JSON.stringify(createOrderModel))

    fetch(`${endpoints.createOrder}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        })
        .then(response => {
            if (response.status === 'OK') {
                setCookie('cart', null, new Date(0))
                redirectToOrderHistory();
            }
        })
        .catch(error => {
            console.log('Order registering response error')
            console.error('Error: ', error);
        });
}

export async function getUserInfo() {
    const requestOptions = {
        method: 'GET',
        headers: getDefaultHeaders()
    };

    await fetch(`${endpoints.getUserInfoEndpoint}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        })
        .then(data => {
            if (data) {
                setCookie('userInfo', JSON.stringify(data['data']));
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export default endpoints;

root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);

reportWebVitals();
