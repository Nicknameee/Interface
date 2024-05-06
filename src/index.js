import React from "react";
import ReactDOM, { Root } from "react-dom/client";
import "./styles/index.css";
import Application from "./Application";
import reportWebVitals from "./test/reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import * as endpoints from "./constants/endpoints.js";
import { redirectToOrderHistory, redirectToUI } from "./utilities/redirect";
import { CategoryFilter } from "./schemas/requests/filters/CategoryFilter.ts";
import { Category } from "./schemas/responses/models/Category.ts";
import categoryResponse from "./test/categories.json";
import novaPostCities from "./test/novaPostCities.json";
import novaPostWarehouses from "./test/novaPostWarehouses.json";
import cities from "./handbook/cities.json";
import citiesCount from "./handbook/citiesCountByName.json";
import productResponse from "./test/products.json";
import { ProductFilter } from "./schemas/requests/filters/ProductFilter.ts";
import { Product } from "./schemas/responses/models/Product.ts";
import { Location } from "react-router-dom";
import { CartProduct } from "./schemas/data/CartProduct.ts";
import moment from "moment";
import { TransactionInitiativeModel } from "./schemas/requests/models/TransactionInitiativeModel.ts";
import { CreateOrder } from "./schemas/requests/models/CreateOrder.ts";
import { ProductLink } from "./schemas/responses/models/ProductLink.ts";
import { OrderFilter } from "./schemas/requests/filters/OrderFilter.ts";
import { CustomerOrder } from "./schemas/responses/models/CustomerOrder.ts";
import { User } from "./schemas/responses/models/User.ts";
import { OrderHistory } from "./schemas/responses/models/OrderHistory.ts";
import { WaitingListProduct } from "./schemas/data/WaitingListProduct.ts";
import { notifyError, notifySuccess } from "./utilities/notify";
import { ToastContainer } from "react-toastify";
import { UserFilter } from "./schemas/requests/filters/UserFilter.ts";
import { UserManagementModel } from "./schemas/responses/models/UserManagementModel.ts";
import { Transaction } from "./schemas/responses/models/Transaction.ts";

const root: Root = ReactDOM.createRoot(document.getElementById("root"));

/**
 * Function that return new Headers() {Content-Type and Auth if user is authenticated}
 * @returns {Headers} - Default headers for communication with backend
 */
export function getDefaultHeaders(): Headers {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (getCookie("token")) {
    headers.append("Authorization", "Bearer " + getCookie("token"));
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
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
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
export const signIn = async (login, password): boolean => {
  const requestData = {
    login: login,
    password: password,
  };

  const queryParams = new URLSearchParams(requestData).toString();

  const requestOptions = {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify(requestData),
  };

  let isSuccessful: boolean = await fetch(`${endpoints.signInEndpoint}?${queryParams}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((json) => {
      if (json && json.status === "OK") {
        setCookie("token", json.data["token"], json.data["expires_at"]);

        return true;
      }

      return false;
    })
    .catch((error) => {
      console.error("Error:", error);
      notifyError(error);
    });

  if (isSuccessful) {
    await fetchUserInfo();
  }

  return isSuccessful;
};

/**
 * Log Out endpoint - performs request to backend server
 * @returns {Promise<void>} - return value is not used, the result of invocation of this function is clearing cookies except cart's one
 */
export const logout = async (): void => {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: getDefaultHeaders(),
  };

  await fetch(`${process.env.REACT_APP_USER_SERVICE_ADDRESS}/logout`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((response) => {
      if (String(response["logout"]) === "true") {
        clearCookiesExcept("cart");
        redirectToUI();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      notifyError(error);
    });
};

/**
 *
 * @param keepCookies - list of names of cookies to be kept
 */
export function clearCookiesExcept(keepCookies: string[]): void {
  const cookies: string[] = document.cookie.split(";");

  cookies.forEach((cookie: string) => {
    const cookieParts: string[] = cookie.split("=");
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
  return getCookie("token");
}

export function isCustomerLoggedIn(): boolean {
  const user: User = getUserInfo();

  return isLoggedIn() && user && user.role === "ROLE_CUSTOMER";
}

export function isManagerLoggedIn(): boolean {
  const user: User = getUserInfo();

  return isLoggedIn() && user && user.role === "ROLE_MANAGER";
}

export async function createCategory(name: string, parentCategoryId?: string): Promise<Category> {
  const res = await fetch(endpoints.createCategoryEndpoint, {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify({ name, parentCategoryId }),
  });

  if (!res.ok) throw new Error("Something went wrong");

  return (await res.json()).data;
}

export async function setCategoryPicture(categoryId: string, picture: File): Promise<Category> {
  const formData = new FormData();

  formData.append("categoryId", categoryId);
  formData.append("picture", picture);

  const headers = getDefaultHeaders();
  headers.delete("Content-Type");

  const res = await fetch(endpoints.setCategoryPictureEndpoint, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) throw new Error("Something went wrong");

  return res.json();
}

/**
 *
 * @param categoryFilter
 * @returns {Promise<{pictureUrl: *, name: *, parentCategoryId: *, id: *, categoryId: *, enabled: *}[]|*>}
 */
export async function getCategories(categoryFilter: CategoryFilter): Promise<Category[]> {
  if (categoryFilter === undefined) {
    categoryFilter = CategoryFilter.build({ enabled: false });
  }

  if (process.env.REACT_APP_PROFILE === "test") {
    try {
      if (categoryResponse.status === "OK") {
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
            enabled: categoryData.enabled,
          }));
        };

        return applyFilters(categoryResponse.data, categoryFilter);
      } else {
        console.error("Failed to fetch categories:", categoryResponse.error);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Error fetching categories");
    }
  } else {
    const requestData = categoryFilter.formAsRequestParameters();

    const requestFilteredData = Object.fromEntries(
      Object.entries(requestData).filter(([_, value]) => value !== null && value !== undefined)
    );

    const queryParams = new URLSearchParams(requestFilteredData).toString();

    const requestOptions = {
      method: "GET",
      headers: getDefaultHeaders(),
    };

    let response = await fetch(`${endpoints.getCategoriesEndpoint}?${queryParams}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .catch((error) => {
        console.error("Error: ", error);
        notifyError("Error in fetching categories detected: " + error);
      });

    const categories = response.data.map((categoryData: any) => ({
      id: categoryData.id,
      name: categoryData.name,
      categoryId: categoryData.categoryId,
      parentCategoryId: categoryData.parentCategoryId,
      pictureUrl: categoryData.pictureUrl,
      enabled: categoryData.enabled,
    }));

    if (!categories || categories.length < 1) {
      notifyError("No categories were found");
    }

    return categories;
  }
}

/**
 *
 * @param productFilter
 * @returns {Promise<Product[]|*|*[]>}
 */
export async function getProducts(productFilter: ProductFilter): Product[] {
  if (productFilter === undefined) {
    productFilter = CategoryFilter.build({ blocked: false });
  }

  if (process.env.REACT_APP_PROFILE === "test") {
    try {
      console.log("ProductComponent response:", productResponse);
      console.log("ProductComponent filter:", productFilter);

      if (productResponse.status === "OK") {
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
              productIdsMatch = filter.productIds.includes(productData.productId);
            }

            return meetsEnabledFilter && meetsParentCategoryIdFilter && productIdsMatch;
          });

          const startIndex = (filter.page - 1) * filter.size;
          const endIndex = startIndex + filter.size;
          const paginatedData = filteredData.slice(startIndex, endIndex);

          const mappedProducts: Product[] = paginatedData.map((productData: any) => ({
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
            marginRate: productData.marginRate,
          }));

          return mappedProducts;
        };

        return applyFilters(productResponse.data, productFilter);
      } else {
        console.error("Failed to fetch categories:", productResponse.error);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      notifyError("Error fetching categories: " + error);
    }
  } else {
    const requestData = productFilter.formAsRequestParameters();

    const queryParams = new URLSearchParams(requestData).toString();

    const requestOptions = {
      method: "POST",
      headers: getDefaultHeaders(),
      body: JSON.stringify(productFilter.formAsRequestBody()),
    };

    let response = await fetch(`${endpoints.getProductsEndpoint}?${queryParams}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .catch((error) => {
        console.error("Error: ", error);
        notifyError("Error fetching categories: " + error);
      });

    if (response === undefined || response === null || response.status !== "OK") {
      console.log("Product retrieving response is undefined or null");
      notifyError("Product retrieving response is undefined or null");
      return [];
    }

    const products = response.data.map((productData: any) => ({
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
      marginRate: productData.marginRate,
    }));

    if (!products || products.length < 1) {
      notifyError("No product were found");
    }

    return products;
  }
}

export async function getProductStatistics(productId: number): Promise<any> {
  const res = await fetch(
    process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/products/statistic/sales?productId=" + productId,
    {
      method: "GET",
      headers: getDefaultHeaders(),
    }
  );

  if (!res.ok) throw new Error("Something went wrong");

  return (await res.json()).data;
}

export async function getProfitStatistics(): Promise<any> {
  const res = await fetch(process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/products/statistic/profit", {
    method: "GET",
    headers: getDefaultHeaders(),
  });

  if (!res.ok) throw new Error("Something went wrong");

  return (await res.json()).data;
}

export async function getTopLeads(): Promise<any> {
  const res = await fetch(process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/products/users/profit", {
    method: "GET",
    headers: getDefaultHeaders(),
  });

  if (!res.ok) throw new Error("Something went wrong");

  return (await res.json()).data;
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
  let cart = getCookie("cart");
  let newExpirationDate = moment().add(1, "day").toDate();
  let cartItems: CartProduct[] = cart ? JSON.parse(cart) : [];
  let matchInCart: CartProduct | undefined = cartItems.find(
    (item: CartProduct) => item.productId === cartProduct.productId
  );

  if (matchInCart) {
    matchInCart.itemsBooked = cartProduct.itemsBooked;
    notifySuccess("Product already was in cart, ordered number was updated");
  } else {
    cartItems.push(cartProduct);
    notifySuccess("Product was added to cart");
  }

  setCookie("cart", JSON.stringify(cartItems), newExpirationDate);
}

export async function addToWaitingList(waitingListProduct: WaitingListProduct): void {
  const user: User = getUserInfo();
  const requestOptions = {
    method: "POST",
    headers: getDefaultHeaders(),
  };
  const requestData = {
    customerId: user.id,
    productId: waitingListProduct.productId,
  };

  const queryParams = new URLSearchParams(requestData).toString();

  fetch(`${endpoints.waitingList}?${queryParams}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((response) => {
      if (response.status === "OK") {
        notifySuccess("Product added to waiting list");
      } else {
        notifyError(response["exception"]["exception"]);
      }
    })
    .catch((error) => {
      console.error("Error: ", error);
      notifyError(error);
    });
  // let waitingList = getCookie('waitingList');
  // let newExpirationDate = moment().add(30, 'day').toDate();
  // let waitingListProducts: WaitingListProduct[] = waitingList ? JSON.parse(waitingList) : [];
  // let matchInWaitingList: WaitingListProduct | undefined = waitingListProducts.find((item: WaitingListProduct) => item.productId === waitingListProduct.productId);
  //
  // if (!matchInWaitingList) {
  //     waitingListProducts.push(waitingListProduct);
  //     setCookie('waitingList', JSON.stringify(waitingListProducts), newExpirationDate);
  //     notifySuccess('Product added to waiting list')
  // } else {
  //     notifyError('Product is already in waiting list')
  // }
}

/**
 *
 * @returns {any|*[]}
 */
export function getCart(): CartProduct[] {
  let cart: string = getCookie("cart");
  return cart ? JSON.parse(cart) : [];
}

export async function getWaitingList(): WaitingListProduct[] {
  const user: User = getUserInfo();
  const requestOptions = {
    method: "GET",
    headers: getDefaultHeaders(),
  };
  const requestData = {
    customerId: user.id,
  };

  const queryParams = new URLSearchParams(requestData).toString();

  return await fetch(`${endpoints.waitingList}?${queryParams}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((response) => {
      if (response.status === "OK") {
        return response["data"];
      } else {
        notifyError(response["exception"]["exception"]);
      }
    })
    .catch((error) => {
      console.error("Error: ", error);
      notifyError(error);
    });
  // let waitingList: string = getCookie('waitingList');
  //
  // let waitingListData: any[] = waitingList ? JSON.parse(waitingList) : [];
  //
  // if (waitingListData.length < 1) {
  //     notifyError('Waiting list is empty')
  // }
  //
  // return waitingListData;
}

/**
 * Function removes entry from cart in cookies and updates or removes cart if no other products are left
 * @param cartProduct
 */
export function removeFromCart(cartProduct: CartProduct): void {
  let cart = getCookie("cart");
  let cartItems: CartProduct[] = cart ? JSON.parse(cart) : [];
  cartItems = cartItems.filter((item: CartProduct) => item.productId !== cartProduct.productId);

  let newExpirationDate = moment().add(1, "day").toDate();

  if (cartItems.length > 0) {
    setCookie("cart", JSON.stringify(cartItems), newExpirationDate);
  } else {
    setCookie("cart", null, new Date(0));
  }
}

export async function removeFromWaitingList(productId: string): void {
  const user: User = getUserInfo();
  const requestOptions = {
    method: "DELETE",
    headers: getDefaultHeaders(),
  };
  const requestData = {
    customerId: user.id,
    productId: productId,
  };

  const queryParams = new URLSearchParams(requestData).toString();

  return await fetch(`${endpoints.waitingList}?${queryParams}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((response) => {
      if (response.status === "OK") {
        if (response["data"]) {
          notifySuccess("Product was removed from waiting list...");
        }
      } else {
        notifyError(response["exception"]["exception"]);
      }
    })
    .catch((error) => {
      console.error("Error: ", error);
      notifyError(error);
    });
  //
  // let waitingList: string = getCookie('waitingList');
  // let newExpirationDate: Date = moment().add(30, 'day').toDate();
  // let waitingListProducts: WaitingListProduct[] = waitingList ? JSON.parse(waitingList) : [];
  // let matchInList: boolean = false;
  //
  // waitingListProducts = waitingListProducts.filter((item: CartProduct): boolean => {
  //     if (item.productId === productId) {
  //         matchInList = true;
  //     }
  //
  //     return item.productId !== productId
  // });
  //
  // if (matchInList) {
  //     if (waitingListProducts.length > 0) {
  //         setCookie('waitingList', JSON.stringify(waitingListProducts), newExpirationDate);
  //     } else {
  //         setCookie('waitingList', null, new Date(0))
  //     }
  //
  //     notifySuccess('Product was removed from waiting list successfully')
  // }
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
  if (process.env.REACT_APP_PROFILE === "test") {
    try {
      if (novaPostCities.status === "OK") {
        const applyFilters = (data: any[], searchString: string) => {
          return data.filter((novaPostCity: any) => {
            return String(novaPostCity.Description).startsWith(searchString);
          });
        };

        return applyFilters(novaPostCities.data, searchString);
      } else {
        console.error("Failed to fetch categories:", novaPostCities.error);
      }
    } catch (error) {
      throw new Error("Error fetching data");
    }
  } else {
    try {
      const letter = String(searchString).length > 0 ? String(searchString).at(0) : "0";

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

        return data.slice(min, max).filter((city) => String(city.Description).startsWith(searchString));
      };

      const result = applyFilters(cities, searchString);

      if (!result || result.length < 1) {
        notifyError("List of cities for Nova Post delivery is empty or have no matches to your prompt");
      }

      return result;
    } catch (error) {
      notifyError(error);
    }
  }
}

export async function getNovaPostWarehouses(city: string) {
  if (process.env.REACT_APP_PROFILE === "test") {
    try {
      if (novaPostWarehouses.status === "OK") {
        const applyFilters = (data: any[], city: string) => {
          return data.filter((novaPostWarehouses: any) => {
            return String(novaPostWarehouses.CityDescription) === city;
          });
        };

        return applyFilters(novaPostWarehouses.data, city);
      } else {
        console.error("Failed to fetch warehouses:", novaPostWarehouses.error);
      }
    } catch (error) {
      throw new Error("Error fetching data");
    }
  } else {
    const requestData = {
      cityName: city,
    };

    const queryParams = new URLSearchParams(requestData).toString();

    const requestOptions = {
      method: "GET",
      headers: getDefaultHeaders(),
    };

    let response = await fetch(`${endpoints.getNovaPostDepartments}?${queryParams}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .catch((error) => {
        console.error("Error: ", error);
        notifyError(error);
      });

    if (response === undefined || response === null || response.status !== "OK") {
      return [];
    }

    const data = response.data.map((novaPostDepartment: any) => ({
      Description: novaPostDepartment.Description,
      ShortAddress: novaPostDepartment.ShortAddress,
      Number: novaPostDepartment.Number,
      CategoryOfWarehouse: novaPostDepartment.CategoryOfWarehouse,
      TypeOfWarehouse: novaPostDepartment.TypeOfWarehouse,
    }));

    if (!data || data.length < 1) {
      notifyError("Nova Post departments were not found for this city");
    }

    return data;
  }
}

export async function processPayment(paymentToken: any, amount: number, currency: string, customerId: number) {
  let transactionInitiativeModel: TransactionInitiativeModel = new TransactionInitiativeModel();
  transactionInitiativeModel.amount = amount;
  transactionInitiativeModel.paymentToken = paymentToken;
  transactionInitiativeModel.currency = currency;
  transactionInitiativeModel.customerId = customerId;

  const requestOptions = {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify(transactionInitiativeModel),
  };

  let response = await fetch(`${endpoints.initiateTransaction}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .catch((error) => {
      console.error("Error: ", error);
      notifyError(error);
    });

  if (response === undefined || response === null || response.status !== "OK") {
    console.log("Transaction initiation response is undefined or null");
  }

  if (response.status === "OK") {
    return response["data"]["id"];
  }
}

export async function getTransactions(
  page: number,
  size: number,
  fromDate?: string,
  toDate?: string
): Promise<Transaction[]> {
  const params = {
    page,
    size,
  };

  const queryParams = new URLSearchParams(params).toString();

  const res = await fetch(`${endpoints.getTransactions}?${queryParams}`, {
    method: "POST",
    headers: getDefaultHeaders(),
    body:
      fromDate || toDate
        ? JSON.stringify({
            issuedAtFrom: fromDate ? new Date(fromDate) : undefined,
            issuedAtTo: toDate ? new Date(toDate) : undefined,
          })
        : undefined,
  });

  if (!res.ok) throw new Error("Something went wrong");

  return (await res.json()).data;
}

export async function createTransaction(number: string, paymentAmount: number): Promise<Transaction> {
  const res = await fetch(endpoints.createTransaction, {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify({ number, paymentAmount }),
  });

  const data = await res.json();

  if (data.status !== "OK") throw new Error("Something went wrong");

  return data.data;
}

export function createOrder(createOrderModel: CreateOrder) {
  const requestOptions = {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify(createOrderModel),
  };

  fetch(`${endpoints.createOrder}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((response) => {
      if (response.status === "OK") {
        setCookie("cart", null, new Date(0));
        redirectToOrderHistory();
      }
    })
    .catch((error) => {
      console.error("Error: ", error);
      notifyError(error);
    });
}

export async function fetchUserInfo(): User {
  const requestOptions = {
    method: "GET",
    headers: getDefaultHeaders(),
  };

  return await fetch(`${endpoints.getUserInfoEndpoint}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      if (data && data.status === "OK") {
        if (data["data"]) {
          setCookie("userInfo", JSON.stringify(data["data"]));

          return User.build(data["data"]);
        }
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      notifyError(error);
    });
}

export function getUserInfo(): User {
  const userInfoCookieData: string = getCookie("userInfo");
  if (userInfoCookieData !== undefined && userInfoCookieData !== null) {
    return User.build(userInfoCookieData);
  }

  return null;
}

export async function searchForProducts(searchBy: string, page: number): ProductLink[] {
  const requestOptions = {
    method: "GET",
    headers: getDefaultHeaders(),
  };

  const params = {
    searchBy: searchBy,
    page: page,
  };

  const queryParams = new URLSearchParams(params).toString();

  return await fetch(`${endpoints.getProductLinksEndpoint}?${queryParams}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      if (data.status === "OK") {
        if (data["data"].length > 0) {
          return data["data"].map((link) => {
            const productLink: ProductLink = new ProductLink();
            productLink.productName = link.productName;
            productLink.categoryName = link.categoryName;
            productLink.productId = link.productId;

            return productLink;
          });
        }
      }
    })
    .then((data) => {
      if (!data || data.length < 1) {
        notifyError("No products were found by your prompt");
      }

      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      notifyError(error);
    });
}

export async function checkTelegramUsernameExists(telegramUsername: string): boolean {
  const requestOptions = {
    method: "GET",
    headers: getDefaultHeaders(),
  };

  const params = {
    username: telegramUsername.replace("@", ""),
  };

  const queryParams = new URLSearchParams(params).toString();

  return await fetch(`${endpoints.checkTelegramExists}?${queryParams}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      if (data.status === "OK") {
        if (!data["data"]) {
          notifyError("Telegram username was not found as known");
        }

        return data["data"];
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      notifyError(error);
    });
}

export async function getOrdersCompleteData(orderFilter: OrderFilter): CustomerOrder[] {
  const requestOptions = {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify(orderFilter.formAsRequestBody()),
  };

  const params = orderFilter.formAsRequestParameters();

  const requestFilteredData = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== null && value !== undefined)
  );

  const queryParams = new URLSearchParams(requestFilteredData).toString();

  return await fetch(`${endpoints.getOrdersCompleteDate}?${queryParams}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      if (data.status === "OK") {
        if (data["data"].length > 0) {
          return data["data"].map((completeOrder) => {
            return CustomerOrder.build(completeOrder);
          });
        }
      }

      return [];
    })
    .then((data) => {
      if (!data || data.length < 1) {
        notifyError("No orders were found");
      }

      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      notifyError(error);
    });
}

export async function getOrderHistory(orderFilter: OrderFilter): OrderHistory[] {
  const requestOptions = {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify(orderFilter.formAsRequestBody()),
  };

  const params = orderFilter.formAsRequestParameters();

  const requestFilteredData = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== null && value !== undefined)
  );

  const queryParams = new URLSearchParams(requestFilteredData).toString();

  return await fetch(`${endpoints.getOrderHistory}?${queryParams}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      if (data && data.status === "OK") {
        if (data["data"] && Object.keys(data["data"]).length > 0) {
          let response;

          Object.entries(data["data"]).forEach(([number: string, orderHistory]) => {
            response = OrderHistory.build(number, orderHistory);
          });

          return response;
        }
      }

      return [];
    })
    .then((history) => {
      if (!history || history.length < 1) {
        notifyError("Order history was not found for this order");
      }

      return history;
    })
    .catch((error) => {
      console.error("Error:", error);
      notifyError(error);
    });
}

export async function requestAdditionalApprovalCode(identifier: string): boolean {
  const requestOptions = {
    method: "POST",
    headers: getDefaultHeaders(),
  };

  const queryParams: string = new URLSearchParams({ identifier: identifier }).toString();

  notifySuccess("Trying to request extra code");
  return await fetch(`${endpoints.requestAdditionalApprovalUserMessage}?${queryParams}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      if (data && data.status === "OK") {
        notifySuccess("Additional verification code was requested, wait please...");

        return true;
      } else {
        notifyError(data["exception"]["exception"]);

        return false;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      notifyError(error);
    });
}

export async function initiateCredentialsAvailabilityChecking(
  username: string,
  email: string,
  telegramUsername: string,
  setUsernameException,
  setEmailException,
  setTelegramUsernameException
) {
  const requestData = {
    username: username,
    email: email === "" ? null : email,
    telegramUsername: telegramUsername === "" ? null : telegramUsername.replace("@", ""),
  };

  const requestOptions = {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify(requestData),
  };

  let result = true;

  await fetch(`${endpoints.checkCredentialsAvailabilityEndpoint}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((json) => {
      if (json.data.email === false && email !== "") {
        setEmailException("User with this email already exists");
        result = false;
      }
      if (json.data.username === false) {
        setUsernameException("User with this username already exists");
        result = false;
      }
      if (json.data.telegramUsername === false && telegramUsername !== "") {
        setTelegramUsernameException("User with this telegram already exists");
        result = false;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      notifyError(error);
    });

  return result;
}

export async function exportOrders(orderFilter: OrderFilter) {
  const requestData = {
    filename: "Orders",
  };

  const requestOptions = {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify(orderFilter.formAsRequestBody()),
  };

  const queryParams: string = new URLSearchParams(requestData).toString();

  await fetch(`${endpoints.downloadOrders}?${queryParams}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.blob();
    })
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.setAttribute("download", "Orders.xlsx"); // Set the download attribute to a filename

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => {
      console.error("There was an error downloading the file:", error);
    });
}

export async function exportOrderHistory(orderFilter: OrderFilter) {
  const requestData = {
    filename: "History",
  };

  const requestOptions = {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify(orderFilter.formAsRequestBody()),
  };

  const queryParams: string = new URLSearchParams(requestData).toString();

  await fetch(`${endpoints.downloadOrderHistory}?${queryParams}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.blob();
    })
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.setAttribute("download", "Orders.xlsx"); // Set the download attribute to a filename

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => {
      console.error("There was an error downloading the file:", error);
    });
}

export async function getUsersForManagementPanel(userFilter: UserFilter): UserManagementModel[] {
  const requestOptions = {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify(userFilter.filter()),
  };

  const queryParams: string = new URLSearchParams(userFilter.query()).toString();

  notifySuccess("Filtering users, wait...");
  return await fetch(`${endpoints.getUsersForManagement}?${queryParams}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      if (data && data.status === "OK") {
        if (data["data"] && data["data"].length > 0) {
          const users: UserManagementModel[] = [];

          for (const model of data["data"]) {
            users.push(UserManagementModel.build(model));
          }

          return users;
        }
      } else {
        notifyError(data["exception"]["exception"]);

        return [];
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      notifyError(error);
    });
}

export async function updateUser(updateUserData: { status: string, id: number }) {
  const requestOptions = {
    method: "PUT",
    headers: getDefaultHeaders(),
    body: JSON.stringify(updateUserData),
  };

  await fetch(`${endpoints.updateUser}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      if (data && data.status === "OK") {
        notifySuccess("User was updated");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        notifyError(data["exception"]["exception"]);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      notifyError(error);
    });
}

export async function addUser(data: {
  username: string,
  email: string,
  password: string,
  telegramUsername: string,
  role: string,
  status: string,
}): boolean {
  const requestData = {
    username: data.username,
    email: data.email === "" ? null : data.email,
    password: data.password,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    telegramUsername: data.telegramUsername === "" ? null : data.telegramUsername.replace("@", ""),
    role: data.role,
    status: data.status,
  };

  const requestOptions = {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify(requestData),
  };

  return await fetch(`${endpoints.signUpEndpoint}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      if (data && data.status === "OK") {
        notifySuccess("User added successfully");

        return true;
      } else {
        notifyError(data["exception"]["exception"]);

        return false;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export async function getProduct(productId: string) {
  const requestOptions = {
    method: "GET",
    headers: getDefaultHeaders(),
  };

  const queryParams: string = new URLSearchParams({ productId: productId }).toString();

  return await fetch(`${endpoints.getProduct}?${queryParams}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      if (data && data.status === "OK") {
        const productData = data["data"];

        return {
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
          marginRate: productData.marginRate,
        };
      } else {
        notifyError(data["exception"]["exception"]);

        return null;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export async function addProduct(data: any): boolean {
  const requestOptions = {
    method: "post",
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  };

  return await fetch(`${endpoints.saveProduct}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      if (data && data.status === "OK") {
        notifySuccess("Product saved successfully");

        return true;
      } else {
        notifyError(data["exception"]["exception"]);

        return false;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export async function updateProduct(data: any): boolean {
  const requestOptions = {
    method: "PUT",
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  };

  return await fetch(`${endpoints.updateProduct}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      if (data && data.status === "OK") {
        notifySuccess("Product updated successfully");

        return true;
      } else {
        notifyError(data["exception"]["exception"]);

        return false;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export default endpoints;

root.render(
  <React.Fragment>
    <ToastContainer style={{ width: "390px" }} />
    <Application />
  </React.Fragment>
);

reportWebVitals();
