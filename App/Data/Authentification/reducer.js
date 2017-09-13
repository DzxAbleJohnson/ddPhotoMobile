import { LOGIN, LOGOUT } from './actionTypes';

export const initialState = {
    id: null,
    name: null,
    fullPhoneNumber: null,
    countryDialCode: null,
    phoneNumber: null,
    email: null
}
/*
*@params (ADD_PHOTO) action.photo
*@params (UPDATE_PHOTO) action.photo, action.index
*@params (DELETE_PHOTO) action.index
*@params (DELETE_ALL_PHOTO) action
*/
export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
          return Object.assign({}, state, {
            id: action.userJson.id,
            name: action.userJson.name,
            fullPhoneNumber: action.userJson.fullPhoneNumber,
            countryDialCode: action.userJson.countryDialCode,
            phoneNumber: action.userJson.phoneNumber,
            email: action.userJson.email
          });
        case LOGOUT:
            return Object.assign({}, state, initialState);
        default:
          return state;
    }
}
