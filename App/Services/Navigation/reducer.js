import { TABS, EDIT_TITLE_TABS, TRAVEL_SCREEN, SCREENS } from './actions';
import { CHANGE_TAB, CHANGE_EDIT_TITLE_TAB, WIDE_SCREEN, CHANGE_TRAVEL_SCREEN, SET_NAVIGATOR, SET_SCROLL_REF, SET_SCREEN } from './actionTypes';

const initialState = {
    tab: TABS.CREATE,
    editTitleTab: EDIT_TITLE_TABS.KEYBOARD,
    wideScreen: false,
    travelScreen: TRAVEL_SCREEN.MAP,
    navigator: null,
    scrollRef: null,
    currentScreen: SCREENS.MAP_EDITOR
}
/*
*@params (CHANGE_TAB) action.tab
*@params (CHANGE_EDIT_TITLE_TAB) action.editTitleTab
*/
export const navigationReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_TAB:
          return {...state, tab: action.tab};
        case CHANGE_EDIT_TITLE_TAB:
          return {...state, editTitleTab: action.editTitleTab};
        case WIDE_SCREEN:
          return {...state, wideScreen: action.isOn};
        case CHANGE_TRAVEL_SCREEN:
            return {...state, travelScreen: action.screen};
        case SET_NAVIGATOR:
            return {...state, navigator: action.navigator};
        case SET_SCROLL_REF:
            return Object.assign({}, state, { scrollRef: action.ref });
        case SET_SCREEN:
            return Object.assign({}, state, { currentScreen: action.screen });
        default:
          return state;
    }
}
