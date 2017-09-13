/**
 * @providesModule ActionModals
 */
import { IS_PHOTO_MODAL_ON, SET_PHOTO_INDEX, SET_PHOTOS } from './actionTypes';

/*
* other constants
*/

/*
* action creators
*/


// Photo Modal
export const isPhotoModalOn = ( isOn ) => {
  return { type: IS_PHOTO_MODAL_ON , isOn };
}

export const setPhotoIndex = ( index ) => {
    return { type: SET_PHOTO_INDEX , index };
}

export const setPhotos = ( photos ) => {
    console.log(photos);
    return { type: SET_PHOTOS , photos };
}
