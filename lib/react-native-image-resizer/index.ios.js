import {
  NativeModules,
  Platform,
  DeviceEventEmitter
} from 'react-native';

import React, {
  Component,
  PropTypes
} from 'react';

const ImageResizer = NativeModules.ImageResizer;

export default {
  createResizedImage: (path, width, height, format, quality, rotation = 0, outputPath) => {
    if (format !== 'JPEG' && format !== 'PNG') {
      throw new Error('Only JPEG and PNG format are supported by createResizedImage');
    }

    return new Promise((resolve, reject) => {
      ImageResizer.createResizedImage(path, width, height, format, quality, rotation, outputPath, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  },
    createMarkerImage: (path, format, index, lineColor, shape, lineWidth, outputPath) => {
        if (format !== 'JPEG' && format !== 'PNG' && format !== 'JPG') {
            throw new Error('Only JPEG and PNG and JPG format are supported by createMarkerImage');
        }

        return new Promise((resolve, reject) => {
            ImageResizer.createMarkerImage(path, format, index, lineColor, shape, lineWidth, outputPath, (err, response) => {
                if (err) {
                    return reject(err);
                }
                resolve(response);
            });
        });
    },
};
