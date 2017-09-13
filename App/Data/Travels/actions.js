/**
 * @providesModule ActionTravels
 */
 'use strict';
import { ADD_TRAVEL, UPDATE_TRAVEL, DELETE_TRAVEL, DELETE_ALL_TRAVEL, CHANGE_TRAVELS_ARRAY, CHANGE_SORT } from './actionTypes';

/*
* other constants
*/
type Travel = {
    photos: array;
    description: string;

    mapImgUri: string;
    timelineImgUri: string;
    mapImgUrl: string;
    timelineImgUrl: string;

    center: object; // center.longitude, center.latitude, center.zoom
    mapStyle: string;

    photoShape: string;
    photoOutlineColor: string;
    photoOutlineWidth: number;

    routeColor: string;
    routeWidth: number;

    titleText: string;
    titleFont: string;
    titleColor: string;
    titleBg: string;
    titleAlign: string;
    titleX: number;
    titleY: number;

    date: timestamp;
}


/*
* action creators
*/
// Travels
export const addTravel = ( travel: Travel ) => {
  return { type: ADD_TRAVEL , travel };
}
export const updateTravel = ( travel: Travel, index: number ) => {
    return { type: UPDATE_TRAVEL , travel, index };
}
export const deleteTravel = ( index: number ) => {
  return { type: DELETE_TRAVEL , index };
}
export const deleteAllTravel = ( ) => {
  return { type: DELETE_ALL_TRAVEL };
}

export const changeTravelsArray = ( travels: array ) => {
  return { type: CHANGE_TRAVELS_ARRAY , travels };
}

// Sort
export const changeSort = ( sort: string ) => {
  return { type: CHANGE_SORT , sort };
}