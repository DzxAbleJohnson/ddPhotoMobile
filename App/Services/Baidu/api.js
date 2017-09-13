import { fetchBaiduApi } from 'FetchApi';

const endPoints = {
	placeSuggestion: '/place/v2/suggestion',
	geocoder: '/geocoder/v2/',
};

export const placeSuggestion = ( query ) => fetchBaiduApi(endPoints.placeSuggestion, { q: query, region: '全国', output: 'json', ret_coordtype: 'gcj02ll' }, 'get');
export const geocoderReverse = ( longitude, latitude ) => fetchBaiduApi(endPoints.geocoder, { location: latitude + ',' + longitude, pois: 0, output: 'json' }, 'get');