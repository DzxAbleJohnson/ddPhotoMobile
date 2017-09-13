import { combineReducers } from 'redux';
import { travelsReducer } from './Travels/reducer';
import { authReducer } from './Authentification/reducer';

export const reducer = combineReducers({
	travels: travelsReducer,
    auth: authReducer
});