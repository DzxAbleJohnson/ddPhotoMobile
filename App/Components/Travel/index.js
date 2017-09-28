/**
 * @providesModule TravelView
 */
import React, {
  Component,
  PropTypes
} from 'react';

import {
  Text,
  View,
  StyleSheet,
  Button,
  Image,
  TouchableHighlight,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import { Provider } from 'react-redux';

import { connect } from 'react-redux';
import { captureRef } from "react-native-view-shot";
import Dimensions from 'Dimensions';

// Actions
import { changeTab, wideScreen, changeTravelScreen, setScreen, TRAVEL_SCREEN, TABS, SCREENS } from 'ActionNavigation';
import { updateTravel } from 'ActionTravels';

// Components
import TitleBoxFixed from 'TitleBoxFixed';
import BaiduMapView from 'BaiduMapView2';
import TimelineView from './Timeline';
import PhotoModal from 'PhotoModal';

// Services
import * as ModalsService from 'ModalsService';
import * as TravelsService from 'TravelsService';
import * as MapEditorService from 'MapEditorService';

// i18n
import I18n from 'I18n'

/*
* props.navigator
* props.travel
*/
class MapEditor extends Component {
    static navigatorStyle = {
        navBarHidden: true
    };
    constructor(props) {
        super(props);
        this.state = {
            center : JSON.parse(JSON.stringify(this.props.travel.center))
        }
        this.props.dispatch( wideScreen( false ) );
        this.props.dispatch( changeTravelScreen( TRAVEL_SCREEN.MAP ) );
    }
    componentWillUnmount = () => {
        // 화면을 좌우 스크롤해서 뒤로갈때 문제때문에 넣어 둠
        this.props.dispatch( changeTab( TABS.STORAGE ) );
        this.props.dispatch( setScreen( SCREENS.MAP_EDITOR ) );
        this.props.dispatch( wideScreen( false ) );
    }
    close = () => {
        this.props.dispatch( changeTab( TABS.STORAGE ) );
        this.props.dispatch( setScreen( SCREENS.MAP_EDITOR ) );
        this.props.navigator.popToRoot({
            animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
            animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
        });
    }
    openShare = () => {
        if (this.props.uId) {
            TravelsService.share( this.props.travel );
        } else {
            Alert.alert(
                I18n.t('Signup'),
                I18n.t('PleaseSignUp'),
                [
                    {text: I18n.t('Cancel'), onPress: () => {}},
                    {text: I18n.t('Signup'), onPress: () => {
                        this.props.globalNavigator.push({
                            screen: 'app.Login', // unique ID registered with Navigation.registerScreen
                            animated: true, // does the push have transition animation or does it happen immediately (optional)
                            animationType: 'fade' // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                        });
                    }}
                ]
            )
        }
    }
    openCapture = () => {
        if ( this.props.travelScreen == TRAVEL_SCREEN.MAP ){
            this.refs['MAP_Section'].getWrappedInstance().takeSnapshot()
                .then(
                    uri => ModalsService.openCaptureModal( this.props.navigator, uri )
                )
        } else {
            this.refs['TIMELINE_Section'].getWrappedInstance().takeSnapshot()
                .then(
                    uri => ModalsService.openCaptureModal( this.props.navigator, uri )
                )
        }
    };
    openMap = () => {
        this.props.dispatch( changeTravelScreen( TRAVEL_SCREEN.MAP ) );
    };
    openTimeline = () => {
        this.props.dispatch( changeTravelScreen( TRAVEL_SCREEN.TIMELINE ) );
    };
    goCenter = () => {
        this.setState({
            center: MapEditorService.getPosition( this.props.travel.photos )
        })
    };
    render() {
        var icons = () => {
            return
        }
        return (
            <View style={styles.container}>
                <View style={styles.captureSection_Map}>
                    <BaiduMapView
                        ref="MAP_Section"
                        photos={this.props.travel.photos}
                        center={this.state.center}
                        mapStyle={this.props.travel.mapStyle}
                        routeColor={this.props.travel.routeColor}
                        routeWidth={this.props.travel.routeWidth}
                        locationText={this.props.travel.locationText || null}
                        navigator={this.props.navigator} />
                    { this.props.travel.titleText != null && this.props.travel.titleText != "" && this.props.travelScreen == TRAVEL_SCREEN.MAP && !this.props.wideScreen
                        ? (<TitleBoxFixed
                            navigator={this.props.navigator}
                            travel={this.props.travel} />)
                        : null
                    }
                </View>
                { this.props.travelScreen == TRAVEL_SCREEN.TIMELINE
                    ? <TimelineView ref="TIMELINE_Section" travel={this.props.travel} navigator={this.props.navigator} />
                    : null
                }

                { this.props.wideScreen ? null : (
                    <View style={styles.travelHeader}>
                        <TouchableOpacity style={styles.back} onPress={ this.close.bind( this ) } >
                            <Image style={styles.backImg} source={{uri: 'icon_travel_back'}} />
                        </TouchableOpacity>
                        <View style={styles.tab}>
                            <TouchableOpacity style={styles.tabMap} onPress={ this.openMap.bind(this) }>
                                <Image style={styles.tabMapBg} source={{uri: (this.props.travelScreen == TRAVEL_SCREEN.MAP ? 'icon_travel_tab_left_active' : 'icon_travel_tab_left')}} />
                                <Text style={[styles.tabMapText, {color: (this.props.travelScreen == TRAVEL_SCREEN.MAP ? '#FFFFFF' : '#4467D1')}]}>{I18n.t('Map')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.tabTimeline} onPress={ this.openTimeline.bind(this) } >
                                <Image style={styles.tabTimelineBg} source={{uri: (this.props.travelScreen == TRAVEL_SCREEN.MAP ? 'icon_travel_tab_right' : 'icon_travel_tab_right_active')}} />
                                <Text style={[styles.tabTimelineText, {color: (this.props.travelScreen == TRAVEL_SCREEN.MAP ? '#4467D1' : '#FFFFFF')}]}>{I18n.t('Timeline')}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.share} onPress={ this.openShare.bind(this) } >
                            <Image style={styles.shareImg} source={{uri: 'icon_share_blue'}} />
                        </TouchableOpacity>
                    </View>
                )}
                { !this.props.wideScreen && this.props.travelScreen == TRAVEL_SCREEN.MAP
                    ? (
                        <TouchableOpacity
                            style={styles.goCenter}
                            onPress={ this.goCenter.bind( this ) } >
                            <Image style={styles.goCenterImg}  source={{uri: 'icon_go_center_blue'}} />
                        </TouchableOpacity>
                    )
                    : null}
                { !this.props.wideScreen
                    ? (
                        <TouchableOpacity
                            style={styles.capture}
                            underlayColor= '#EEEEEE'
                            onPress={ this.openCapture.bind( this ) } >
                            <Image style={styles.captureImg} source={{uri: 'icon_capture_blue'}} />
                        </TouchableOpacity>
                    )
                    : null}
                { this.props.isPhotoModalOn && this.props.travelScreen == TRAVEL_SCREEN.MAP &&this.props.travel.photos.length > this.props.photoIndex ? <PhotoModal navigator={this.props.navigator} /> : null }
            </View>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    captureSection_Map: {
        flex: 1
    },
    //////
    travelHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                paddingTop: 20,
                height: 60,
            },
            android: {
                height: 40,
            },
        }),
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    back: {
        position: 'absolute',
        ...Platform.select({
            ios: {
                top: 20,
            },
        }),
        paddingLeft: 15,
        paddingRight: 15,
        left: 0,
        width: 50,
        height: 35,
    },
    backImg: {
        marginTop: 8,
        width: 10,
        height: 21
    },
    share: {
        position: 'absolute',
        ...Platform.select({
            ios: {
                top: 20,
            },
        }),
        paddingLeft: 15,
        paddingRight: 15,
        right: 0,
        width: 50,
        height: 35,
    },
    shareImg: {
        marginTop: 8,
        width: 19,
        height: 21,
    },
    tab: {
        flexDirection: 'row',
        position: 'absolute',
        ...Platform.select({
            ios: {
                top: 20,
            },
        }),
        left: (Dimensions.get('window').width / 2) - 60,
        width: 120,
        height: 35,
    },
    tabMap: {
        marginTop: 7,
        width: 60,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabMapBg: {
        position: 'absolute',
        width: 60,
        height: 25,
    },
    tabMapText: {
        fontSize: 12,
        textAlign: 'center',
    },
    tabTimeline: {
        marginTop: 7,
        width: 60,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabTimelineBg: {
        position: 'absolute',
        width: 60,
        height: 25,
    },
    tabTimelineText: {
        fontSize: 12,
        textAlign: 'center',
    },
    //////
    goCenter: {
        position: 'absolute',
        top: (Dimensions.get('window').height / 2) + 20,
        right: 10,
        width: 35,
        height: 35,
    },
    goCenterImg: {
        width: 35,
        height: 35,
    },
    capture: {
        position: 'absolute',
        top: (Dimensions.get('window').height / 2) + 75,
        right: 10,
        width: 35,
        height: 35,
    },
    captureImg: {
        width: 35,
        height: 35,
    },
})
export default connect((state) => {
  return {
    wideScreen: state.services.navigation.wideScreen,
    travelScreen: state.services.navigation.travelScreen,

    isPhotoModalOn: state.services.modals.isPhotoModalOn,
    photoIndex: state.services.modals.photoIndex,


      uId: state.data.auth.id,
      globalNavigator: state.services.navigation.navigator,
  };
})(MapEditor);

