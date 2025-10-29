// ** Auth Endpoints
export default {

  loginEndpoint: `${process.env.REACT_APP_BASE_URL}/auth/login`,
  registerEndpoint: `${process.env.REACT_APP_BASE_URL}/auth/register`,
  refreshEndpoint: `${process.env.REACT_APP_BASE_URL}/auth/refresh-token`,
  logoutEndpoint: '/jwt/logout',

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
}
