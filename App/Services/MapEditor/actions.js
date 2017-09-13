/**
 * @providesModule ActionMapEditor2
 */
 'use strict';
import { SET_LOCATION_TEXT, IMAGE_UPLOAD_PROGRESS, IMAGE_UPLOAD_TOTAL, RESET, ADD_PHOTO, UPDATE_PHOTO, CHANGE_PHOTOS_WITH_NO_GPS_ARRAY, DELETE_PHOTO, DELETE_ALL_PHOTO, CHANGE_PHOTOS_ARRAY, ADD_PHOTO_WITH_NO_GPS, DELETE_PHOTO_WITH_NO_GPS, DELETE_ALL_PHOTO_WITH_NO_GPS, UPDATE_CENTER, SELECT_MAP_STYLE, SELECT_PHOTO_SHAPE, SELECT_PHOTO_OUTLINE_COLOR, SELECT_PHOTO_OUTLINE_WIDTH, SELECT_ROUTE_COLOR, SELECT_ROUTE_WIDTH, SET_TITLE_TEXT, SELECT_TITLE_FONT, SELECT_TITLE_ALIGN, SELECT_TITLE_BG, SELECT_TITLE_COLOR, SET_TITLE_EDIT_MODE, SELECT_TITLE_X, SELECT_TITLE_Y, SET_MAP_IMAGE_CAPTURE, SET_TIMELINE_IMAGE_CAPTURE, SET_REMEMBER } from './actionTypes';
import * as Constant from './const';

/*
* other constants
*/
type Photo = {
    uri: string;
    "uri@800": string;
    url: string;
    "url@800": string;
    "mapImgUri": string;
    "timelineImgUri": string;
    "mapImgUrl": string;
    "timelineImgUrl": string;
    longitude: number;
    latitude: number;
    locationText: string;
    date: timestamp;
}
export const MAP_STYLES = Constant.MAP_STYLES;
export const COLORS = Constant.COLORS;
export const SHAPES = Constant.SHAPES;
export const FONTS = Constant.FONTS;

/*
* action creators
*/
export const reset = ( initialState ) => {
  return { type: RESET, initialState };
}

// Photos
export const addPhoto = ( photo: Photo ) => {
  return { type: ADD_PHOTO , photo };
}
export const updatePhoto = ( photo: Photo, index: number ) => {
  return { type: UPDATE_PHOTO , photo, index };
}
export const deletePhoto = ( index: number ) => {
    return { type: DELETE_PHOTO , index };
}
export const deleteAllPhoto = ( ) => {
  return { type: DELETE_ALL_PHOTO };
}
export const changePhotosArray = ( photos: array ) => {
  return { type: CHANGE_PHOTOS_ARRAY , photos };
}

// Photos with no GPS data
export const addPhotoWithNoGPS = ( photo: Photo ) => {
  return { type: ADD_PHOTO_WITH_NO_GPS , photo };
}
export const deletePhotoWithNoGPS = ( index: number ) => {
  return { type: DELETE_PHOTO_WITH_NO_GPS , index };
}
export const deleteAllPhotoWithNoGPS = ( ) => {
  return { type: DELETE_ALL_PHOTO_WITH_NO_GPS };
}
export const changePhotosWithNoGPSArray = ( photos: array ) => {
    return { type: CHANGE_PHOTOS_WITH_NO_GPS_ARRAY , photos };
}


// Map Position
export const updateCenter = ( center ) => {
  return { type: UPDATE_CENTER , center };
}

// MapStyle
export const selectMapStyle = ( mapStyle ) => {
  return { type: SELECT_MAP_STYLE , mapStyle };
}

// PhotoStyle
export const selectPhotoShape = ( shape ) => {
  return { type: SELECT_PHOTO_SHAPE , shape };
}
export const selectPhotoOutlineColor = ( color ) => {
  return { type: SELECT_PHOTO_OUTLINE_COLOR , color };
}
export const selectPhotoOutlineWidth = ( width ) => {
  return { type: SELECT_PHOTO_OUTLINE_WIDTH , width };
}

// RouteStyle
export const selectRouteColor = ( color ) => {
  return { type: SELECT_ROUTE_COLOR , color };
}
export const selectRouteWidth = ( width ) => {
  return { type: SELECT_ROUTE_WIDTH , width };
}

// Title
export const setTitleText = ( text ) => {
  return { type: SET_TITLE_TEXT , text };
}
export const selectTitleFont = ( font ) => {
  return { type: SELECT_TITLE_FONT , font };
}
export const selectTitleAlign = ( align ) => {
  return { type: SELECT_TITLE_ALIGN , align };
}
export const selectTitleBg = ( color ) => {
  return { type: SELECT_TITLE_BG , color };
}
export const selectTitleColor = ( color ) => {
  return { type: SELECT_TITLE_COLOR , color };
}
export const setTitleEditMode = ( isEdit ) => {
  return { type: SELECT_TITLE_COLOR , isEdit };
}
export const selectTitleX = ( x ) => {
    return { type: SELECT_TITLE_X , x };
}
export const selectTitleY = ( y ) => {
    return { type: SELECT_TITLE_Y , y };
}

export const setMapImageCapture = ( mapImgUri ) => {
    return { type: SET_MAP_IMAGE_CAPTURE , mapImgUri };
}
export const setTimelineImageCapture = ( timelineImgUri ) => {
    return { type: SET_TIMELINE_IMAGE_CAPTURE , timelineImgUri };
}

// Remember
export const setRemember = ( isRemember ) => {
  return { type: SET_REMEMBER , isRemember };
}

// ETC
export const imageUploadProgress = ( success ) => {
  return { type: IMAGE_UPLOAD_PROGRESS , success };
}
export const imageUploadTotal = ( total ) => {
    return { type: IMAGE_UPLOAD_TOTAL , total };
}
export const setLocationText = ( locationText ) => {
    return { type: SET_LOCATION_TEXT , locationText };
}



