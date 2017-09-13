import { ADD_TRAVEL, UPDATE_TRAVEL, DELETE_TRAVEL, DELETE_ALL_TRAVEL, CHANGE_TRAVELS_ARRAY, CHANGE_SORT } from './actionTypes';

const initialState = {
    travels: [],
    sort: 'new'
}
/*
*@params (ADD_PHOTO) action.travel
*@params (DELETE_PHOTO) action.index
*@params (DELETE_ALL_PHOTO) action
*/
export const travelsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TRAVEL:
          return Object.assign({}, state, { travels: [action.travel, ...state.travels]});
        case UPDATE_TRAVEL:
          var travels = JSON.parse(JSON.stringify(state.travels));
          travels[action.index] = action.travel;
          return Object.assign({}, state, { travels: travels });
        case DELETE_TRAVEL:
          return {...state, travels: [...state.travels.slice(0, action.index), ...state.travels.slice(action.index + 1) ]};
        case DELETE_ALL_TRAVEL:
          return {...state, travels: []};
        case CHANGE_TRAVELS_ARRAY:
          return {...state, travels: action.travels};

        // Sort
        case CHANGE_SORT:
          return {...state, sort: action.sort};
        default:
          return state;
    }
}
