import { SET_LOCATION_TEXT, IMAGE_UPLOAD_PROGRESS, IMAGE_UPLOAD_TOTAL, RESET, ADD_PHOTO, UPDATE_PHOTO, CHANGE_PHOTOS_WITH_NO_GPS_ARRAY, DELETE_PHOTO, DELETE_ALL_PHOTO, CHANGE_PHOTOS_ARRAY, ADD_PHOTO_WITH_NO_GPS, DELETE_PHOTO_WITH_NO_GPS, DELETE_ALL_PHOTO_WITH_NO_GPS, UPDATE_CENTER, SELECT_MAP_STYLE, SELECT_PHOTO_SHAPE, SELECT_PHOTO_OUTLINE_COLOR, SELECT_PHOTO_OUTLINE_WIDTH, SELECT_ROUTE_COLOR, SELECT_ROUTE_WIDTH, SET_TITLE_TEXT, SELECT_TITLE_FONT, SELECT_TITLE_ALIGN, SELECT_TITLE_BG, SELECT_TITLE_COLOR, SET_TITLE_EDIT_MODE, SELECT_TITLE_X, SELECT_TITLE_Y, SET_MAP_IMAGE_CAPTURE, SET_TIMELINE_IMAGE_CAPTURE, SET_REMEMBER,  } from './actionTypes';
import * as Constant from './const';

export const initialState = {
    photos: [],
    photosWithNoGPS: [],

    center: {
        longitude: 116.404,
        latitude: 39.915,
        zoom: 5
    },

    mapStyle: Constant.MAP_STYLES.NORMAL,

    photoShape: Constant.SHAPES.ROUNDED_SQUARE,
    photoOutlineColor: Constant.COLORS['ffffff'],
    photoOutlineWidth: 1,

    routeColor: Constant.COLORS['0c0c0c'],
    routeWidth: 1,

    titleText: "",
    titleFont: null,
    titleColor: Constant.COLORS['0c0c0c'],
    titleBg: Constant.COLORS['ffffff'],
    titleAlign: 'left', // left, center, right
    titleX: 0,
    titleY: 0,
    titleEditMode: true,

    locationText: null,

    mapImgUri: null,
    timelineImgUri: null,

    remember: false,
    imageUploadProgress: 0,
    imageUploadTotal: 1,
}
/*
*@params (ADD_PHOTO) action.photo
*@params (UPDATE_PHOTO) action.photo, action.index
*@params (DELETE_PHOTO) action.index
*@params (DELETE_ALL_PHOTO) action
*/
export const mapEditorReducer = (state = initialState, action) => {
    switch (action.type) {
        case RESET:
          return Object.assign({}, state, action.initialState);

        case ADD_PHOTO:
          return Object.assign({}, state, { photos: [...state.photos, action.photo]});
        case UPDATE_PHOTO:
          return {...state, photos: [...state.photos.slice(0, action.index), action.photo, ...state.photos.slice(action.index + 1)]};
        case DELETE_PHOTO:
          return {...state, photos: [...state.photos.slice(0, action.index), ...state.photos.slice(action.index + 1) ]};
        case DELETE_ALL_PHOTO:
          return {...state, photos: []};
        case CHANGE_PHOTOS_ARRAY:
          return {...state, photos: action.photos};

        case ADD_PHOTO_WITH_NO_GPS:
          return Object.assign({}, state, { photosWithNoGPS: [...state.photosWithNoGPS, action.photo]});
        case DELETE_PHOTO_WITH_NO_GPS:
          return {...state, photosWithNoGPS: [...state.photosWithNoGPS.slice(0, action.index), ...state.photosWithNoGPS.slice(action.index + 1) ]};
        case DELETE_ALL_PHOTO_WITH_NO_GPS:
          return {...state, photosWithNoGPS: []};
        case CHANGE_PHOTOS_WITH_NO_GPS_ARRAY:
            return {...state, photosWithNoGPS: action.photos};

        case UPDATE_CENTER:
            return Object.assign({}, state, { center: action.center });

        case SELECT_MAP_STYLE:
          return Object.assign({}, state, { mapStyle: action.mapStyle });


        case SELECT_PHOTO_SHAPE:
          return Object.assign({}, state, { photoShape: action.shape });
        case SELECT_PHOTO_OUTLINE_COLOR:
          return Object.assign({}, state, { photoOutlineColor: action.color });
        case SELECT_PHOTO_OUTLINE_WIDTH:
          return Object.assign({}, state, { photoOutlineWidth: action.width });


        case SELECT_ROUTE_COLOR:
          return Object.assign({}, state, { routeColor: action.color });
        case SELECT_ROUTE_WIDTH:
          return Object.assign({}, state, { routeWidth: action.width });


        case SET_TITLE_TEXT:
          return Object.assign({}, state, { titleText: action.text });
        case SELECT_TITLE_FONT:
          return Object.assign({}, state, { titleFont: action.font });
        case SELECT_TITLE_ALIGN:
          return Object.assign({}, state, { titleAlign: action.align });
        case SELECT_TITLE_BG:
          return Object.assign({}, state, { titleBg: action.color });
        case SELECT_TITLE_COLOR:
          return Object.assign({}, state, { titleColor: action.color });
        case SET_TITLE_EDIT_MODE:
          return Object.assign({}, state, { titleEditMode: action.isEdit });
        case SELECT_TITLE_X:
            return Object.assign({}, state, { titleX: action.x });
        case SELECT_TITLE_Y:
            return Object.assign({}, state, { titleY: action.y });

        case SET_MAP_IMAGE_CAPTURE:
            return Object.assign({}, state, { mapImgUri: action.mapImgUri });
        case SET_TIMELINE_IMAGE_CAPTURE:
            return Object.assign({}, state, { timelineImgUri: action.timelineImgUri });

        case SET_REMEMBER:
          return Object.assign({}, state, { remember: action.isRemember });
        case IMAGE_UPLOAD_PROGRESS:
          return Object.assign({}, state, { imageUploadProgress: state.imageUploadProgress + 1 });
        case IMAGE_UPLOAD_TOTAL:
            return Object.assign({}, state, { imageUploadTotal: action.total });
        case SET_LOCATION_TEXT:
            return Object.assign({}, state, { locationText: action.locationText });


        default:
          return state;
    }
}
