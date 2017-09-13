/**
 * @providesModule ImageManager
 */
import ImageResizer from 'react-native-image-resizer';

import * as api from './api';


export const resize = ( photo, width, height ) => {
    // path, maxWidth, maxHeightm compressFormat, quality, roation, outputPath
    console.log(photo);
    return ImageResizer.createResizedImage(photo.uri, width, height, "JPEG", 90, 0, null);
}
export const createMarker = ( photo, color, shape, width, index ) => {
    // path, compressFormat, index, color, shape, width, outputPath
    return ImageResizer.createMarkerImage(photo["uri@800"], "PNG", index, color, shape, width, null);
}

export const uploadPhoto2Server = ( uri, compressFormat, fileName ) => {
    return new Promise(function(resolve, reject){
        api.uploadImage({
            uri: uri,
            type: compressFormat,
            fileName: fileName,
        }).then((response)=>{
            resolve(response._bodyText);
        }).catch((err)=>{
            console.log("ImageManager :: uploadPhoto2Server :: Error!");
            console.log(err);
            reject(err);
        });
    });
}
// 참조문서1: react-native-image-resizer => https://github.com/bamlab/react-native-image-resizer