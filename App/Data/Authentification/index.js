/**
 * @providesModule AuthService
 */
import store from 'Store';

import * as api from './api';

// Actions
import { login, logout } from 'ActionAuth';
import { deleteAllTravel } from 'ActionTravels';

// Services
import * as TravelsService from 'TravelsService';

/*
* @params {Number} query.countryDialCode
* @params {Number} query.phoneNumber
* @params {String} query.password
*/
export const loginApi = ( query ) => {
    return new Promise(function(resolve, reject){
        api.login(query).then(function( userJson ){
            if (!userJson.id){
                console.log('Success :: Data/Authentification/index.js :: loginApi');
                console.error('Err :: Data/Authentification/index.js :: loginApi :: There is no return values. Please check server');
                return;
            }
            store.dispatch( login( userJson ) );

            // 로그인하면 기존에 가지고 있던 여행기들 중 사용자ID 없는 여행기에 사용자ID 업데이트 해줌
            let travels = store.getState().data.travels.travels.map(a=> { let copyA = {...a}; return copyA; });
            travels.forEach((travel, index) => {
                if (!travel.uId){
                    travel.uId = userJson.id;
                    TravelsService.updateTravelApi( travel ).then(() => {}).catch((err)=>{});
                }
            });

            // 로그인하면 서버로부터 여행기 모두 다운로드 받아올 것
            TravelsService.findMyTravelsApi().then((travels) => {
                TravelsService.addTravels( travels );
            }).catch((err)=>{});
            resolve( userJson );
        }).catch((e) => {
            console.log('Err :: Data/Authentification/index.js :: loginApi');
            console.log(e);
            if (e.response){
                reject({
                    status: e.response.status,
                    message: e.response._bodyText
                });
            } else {
                reject(e);
            }
        });
    });
};

/*
* @params {Number} query.countryDialCode
* @params {Number} query.phoneNumber
* @params {String} query.name
* @params {String} query.password
*/
export const signupApi = ( query ) => {
    return new Promise(function(resolve, reject){
        api.signup(query).then(( userJson ) => {
            if (!userJson.id){
                console.error("Err :: Data/Authentification/index.js :: signupApi :: There is no return values. Please check server");
                return;
            }
            store.dispatch( login( userJson ) );
            resolve(userJson);
        }).catch((e) => {
            console.log("Err :: Data/Authentification/index.js :: signupApi");
            console.log(e);
            if (e.response){
                reject({
                    status: e.response.status,
                    message: e.response._bodyText
                });
            }else{
                reject(e);
            }
        });
    });
};

/*
* @params {Number} query.countryDialCode
* @params {Number} query.phoneNumber
* @params {String} query.name
* @params {String} query.password
*/
export const logoutApi = ( ) => {
    return new Promise(function(resolve, reject){
        api.logout( ).then(( response ) => {
            console.log("Success :: Data/Authentification/index.js :: logoutApi");
            store.dispatch( logout( ) );
            store.dispatch( deleteAllTravel( ) );
            resolve();
        }).catch((e) => {
            console.log("Err :: Data/Authentification/index.js :: logoutApi");
            console.log(e);
            if (e.response) {
                reject({
                    status: e.response.status,
                    message: e.response._bodyText
                });
            } else {
                reject(e);
            }
        });
    });
}

/*
* @params {Number} query.countryDialCode
* @params {Number} query.phoneNumber
*/
export const getVerificationCode = ( query ) => {
    return new Promise(function(resolve, reject){
        api.getVerificationCode(query).then(( verificationCode ) => {
            console.log("Success :: Data/Authentification/index.js :: getVerificationCode");
            console.log(verificationCode);
            resolve(verificationCode);
        }).catch((e) => {
            console.log("Err :: Data/Authentification/index.js :: getVerificationCode");
            console.log(e);
            if (e.response) {
                reject({
                    status: e.response.status,
                    message: e.response._bodyText
                });
            } else {
                reject(e);
            }
        });
    });
}


/*
* @params {Number} query.countryDialCode
* @params {Number} query.phoneNumber
* @params {String} query.password
*/
export const changePassword = ( query ) => {
    console.log("==1");
    console.log(query);
    return new Promise(function(resolve, reject){
        api.changePassword(query).then(( result ) => {
            console.log("Success :: Data/Authentification/index.js :: changePassword");
            resolve(null);
        }).catch((e) => {
            console.log("Err :: Data/Authentification/index.js :: changePassword");
            console.log(e);
            if (e.response) {
                reject({
                    status: e.response.status,
                    message: e.response._bodyText
                });
            } else {
                reject(e);
            }
        });
    });
}

