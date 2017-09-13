
import { IS_PHOTO_MODAL_ON, SET_PHOTO_INDEX, SET_PHOTOS } from './actionTypes';

const initialState = {
    // Photo Modal
    isPhotoModalOn: false,
    photoIndex: null,
    photos: [],

}

export const modalsReducer = (state = initialState, action) => {
    switch (action.type) {
        case IS_PHOTO_MODAL_ON:
            return {...state, isPhotoModalOn: action.isOn};
        case SET_PHOTO_INDEX:
            return {...state, photoIndex: action.index};
        case SET_PHOTOS:
            return {...state, photos: action.photos};
        default:
          return state;
    }
}
