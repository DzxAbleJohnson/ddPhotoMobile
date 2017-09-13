;import {
  requireNativeComponent,
  View,
  NativeModules,
  DeviceEventEmitter
} from 'react-native';

import React, {
  Component,
  PropTypes
} from 'react';
import MapTypes from './MapTypes';

export default class MapView extends Component {
    static propTypes = {
        ...View.propTypes,
        zoomControlsVisible: PropTypes.bool,
        trafficEnabled: PropTypes.bool,
        baiduHeatMapEnabled: PropTypes.bool,
        mapType: PropTypes.number,
        mapStyle: PropTypes.string,
        center: PropTypes.object,
        marker: PropTypes.object,
        markers: PropTypes.array,
        polylines: PropTypes.array,
        polylineConfig: PropTypes.object,
        childrenPoints: PropTypes.array,
        takeSnapshot: PropTypes.object,
        onMapStatusChangeStart: PropTypes.func,
        onMapStatusChange: PropTypes.func,
        onMapStatusChangeFinish: PropTypes.func,
        onMapLoaded: PropTypes.func,
        onMapClick: PropTypes.func,
        onMapDoubleClick: PropTypes.func,
        onMarkerClick: PropTypes.func,
        onMapPoiClick: PropTypes.func,
        onTakeSnapshot: PropTypes.func,
    };

    static defaultProps = {
        zoomControlsVisible: true,
        trafficEnabled: false,
        baiduHeatMapEnabled: false,
        mapType: MapTypes.NORMAL,
        childrenPoints: [],
        mapStyle: "normal",
        marker: null,
        markers: [],
        polylines: [],
        polylineConfig: null,
        center: null
    };
    constructor() {
        super();
    }

    _onChange(event) {
        if (typeof this.props[event.nativeEvent.type] === 'function') {
            this.props[event.nativeEvent.type](event.nativeEvent.params);
        }
    }

    render() {
        return <BaiduMapView {...this.props} onChange={this._onChange.bind(this)} ref={this.onRef}/>;
    }
    onRef = (ref: View) => {
        this.root = ref;
    };
}

const BaiduMapView = requireNativeComponent('RCTBaiduMapView', MapView, {
    nativeOnly: {onChange: true}
});

