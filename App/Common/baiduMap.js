/**
 * @providesModule BaiduMapView2
 */

import React, {
  Component,
} from 'react';

import {
  View,
  Text,
  WebView,
    Image,
  StyleSheet,
    Platform
} from 'react-native';


import { connect } from 'react-redux';
import { MapView } from 'react-native-baidu-map'
import { captureRef } from "react-native-view-shot";

// Actions
import { updateCenter } from 'ActionMapEditor2';
import { TABS, wideScreen } from 'ActionNavigation';
import { isPhotoModalOn, setPhotoIndex, setPhotos } from 'ActionModals';

// Services
import * as ModalsService from 'ModalsService';
import * as MapEditorService from 'MapEditorService';
import * as TravelsService from 'TravelsService';
/*
* @props {Array} photos
* @props {Array} photosWithNoGPS
* @props {Object} center
* @props {String} locationText
* @props {String} mapStyle
* @props {String} routeColor
* @props {Number} routeWidth
*/
class BaiduMapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            takeSnapshot: {run: false},
            onTakeSnapshot: () => {}
        }
    }
    clickMarker = ( marker ) => {
        if (this.props.tab == TABS.CREATE && this.props.wideScreen == false){
            let photosLength = this.props.photosWithNoGPS.length + marker.index - 1;
            let x = 0;
            if ( photosLength > 0) {
                x = photosLength * 77 ;
            }
            this.props.scrollRef.scrollTo({x: x, animated: true});
        }

        this.props.dispatch( setPhotos( this.props.photos ) );
        this.props.dispatch( setPhotoIndex( marker.index ) );
        var center = TravelsService.getCenter4PhotoModal( this.props.photos[ marker.index ] );
        this.props.dispatch( updateCenter( center ) );
        this.props.dispatch( isPhotoModalOn( true ) );
    };
    clickMap = () => {
        this.props.dispatch( wideScreen( !this.props.wideScreen ) );
    };
    takeSnapshot () {
        if (Platform.OS == 'ios') {
            return captureRef(this.refs["MAP"], {format: "jpg", quality: 0.8});
        } else {
            return new Promise((resolve, reject) => {
                this.setState({
                    takeSnapshot: {run: true},
                    onTakeSnapshot: (response) => {
                        this.setState({
                            takeSnapshot: {run: false},
                        });
                        resolve(response.uri);
                    }
                });
            });
        }
    };
    render() {
        return (
            <View style={styles.container} ref={"MAP"}>
                <MapView
                    style={styles.container}
                    trafficEnabled={false}
                    baiduHeatMapEnabled={false}
                    zoomControlsVisible={false}
                    center={{
                        longitude: this.props.center.longitude,
                        latitude: this.props.center.latitude,
                        zoom: this.props.center.zoom,
                        mapStyle: this.props.mapStyle,
                        locationText: this.props.locationText
                    }}
                    mapStyle={this.props.mapStyle}
                    markers={this.props.photos}
                    takeSnapshot={this.state.takeSnapshot}
                    polylines={this.props.photos}
                    polylineConfig={{
                        color: this.props.routeColor,
                        width: this.props.routeWidth
                    }}
                    onMarkerClick={ this.clickMarker }
                    onMapClick={ this.clickMap }
                    onMapPoiClick={ this.clickMap }
                    onTakeSnapshot={ this.state.onTakeSnapshot }
                />
                <Image style={styles.watermarkImg} source={{uri: "logo_large"}} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    watermarkImg: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        width: 70,
        height: 30
    },
});

export default connect((state) => {
    return {
        wideScreen: state.services.navigation.wideScreen,

        tab: state.services.navigation.tab,
        scrollRef: state.services.navigation.scrollRef,
    };
}, null, null, { withRef: true })(BaiduMapView);

