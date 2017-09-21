/**
 * @providesModule ShareUmengUtil
 */
import {
    Platform
} from 'react-native';

import { NativeModules } from 'react-native';
import UmengShare from 'react-native-umengshare';
const umengClient = NativeModules.UmengShare;

/*
* @params  {string} title
* @params  {string} description
* @params  {string} thumbnail
* @params  {string} image
*/
export const share = ( title, description, thumbnail, url ) => {
    console.log("Start Share!!");
    if (Platform.OS === 'ios') {
        umengClient.share({
            title: title,
            description: description,
            thumbnail: thumbnail,
            url: url,
        }, () => {

        });
    } else if (Platform.OS === 'android') {
        console.log(UmengShare);
        UmengShare.shareTravel(title, description, thumbnail, url);
    }
}
