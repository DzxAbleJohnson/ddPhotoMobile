/**
 * @providesModule Store
 */
// combineReducers: reducers를 합쳐주는 역할. 이미 combineReducers를 적용한 값에 중복 적용이 가능하다
// compose(구성하다) : applyMiddleware과 redux-devtools 패키지 등을 묶어주는 역할
// redux-thunk:

import { AsyncStorage } from 'react-native';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';
import { persistStore, createTransform, autoRehydrate } from 'redux-persist'

import { reducer as dataReducer } from './Data/reducer';
import { reducer as servicesReducer } from './Services/reducer';


const appReducer = combineReducers({
	data: dataReducer,
	services: servicesReducer
});

const enhancer = composeWithDevTools({
        realtime: true,
        port: 8081
    })(
        applyMiddleware( thunk ),
        autoRehydrate()
    );

const store = createStore(
	appReducer,
	enhancer
);
persistStore( store, {blacklist: ['services'], storage: AsyncStorage}, ()=>{
    // persist Doneß
});

export default store ;

// 참조문서1: 프레임워크 => https://github.com/alexmngn/react-native-authentication
// 참조문서2: thunk => https://github.com/gaearon/redux-thunk
// 참조문서2: devtools => https://github.com/zalmoxisus/remote-redux-devtools