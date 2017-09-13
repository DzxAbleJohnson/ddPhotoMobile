/**
 * @providesModule ActionNavigation
 */
import { CHANGE_TAB, CHANGE_EDIT_TITLE_TAB, WIDE_SCREEN, CHANGE_TRAVEL_SCREEN, SET_NAVIGATOR, SET_SCROLL_REF, SET_SCREEN } from './actionTypes';
import * as Constant from './const';

/*
* other constants
*/
export const TABS = Constant.TABS;
export const TAB_TITLES = Constant.TAB_TITLES;
export const EDIT_TITLE_TABS = Constant.EDIT_TITLE_TABS;
export const TRAVEL_SCREEN = Constant.TRAVEL_SCREEN;
export const SCREENS = Constant.SCREENS;

/*
* action creators
*/


/**
* @param {string} menu : CREATE, EDIT, STORAGE
*/
export const changeTab = ( tab ) => {
  return { type: CHANGE_TAB , tab };
}

export const changeEditTitleTab = ( editTitleTab ) => {
  return { type: CHANGE_EDIT_TITLE_TAB , editTitleTab };
}

export const wideScreen = ( isOn ) => {
  return { type: WIDE_SCREEN , isOn };
}

export const changeTravelScreen = ( screen ) => {
    return { type: CHANGE_TRAVEL_SCREEN , screen };
}

export const setNavigator = ( navigator ) => {
    return { type: SET_NAVIGATOR , navigator };
}

export const setScrollRef = ( ref ) => {
    return { type: SET_SCROLL_REF , ref };
}

export const setScreen = ( screen ) => {
    return { type: SET_SCREEN , screen };
}