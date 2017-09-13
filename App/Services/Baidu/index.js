/**
 * @providesModule BaiduMapService
 */
import store from 'Store';

import * as api from './api';

// Actions
import { addPlace, deleteAllPlace } from 'ActionPlaceSuggestion';
import { updatePhoto } from 'ActionMapEditor2';

/*
* @params {String} query
*/
export const placeSuggestion = ( query ) => {
    return api.placeSuggestion( query )
    .then(( response ) => {
        store.dispatch( deleteAllPlace( ) );
        for (var i = 0; i < response.result.length; i++){
            if (response.result[i].location && response.result[i].name){
                let center = gcj02towgs84(response.result[i].location.lng, response.result[i].location.lat);
                store.dispatch( addPlace( {
            	    name: response.result[i].name,
            	    longitude: center[0],
            	    latitude: center[1],
            	    city: response.result[i].city,
            	    district: response.result[i].district
            	} ));
            }
        }
        /* {"status":0,
        "message":"ok",
        "result":[
            {
                "name":"天安门",
                "location":{"lat":39.915174,"lng":116.403875},
                "uid":"65e1ee886c885190f60e77ff",
                "city":"北京市",
                "district":"东城区",
            }
        */
    })
    .catch((exception) => {
        throw exception; // throw의 동작은?
    });
}


/*
* @params {Number} longitude
* @params {Number} latitude
*/
export const geocoderReverse = ( longitude, latitude ) => {
    return api.geocoderReverse( longitude, latitude );
}

const pi = 3.1415926535897932384626; // π
const a = 6378245.0; // 长半轴
const ee = 0.00669342162296594323; // 扁率

function gcj02towgs84(lng, lat) {
    let dlat = transformlat(lng - 105.0, lat - 35.0);
    let dlng = transformlng(lng - 105.0, lat - 35.0);
    let radlat = lat / 180.0 * pi;
    let magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    let sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * pi);
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * pi);
    let mglat = lat + dlat;
    let mglng = lng + dlng;
    return [lng * 2 - mglng, lat * 2 - mglat];
}
function transformlat(lng, lat) {
    let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * pi) + 20.0 * Math.sin(2.0 * lng * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * pi) + 40.0 * Math.sin(lat / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * pi) + 320 * Math.sin(lat * pi / 30.0)) * 2.0 / 3.0;
    return ret
}
function transformlng(lng, lat) {
    let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * pi) + 20.0 * Math.sin(2.0 * lng * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * pi) + 40.0 * Math.sin(lng / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * pi) + 300.0 * Math.sin(lng / 30.0 * pi)) * 2.0 / 3.0;
    return ret
}