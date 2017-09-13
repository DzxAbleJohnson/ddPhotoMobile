/**
 * @providesModule ActionPlaceSuggestion
 */
 'use strict';
import { ADD_PLACE, DELETE_ALL_PLACE } from './actionTypes';

/*
* other constants
*/
type Place = {
    name: string;
    longitude: number;
    latitude: number;
    city: string,
    district: string
}

/*
* action creators
*/
// Photos
export const addPlace = ( place: Place ) => {
  return { type: ADD_PLACE , place };
}
export const deleteAllPlace = ( ) => {
  return { type: DELETE_ALL_PLACE };
}