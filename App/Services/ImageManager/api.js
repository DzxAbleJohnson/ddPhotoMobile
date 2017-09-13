import { fetchUploadApi } from 'FetchApi';

const endPoints = {
	uploadImage: 'api/upload/image'
};

export const uploadImage = ( query ) => fetchUploadApi(endPoints.uploadImage, query);
