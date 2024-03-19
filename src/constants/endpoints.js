export const signUpEndpoint = process.env.REACT_APP_USER_SERVICE_ADDRESS + '/api/v1/users/allowed'; //POST
export const signInEndpoint = process.env.REACT_APP_USER_SERVICE_ADDRESS + '/login'; //POST
export const checkCredentialsAvailabilityEndpoint = process.env.REACT_APP_USER_SERVICE_ADDRESS + '/api/v1/users/credentials/availability/allowed'; //POST
export const certificationEndpoint = process.env.REACT_APP_CERTIFICATION_SERVICE_ADDRESS + '/api/v1/certification/allowed'; //POST
