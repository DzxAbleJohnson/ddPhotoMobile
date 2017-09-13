import { fetchApi } from 'FetchApi';

const endPoints = {
	login: 'api/auth/login',
	signup: 'api/auth/signup',
    logout: 'api/auth/logout',
    getVerificationCode: 'api/auth/sms/getVerificationCode',
    changePassword: 'api/auth/password/change',
	session: 'api/auth/session',
};

export const login = ( query ) => fetchApi(endPoints.login, query, 'post');
export const signup = ( query ) => fetchApi(endPoints.signup, query, 'post');
export const logout = ( ) => fetchApi(endPoints.logout, {}, 'post', 'text');
export const getVerificationCode = ( query ) => fetchApi(endPoints.getVerificationCode, query, 'get', 'text');
export const changePassword = ( query ) => fetchApi(endPoints.changePassword, query, 'post', 'text');
export const session = ( query ) => fetchApi(endPoints.session, query, 'get');