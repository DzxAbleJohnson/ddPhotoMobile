import { combineReducers } from 'redux';
import { navigationReducer as navigationReducer } from './Navigation/reducer';
import { mapEditorReducer as mapEditorReducer } from './MapEditor/reducer';
import { placeSuggestionReducer as placeSuggestion } from './PlaceSuggestion/reducer';
import { modalsReducer as modalsReducer } from './Modals/reducer';

export const reducer = combineReducers({
	navigation: navigationReducer,
	mapEditor: mapEditorReducer,
	placeSuggestion: placeSuggestion,
    modals: modalsReducer
});