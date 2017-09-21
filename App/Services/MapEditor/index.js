/**
 * @providesModule MapEditorService
 */
import store from 'Store';
import {
    Platform
} from 'react-native';

import { initialState } from './reducer';

// Actions
import { addTravel } from 'ActionTravels';
import { reset, addPhoto, updatePhoto, updateCenter, changePhotosArray, imageUploadProgress, imageUploadTotal, setLocationText } from './actions';

// Services
import * as TravelsService from 'TravelsService';
import * as ImageManager from 'ImageManager';
import * as BaiduMapService from 'BaiduMapService';



/*
 * updateMarkers of travel
 */
export const updateMarkers = ( color: string, shape: string, width: number, callback = function(){} ) => {
    var photos = store.getState().services.mapEditor.photos;
    var newPhotos = photos.map(a=> { let copyA = {...a}; return copyA; });
    var countTemp = 0;
    newPhotos.forEach(function( photo ){
        var i = newPhotos.indexOf(photo);
        ImageManager.createMarker( photo, color, shape, width, i + 1 ).then((response) => {
            newPhotos[i]["uri@marker"] = response.uri;
            countTemp++;
            if ( countTemp == newPhotos.length ){
                store.dispatch( changePhotosArray( newPhotos ) );
                callback();
            }
        });
    });
};
export const updateLocationText = ( callback = function(){} ) => {
    var travel = store.getState().services.mapEditor;
    var newPhotos = travel.photos.map(a=> { let copyA = {...a}; return copyA; });
    var countTemp = 0;
    BaiduMapService.geocoderReverse( travel.center.longitude, travel.center.latitude ).then((response) => {
        store.dispatch( setLocationText( response.result.formatted_address ) );
    });
    newPhotos.forEach(function( photo ){
        var i = newPhotos.indexOf( photo );
        if ( !photo.locationText ){
            // 위치정보를 바탕으로 주소를 입력해줌
            BaiduMapService.geocoderReverse( photo.longitude, photo.latitude ).then((response) => {
                newPhotos[i]["locationText"] = response.result.formatted_address;
                countTemp++;
                if ( countTemp == newPhotos.length ){
                    store.dispatch( changePhotosArray( newPhotos ) );
                    callback();
                }

            });
        }else{
            countTemp++;
        }
    });
}

export const saveTravel = ( description:string ) => {
    var travelEditData = JSON.parse(JSON.stringify(store.getState().services.mapEditor));
    // 총 업로드해야하는 이미지 개수.
    store.dispatch( imageUploadTotal( (travelEditData.photos.length * 2) + 2 + 1 ) );
    return new Promise((resolve, reject) => {
        // 이미지 업로드
        var promises = [];
        promises.push(ImageManager.uploadPhoto2Server( travelEditData["mapImgUri"], "image/jpeg", new Date().getTime() + "_mapImg.jpg" )
            .then((url) => {
                travelEditData["mapImgUrl"] = url;
                store.dispatch( imageUploadProgress( true ) );
            }));
        travelEditData.photos.forEach(( photo ) => {
            var i = travelEditData.photos.indexOf( photo );
            promises.push(ImageManager.uploadPhoto2Server( photo["uri@800"], "image/jpeg", new Date().getTime() + "1" + Math.floor(Math.random() * 10000) + "_800.jpg" )
                .then((url) => {
                    travelEditData.photos[i]["url@800"] = url;
                    store.dispatch( imageUploadProgress( true ) );
                }));
            promises.push(ImageManager.uploadPhoto2Server( photo["uri@marker"], "image/png", new Date().getTime() + "1" + Math.floor(Math.random() * 10000) + "_marker.png" )
                .then((url) => {
                    travelEditData.photos[i]["url@marker"] = url;
                    store.dispatch( imageUploadProgress( true ) );
                }));
        });
        setTimeout(()=>{
            Promise.all(promises).then(() => {
                let timelineImgUrl = new Date().getTime() + "_timelineImg.jpg"; // Timeline은 너무 오래 걸려서 따로 뺀다
                ImageManager.uploadPhoto2Server( travelEditData["timelineImgUri"], "image/jpeg", timelineImgUrl);
                /*BackgroundTask.define(() => {
                    ImageManager.uploadPhoto2Server( travelEditData["timelineImgUri"], "image/jpeg", timelineImgUrl)
                        .then(() => {
                            BackgroundTask.finish();
                            BackgroundTask.cancel();
                        })
                        .catch(() => {
                            BackgroundTask.finish();
                            BackgroundTask.cancel();
                        });
                });
                BackgroundTask.schedule({});*/
                /*if (Platform.OS == "ios") {
                    console.log("==1");
                    BackgroundIos.configure({
                        stopOnTerminate: false
                    }, () => {
                        console.log("==2");
                        ImageManager.uploadPhoto2Server( travelEditData["timelineImgUri"], "image/jpeg", timelineImgUrl)
                            .then(() => {
                                console.log("==3");
                                BackgroundIos.finish();
                            })
                            .catch(() => {
                                console.log("==4");
                                BackgroundIos.finish();
                            });

                    }, (err) => {
                        console.log(err);
                        BackgroundIos.finish();
                    });
                    BackgroundIos.start(()=>{}, ()=>{});
                } else {
                    BackgroundAndroid.register({
                        jobKey: "UPLOAD_TIMELINE_IMAGE" + timelineImgUrl,
                        job: () => {
                            ImageManager.uploadPhoto2Server( travelEditData["timelineImgUri"], "image/jpeg", timelineImgUrl)
                                .then(() => {
                                    BackgroundAndroid.cancel({jobKey: "UPLOAD_TIMELINE_IMAGE" + timelineImgUrl});
                                })
                                .catch(() => {
                                    BackgroundAndroid.cancel({jobKey: "UPLOAD_TIMELINE_IMAGE" + timelineImgUrl});
                                });
                        }
                    });
                    BackgroundAndroid.schedule({
                        jobKey: "UPLOAD_TIMELINE_IMAGE" + timelineImgUrl,
                    });
                }*/

                // 이미지 업로드 후
                var travel = {
                    photos: travelEditData.photos,
                    uId: store.getState().data.auth.id,
                    description: description,

                    mapImgUrl: travelEditData.mapImgUrl,
                    timelineImgUrl: "http://ddphoto-1253999256.cosgz.myqcloud.com/images/" + timelineImgUrl,

                    center: travelEditData.center,
                    mapStyle: travelEditData.mapStyle,

                    photoShape: travelEditData.photoShape,
                    photoOutlineColor: travelEditData.photoOutlineColor,
                    photoOutlineWidth: travelEditData.photoOutlineWidth,

                    routeColor: travelEditData.routeColor,
                    routeWidth: travelEditData.routeWidth,

                    titleText: travelEditData.titleText,
                    titleFont: travelEditData.titleFont,
                    titleColor: travelEditData.titleColor,
                    titleBg: travelEditData.titleBg,
                    titleAlign: travelEditData.titleAlign,
                    titleX: travelEditData.titleX,
                    titleY: travelEditData.titleY,

                    locationText: travelEditData.locationText,

                    date: new Date()
                };
                TravelsService.createTravelApi( travel ).then((travelJson) => {
                    console.log('(POST) Success :: /Service/MapEditor/index.js');
                    store.dispatch( imageUploadProgress( true ) );
                    store.dispatch( addTravel( travelJson ) );
                    resetMapEditor( );
                    resolve();
                }).catch((err) =>{
                    console.log("Err :: /Service/MapEditor/index.js :: saveTravel err on createTravelApi");
                    console.log(err);
                    reject(err);
                });

            }).catch( (err) => {
                console.log("Err :: /Service/MapEditor/index.js :: saveTravel err on uploading images");
                console.log(err);
                reject(err)}
            );
            store.dispatch( imageUploadProgress( true ) );
        }, 100);
    });

}

export const resetMapEditor = () => {
    var travelEditData = store.getState().services.mapEditor;
    var initialStateRem = JSON.parse(JSON.stringify( initialState ));
    if ( travelEditData.remember ){
        initialStateRem.mapStyle = travelEditData.mapStyle;

        initialStateRem.photoShape = travelEditData.photoShape;
        initialStateRem.photoOutlineColor = travelEditData.photoOutlineColor;
        initialStateRem.photoOutlineWidth = travelEditData.photoOutlineWidth;

        initialStateRem.routeColor = travelEditData.routeColor;
        initialStateRem.routeWidth = travelEditData.routeWidth;

        initialStateRem.titleFont = travelEditData.titleFont;
        initialStateRem.titleColor = travelEditData.titleColor;
        initialStateRem.titleBg = travelEditData.titleBg;
        initialStateRem.titleAlign = travelEditData.titleAlign;

        initialStateRem.remember = travelEditData.remember;
    }
    store.dispatch( reset( initialStateRem ) );
}


/*
* @params {Photo} photo
*/
export const addPhotos = ( photos:array ) => {
    var travelEditData = store.getState().services.mapEditor;
    var newPhotos = travelEditData.photos.map(a=> { let copyA = {...a}; return copyA; });
    newPhotos = [...newPhotos, ...photos];
    newPhotos.sort(function(a,b) {return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);} );
    newPhotos = duplicateCheck( newPhotos );
    store.dispatch( changePhotosArray( newPhotos ) );
    updateMarkers( travelEditData.photoOutlineColor, travelEditData.photoShape, travelEditData.photoOutlineWidth, function(){
        store.dispatch( updateCenter( getPosition( newPhotos ) ) );
        updateLocationText( );
    });
}


export const getPosition = ( photos ) => {
    // 가운데 지점을 찾아서, 맵을 이동하고 Zoom 해줌
    if (photos.length > 0){
        var center = {
            longitude: 0,
            latitude: 0,
            zoom: 15
        }
        // 중앙 지점 찾기
        let leftTop = {
            longitude: photos[0].longitude,
            latitude: photos[0].latitude,
        };
        let rightBottom = {
            longitude: photos[0].longitude,
            latitude: photos[0].latitude,
        };
        for (var i = 0; i < photos.length; i++){
            if ( photos[i].longitude > leftTop.longitude){
                leftTop.longitude = photos[i].longitude;
            }
            if ( photos[i].latitude > rightBottom.latitude){
                rightBottom.latitude = photos[i].latitude;
            }
            if ( photos[i].longitude < rightBottom.longitude){
                rightBottom.longitude = photos[i].longitude;
            }
            if ( photos[i].latitude < leftTop.latitude){
                leftTop.latitude = photos[i].latitude;
            }
        }
        center.longitude = (leftTop.longitude + rightBottom.longitude) / 2;
        center.latitude = (leftTop.latitude + rightBottom.latitude) / 2;

        // Zoom 수치 찾기
        var maxDistance = 0;
        for (var i = 0; i < photos.length; i++){
            if (maxDistance < center.longitude - photos[i].longitude )
                maxDistance = center.longitude - photos[i].longitude;
            if (maxDistance < center.latitude - photos[i].latitude)
                maxDistance = center.latitude - photos[i].latitude;
        }
        center.zoom = getZoom( maxDistance );
        //console.log(center);
        //console.log(center.zoom);
        //console.log(maxDistance);
        // 기존 위치와 같으면 맵상에서 업데이트가 안되는 문제가 있음. 이를 방지하기위해 미세하게 다르도록 조정함
        center.longitude += 0.000000001 * Math.floor(Math.random() * 100);
        center.latitude += 0.000000001 * Math.floor(Math.random() * 100);
        return center;
    }else{
        return {
            longitude: store.getState().services.mapEditor.center.longitude,
            latitude: store.getState().services.mapEditor.center.latitude,
            zoom: store.getState().services.mapEditor.center.zoom
        }
    }
}


function getZoom ( distance ){
    const distanceFixed = 0.003;
    if (distance < distanceFixed)
        return 18;
    if (distance < distanceFixed * 2)
        return 17;
    if (distance < distanceFixed * 2 * 2)
        return 16;
    if (distance < distanceFixed * 2 * 2 * 2)
        return 15;
    if (distance < distanceFixed * 2 * 2 * 2 * 2)
        return 14;
    if (distance < distanceFixed * 2 * 2 * 2 * 2 * 2)
        return 13;
    if (distance < distanceFixed * 2 * 2 * 2 * 2 * 2 * 2)
        return 12;
    if (distance < distanceFixed * 2 * 2 * 2 * 2 * 2 * 2 * 2)
        return 11;
    if (distance < distanceFixed * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2)
        return 10;
    if (distance < distanceFixed * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2)
        return 9;
    if (distance < distanceFixed * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2)
        return 8;
    if (distance < distanceFixed * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2)
        return 7;
    if (distance < distanceFixed * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2)
        return 6;
    if (distance < distanceFixed * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2)
        return 5;
    if (distance < distanceFixed * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2)
        return 4;
    if (distance >= distanceFixed * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2)
        return 3;
    return 3;
}

var duplicateCheck = ( a ) => {
    var seen = {};
    var seen2 = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
        var item = a[i].date;
        var item2 = a[i].fileName;
        if(seen[item] !== 1 && seen2[item2] !== 1) {
            seen[item] = 1;
            out[j++] = a[i];
        }
    }
    return out;
};