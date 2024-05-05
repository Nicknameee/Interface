export let createOrder = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/orders/save"; //POST
export let initiateTransaction = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/transactions/initiate"; //POST
export const getTransactions = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/transactions"; //GET
export const createTransaction = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/transactions/manual/payment"; //GET
export const getUserInfoEndpoint = process.env.REACT_APP_USER_SERVICE_ADDRESS + "/api/v1/users"; //GET
export const signUpEndpoint = process.env.REACT_APP_USER_SERVICE_ADDRESS + "/api/v1/users/allowed"; //POST
export const signInEndpoint = process.env.REACT_APP_USER_SERVICE_ADDRESS + "/login"; //POST
export const checkCredentialsAvailabilityEndpoint =
  process.env.REACT_APP_USER_SERVICE_ADDRESS + "/api/v1/users/credentials/availability/allowed"; //POST
export const certificationEndpoint =
  process.env.REACT_APP_CERTIFICATION_SERVICE_ADDRESS + "/api/v1/certification/allowed"; //POST
export const requestAdditionalApprovalUserMessage =
  process.env.REACT_APP_USER_SERVICE_ADDRESS + "/api/v1/users/approving/request/allowed";
export const createCategoryEndpoint = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/categories/save"; //GET
export const setCategoryPictureEndpoint = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/categories/picture"; //GET
export const getCategoriesEndpoint = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/categories/allowed"; //GET
export const getProductsEndpoint = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/products/allowed"; //GET
export const getNovaPostDepartments =
  process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/util/v1/services/post/nova/warehouses"; //GET
export const webSocketTelegramTopic = "/topic/telegram/subscription/"; //WS
export const getProductLinksEndpoint = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/products/search/allowed"; //GET
export const getOrdersCompleteDate = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/orders/complete"; //POST
export const getOrderHistory = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/orders/history"; //POST
export const checkTelegramExists =
  process.env.REACT_APP_MESSAGE_SERVICE_ADDRESS + "/api/v1/message/telegram/exists/allowed"; //GET
export const waitingList = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/products/waiting/list";
export const downloadOrders = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/orders/export"; //POST
export const downloadOrderHistory = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/orders/export/history"; //POST
export const getUsersForManagement = process.env.REACT_APP_USER_SERVICE_ADDRESS + "/api/v1/users/management"; //POST
export const updateUser = process.env.REACT_APP_USER_SERVICE_ADDRESS + "/api/v1/users/update"; //PUT
export const getProduct = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/products/product"; //GET
export const saveProduct = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/products/save"; //POST
export const updateProduct = process.env.REACT_APP_ORDER_SERVICE_ADDRESS + "/api/v1/products/update"; //PUT
