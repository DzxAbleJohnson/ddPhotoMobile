/**
 * @providesModule ActionAuth
 */
 'use strict';
import { LOGIN, LOGOUT } from './actionTypes';

/*
* other constants
*/

/*
* action creators
*/
export const login = ( userJson ) => {
    return { type: LOGIN, userJson };
}

export const logout = ( ) => {
    return { type: LOGOUT };
}
