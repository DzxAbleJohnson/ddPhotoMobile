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
    Alert,
    Platform
} from 'react-native';
import { Provider } from 'react-redux';

import { connect } from 'react-redux';
import { captureRef } from "react-native-view-shot";

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
* props.index
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
            if (Platform.OS == 'ios') {
                captureRef(this.refs["MAP_Section"], {format: "jpg", quality: 0.9}).then(
                    uri => { this.props.dispatch( setTimelineImageCapture( uri ) ); }
                );
            } else {
                this.refs['MAP_Section'].getWrappedInstance().takeSnapshot()
                    .then((response) => {
                        ModalsService.openCaptureModal( this.props.navigator, response.uri );
                    });
            }
        } else {
            ModalsService.openCaptureModal( this.props.navigator, this.props.travel.timelineImgUrl );
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
                    <Image style={styles.watermarkImg} source={{uri: "logo_large"}} />
                </View>
                { this.props.travelScreen == TRAVEL_SCREEN.TIMELINE
                    ? <TimelineView ref="TIMELINE_Section" travel={this.props.travel} navigator={this.props.navigator} />
                    : null
                }

                { this.props.wideScreen ? null : (
                    <TouchableHighlight
                        style={styles.back}
                        underlayColor= '#EEEEEE'
                        onPress={ this.close.bind( this ) } >
                        <Image style={styles.backImg} source={{uri: 'icon_back_large'}} />
                    </TouchableHighlight>
                )}
                { this.props.wideScreen ? null : (
                    <View style={styles.toolBoxContainer}>
                        <TouchableHighlight
                            style={styles.share}
                            underlayColor= '#EEEEEE'
                            onPress={ this.openShare.bind( this ) } >
                            <Image style={styles.shareImg} source={{uri: 'icon_share_black'}} />
                        </TouchableHighlight>
                        <View style={styles.toolBoxSeperator}></View>
                        <TouchableHighlight
                            style={styles.capture}
                            underlayColor= '#EEEEEE'
                            onPress={ this.openCapture.bind( this ) } >
                            <Image style={styles.captureImg} source={{uri: 'icon_capture_black'}} />
                        </TouchableHighlight>
                        <View style={styles.toolBoxSeperator}></View>
                        <View style={styles.slideMenu}>
                            <TouchableHighlight
                                underlayColor= '#EEEEEE'
                                style={[styles.slideMenu_Map, this.props.travelScreen == TRAVEL_SCREEN.MAP ? styles.slideMenu_selected : null]}
                                onPress={ this.openMap.bind( this ) } >
                                <Image style={styles.slideMenu_MapImg} source={{uri: this.props.travelScreen == TRAVEL_SCREEN.MAP ? 'icon_map_white' : 'icon_map_blue'}} />
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={[styles.slideMenu_Timeline, this.props.travelScreen == TRAVEL_SCREEN.TIMELINE ? styles.slideMenu_selected : null]}
                                underlayColor= '#EEEEEE'
                                onPress={ this.openTimeline.bind( this ) } >
                                <Image style={styles.slideMenu_TimelineImg} source={{uri: this.props.travelScreen == TRAVEL_SCREEN.TIMELINE ? 'icon_timeline_white' : 'icon_timeline_blue'}} />
                            </TouchableHighlight>
                        </View>
                    </View>
                )}
                { !this.props.wideScreen && this.props.travelScreen == TRAVEL_SCREEN.MAP
                    ? (
                        <TouchableHighlight
                            style={styles.goCenter}
                            underlayColor= '#EEEEEE'
                            onPress={ this.goCenter.bind( this ) } >
                            <Image style={styles.goCenterImg} source={{uri: 'icon_go_center_black'}} />
                        </TouchableHighlight>
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
    watermarkImg: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        width: 70,
        height: 30
    },
    //////
    back: {
        position: 'absolute',
        ...Platform.select({
            ios: {
                top: 30,
            },
            android: {
                top: 10,
            },
        }),
        left: 10,
        width: 35,
        height: 35,
        borderWidth: 1,
        borderColor: '#C4C4C4',
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        alignItems: "center"
    },
    backImg: {
        marginTop: 5,
        width: 24,
        height: 24
    },
    toolBoxContainer: {
        position: 'absolute',
        flexDirection: 'row',
        ...Platform.select({
            ios: {
                top: 30,
            },
            android: {
                top: 10,
            },
        }),
        right: 10,
        width: 140 + 4,
        height: 37,
        borderWidth: 1,
        borderColor: '#C4C4C4',
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    toolBoxSeperator: {
        marginTop: 12,
        width: 1,
        height: 10,
        borderWidth: 0.5,
        borderColor: '#C4C4C4',
    },
    share: {
        margin: 5,
        width: 25,
        height: 25,
        alignItems: "center"
    },
    shareImg: {
        width: 24,
        height: 24,
    },
    capture: {
        margin: 5,
        width: 25,
        height: 25,
        alignItems: "center"
    },
    captureImg: {
        width: 24,
        height: 24,
    },
    slideMenu: {
        flexDirection: 'row',
        margin: 5,
        width: 61,
        height: 25,
    },
    slideMenu_Map: {
        flex: 1,
        marginRight: 1,
        alignItems: "center"
    },
    slideMenu_MapImg: {
        width: 24,
        height: 24,
    },
    slideMenu_Timeline: {
        flex: 1,
        marginLeft: 1,
        alignItems: "center"
    },
    slideMenu_TimelineImg: {
        width: 24,
        height: 24,
    },
    slideMenu_selected: {
        backgroundColor: "#3A5FCF",
        borderRadius: 4
    },
    goCenter: {
        position: 'absolute',
        ...Platform.select({
            ios: {
                top: 72,
            },
            android: {
                top: 52,
            },
        }),
        right: 10,
        width: 35,
        height: 35,
        borderWidth: 1,
        borderColor: '#C4C4C4',
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        alignItems: "center"
    },
    goCenterImg: {
        marginTop: 4,
        width: 24,
        height: 24,
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

