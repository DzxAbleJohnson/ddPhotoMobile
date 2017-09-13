import { fetchApi } from 'FetchApi';

const endPoints = {
    createTravel: 'api/travel/create',
    updateTravel: 'api/travel/update',
    deleteTravel: 'api/travel/delete',
    findMyTravels: 'api/travel/find/my',
    findTravel: 'api/travel/find/id/',
};

export const createTravel = ( query ) => fetchApi(endPoints.createTravel, query, 'post');
export const deleteTravel = ( query ) => fetchApi(endPoints.deleteTravel, query, 'post', 'text');
export const updateTravel = ( query ) => fetchApi(endPoints.updateTravel, query, 'post', 'text');
export const findMyTravels = ( ) => fetchApi(endPoints.findMyTravels, {}, 'get');
export const findTravel = ( query ) => fetchApi(endPoints.findTravel + query.uId, {}, 'get');
