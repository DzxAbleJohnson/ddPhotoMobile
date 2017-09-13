/**
 * @providesModule ShareUmengUtil
 */

import {
    Platform
} from 'react-native';

import { NativeModules } from 'react-native';
const umengClient = NativeModules.UmengShare;

/*
* @params  {string} title
* @params  {string} description
* @params  {string} thumbnail
* @params  {string} image
*/
export const share = ( title, description, thumbnail, url, platform ) => {
    console.log("Start Share!!");
    if (Platform.OS === 'ios') {
        umengClient.share({
            title: title,
            description: description,
            thumbnail: thumbnail,
            url: url,
            platform: platform
        }, () => {
        });
    } else if (Platform.OS === 'android') {

    }
}