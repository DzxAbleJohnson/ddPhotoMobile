import {
  NativeModules,
  Platform,
  DeviceEventEmitter
} from 'react-native';

import React, {
  Component,
  PropTypes
} from 'react';

const ImageResizerAndroid = NativeModules.ImageResizerAndroid;


export default {
    createResizedImage: (imageUri, newWidth, newHeight, compressFormat, quality, rotation = 0, outputPath) => {
        return new Promise((resolve, reject) => {
            ImageResizerAndroid.createResizedImage(imageUri, newWidth, newHeight,
                compressFormat, quality, rotation, outputPath, resolve, reject);
        });
    },

    createMarkerImage: (imageUri, compressFormat, index, color, shape, width, outputPath) => {
        return new Promise((resolve, reject) => {
            ImageResizerAndroid.createMarkerImage(imageUri, width,
                compressFormat, 90/*quality*/, shape, color, index, outputPath, resolve, reject);
        });
    },
};

