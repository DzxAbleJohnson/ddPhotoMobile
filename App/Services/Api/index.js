/**
 * @providesModule FetchApi
 */

/* global fetch */
import fetchival from 'fetchival';

import apiConfig from './config';

export const exceptionExtractError = (exception) => {
	if (!exception.Errors) return false;
	let error = false;
	const errorKeys = Object.keys(exception.Errors);
	if (errorKeys.length > 0) {
		error = exception.Errors[errorKeys[0]][0].message;
	}
	return error;
};

export const fetchApi = (endPoint, payload = {}, method = 'get', responseAs = 'json') => {
    var url = `${apiConfig.url}${endPoint}`;
	console.log(payload);
	console.log(url);
	return fetchival(url, { responseAs: responseAs })[method.toLowerCase()](payload);
};

/*
* query.uri
* query.fileName
* query.filePath
*/
export const fetchUploadApi = (endPoint, query) => {
    var url = `${apiConfig.url}${endPoint}`;
    const body = new FormData();
    body.append('file', {
        uri: query.uri,
        type: query.type,
        name: query.fileName,
    });
    return fetch(url, {
      method: 'POST',
      body
    }).catch((e) => {
        if (e.response && e.response.json) {
        	e.response.json().then((json) => {
        		if (json) throw json;
        		throw e;
        	});
        } else {
        	throw e;
        }
    });
};

export const fetchBaiduApi = (endPoint, payload = {}, method = 'get') => {
    payload["ak"] = apiConfig.baiduKey;
	return fetchival(`${apiConfig.baiduUrl}${endPoint}`)[method.toLowerCase()](payload)
	.catch((e) => {
    	if (e.response && e.response.json) {
    		e.response.json().then((json) => {
    			if (json) throw json;
    			throw e;
    		});
    	} else {
    		throw e;
    	}
    });
};

// 참조문서1: fetchival => https://github.com/typicode/fetchival