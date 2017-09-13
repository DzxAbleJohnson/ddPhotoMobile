import { ADD_PLACE, DELETE_ALL_PLACE } from './actionTypes';

const initialState = {
    places: []
}
/*
*@params (ADD_PLACE) action.place
*/
export const placeSuggestionReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PLACE:
          return {...state, places: [...state.places, action.place]};
        case DELETE_ALL_PLACE:
          return {...state, places: []};
        default:
          return state;
    }
}
