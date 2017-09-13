/**
 * @providesModule react-native-baidu-map
 */

import {
  requireNativeComponent,
  View,
  NativeModules,
  Platform,
  DeviceEventEmitter
} from 'react-native';

import React, {
  Component,
  PropTypes
} from 'react';

import _MapTypes from './js/MapTypes';
import _MapView from './js/MapView';
import _MapViewFunc from './js/MapViewFunc';
import _MapModule from './js/MapModule';
import _Geolocation from './js/Geolocation';
import _GetDistance from './js/GetDistance';

export const MapTypes = _MapTypes;
export const MapView = _MapView;
export const MapViewFunc = _MapViewFunc;
export const MapModule = _MapModule;
export const Geolocation = _Geolocation;
export const GetDistance = _GetDistance;
