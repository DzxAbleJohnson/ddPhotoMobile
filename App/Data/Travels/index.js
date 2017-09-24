/**
 * @providesModule TravelsService
 */
import {
    Platform
} from 'react-native';
import store from 'Store';

// Actions
import { addTravel, changeTravelsArray } from './actions';

// APIs
import * as TravelApi from './api';

// Utils
import * as Base64Util from 'Base64UtilService';
import * as ShareUmengUtil from 'ShareUmengUtil';

/*
* @params
*/
export const findMyTravelsApi = ( ) => {
    return new Promise((resolve, reject) => {
        console.log("(GET) api//travel/find/my :: Send!");
        TravelApi.findMyTravels( ).then(function( travelsJson ){
            console.log("(GET) api//travel/find/my :: Success!");
            resolve( travelsJson );
        }).catch((err) => {
            console.log("(GET) api//travel/find/my :: Fail!");
            reject(err);
        });
    });
};

export const createTravelApi = ( travel: Travel ) => {
    return new Promise((resolve, reject) => {
        console.log("(POST) api/travel/create :: Send!");
        TravelApi.createTravel( travel ).then(( travelJson ) => {
            console.log("(POST) api/travel/create :: Success!");
            resolve( travelJson );
        }).catch((err) => {
            console.log("(POST) api/travel/create :: Fail!");
            reject(err);
        });
    });
};
export const updateTravelApi = ( travel: Travel ) => {
    return new Promise((resolve, reject) => {
        console.log("(POST) api/travel/update :: Send!");
        TravelApi.updateTravel( travel ).then(() => {
            console.log("(POST) api/travel/update :: Success!");
            resolve();
        }).catch((err) => {
            console.log("(POST) api/travel/update :: Fail!");
            reject(err);
        });
    });
}

export const deleteTravelApi = ( travel:Travel ) => {
    return new Promise((resolve, reject) => {
        console.log("(POST) api/travel/delete :: Send!");
        TravelApi.deleteTravel( {tId: travel.id, uId: travel.uId} ).then(( response ) => {
            console.log("(POST) api/travel/delete :: Success!");
            resolve( );
        }).catch((err) => {
            console.log("(POST) api/travel/delete :: Fail!");
            reject(err);
        });
    });
};

export const addTravels = ( travels ) => {
    var newTravels = store.getState().data.travels.travels.map(a=> { let copyA = {...a}; return copyA; });
    newTravels = [...newTravels, ...travels];
    newTravels = duplicateCheck( newTravels );
    switch ( store.getState().data.travels.sort ){
        case "new":
            newTravels.sort(function(a,b) {return (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0);} );
            break;
        default:
            newTravels.sort(function(a,b) {return (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0);} );
            break;
    }
    store.dispatch( changeTravelsArray( newTravels ) );
};


export const getCenter4PhotoModal = ( photo ) => {
    if (photo.longitude < 0) {
        return center = {
            longitude: photo.longitude + 0.000000001 * Math.floor(Math.random() * 100),
            ...Platform.select({
                ios: {
                    latitude: photo.latitude + 0.0027,
                },
                android: {
                    latitude: photo.latitude + 0.0035,
                },
            }),
            zoom: 17
        };
    } else {
        return center = {
            longitude: photo.longitude + 0.000000001 * Math.floor(Math.random() * 100),
            ...Platform.select({
                ios: {
                    latitude: photo.latitude + 0.004,
                },
                android: {
                    latitude: photo.latitude + 0.0047,
                },
            }),
            zoom: 17
        };

    }
};

export const share = ( travel ) => {
    let message = "点点照 - ";
    if (!travel.description || travel.description == ''){
        message += '用照片回忆我的足迹';
    }else{
        message += travel.description;
    }
    ShareUmengUtil.share(message, message, travel.photos[0]["url@800"], 'http://ddphoto.com.cn/travel/' + Base64Util.stringToB64(travel.id));
};

var duplicateCheck = ( a ) => {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
        var item = a[i].id;
        if(seen[item] !== 1) {
            seen[item] = 1;
            out[j++] = a[i];
        }
    }
    return out;
};