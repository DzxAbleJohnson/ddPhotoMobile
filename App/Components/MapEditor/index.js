/**
 * @providesModule MapEditor2
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
  TouchableHighlight,
  Image,
    Platform,
    Alert,
    BackHandler
} from 'react-native';
import { Provider } from 'react-redux';
import { captureRef } from "react-native-view-shot";
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';
// Action
import { updateCenter, setMapImageCapture, setTimelineImageCapture } from 'ActionMapEditor2';
import { changeTab, changeEditTitleTab, wideScreen, setNavigator, TABS, TAB_TITLES, SCREENS } from 'ActionNavigation';
import { isPhotoModalOn, setPhotoIndex } from 'ActionModals';

// Services
import * as MapEditorService from 'MapEditorService';
import * as ModalsService from 'ModalsService';

// Components
import CaptureTimelineView from 'CaptureTimelineView';
import TabBar from 'TabBar';
import CreateToolBar from './ToolBar/Create';
import EditToolBar from './ToolBar/Edit';
import PhotoStyleToolBar from './ToolBar/Edit/PhotoStyle';
import MapStyleToolBar from './ToolBar/Edit/MapStyle';
import RouteStyleToolBar from './ToolBar/Edit/RouteStyle';
import TitleStyleToolBar from './ToolBar/Edit/TitleStyle';
import EditModeNavigation from './ToolBar/Edit/EditModeNavigation';
import TitleBox from 'TitleBox2';
import Storage from 'Storage2';
import PhotoModal from 'PhotoModal';
import BaiduMapView from 'BaiduMapView2';

// i18n
import I18n from 'I18n'

/*
* props.navigator
*/
class MapEditor extends Component {
    static navigatorStyle = {
        navBarHidden: true
    };
    constructor(props) {
        super(props);
        this.props.dispatch( setNavigator( this.props.navigator ) );
        BackHandler.addEventListener('hardwareBackPress', () => {
            Alert.alert(
                I18n.t('CloseApp'),
                I18n.t('DoYouWantToCloseApp'),
                [
                    {text: I18n.t('No'), onPress: () => {}},
                    {text: I18n.t('Yes'), onPress: () => {BackHandler.exitApp();}}
                ]
            );
            return true;
        });
    }
    componentWillMount() {
        this.props.dispatch( isPhotoModalOn( false ) );
        this.props.dispatch( setPhotoIndex( 0 ) );
        this.props.dispatch( updateCenter( MapEditorService.getPosition( this.props.travel.photos ) ) );
    }

    captureScreen = () => {
        /*this.refs['MAP_Capture'].getWrappedInstance().takeSnapshot()
            .then(
                uri => ModalsService.openCaptureModal( this.props.navigator, uri )
            )*/
        captureRef(this.refs["TIMELINE_Capture"], {format: "jpg", quality: 0.8}).then(
            uri => {
                console.log("===== :::: URI ::: " + uri);
                ModalsService.openCaptureModal( this.props.navigator, uri );
            }
        );
    };

    // 저장하기 팝업
    saveTravel = () => {
        if (this.props.travel.photos.length == 0){
            ModalsService.openAlertModal( this.props.navigator, I18n.t('NoPhotosOrGps'));
            return;
        }
        this.props.dispatch( updateCenter( MapEditorService.getPosition( this.props.travel.photos ) ) );
        // 스냅샷 찍기
        captureRef(this.refs["TIMELINE_Capture"], {format: "png", quality: 0.8}).then(
            uri => { this.props.dispatch( setTimelineImageCapture( uri ) ); }
        );
        this.refs['MAP_Capture'].getWrappedInstance().takeSnapshot()
            .then(
                uri => this.props.dispatch( setMapImageCapture( uri ) )
            );
        setTimeout(() => {
            this.refs['MAP_Capture'].getWrappedInstance().takeSnapshot()
                .then(
                    uri => this.props.dispatch( setMapImageCapture( uri ) )
                );
        }, 1000); // 시간으로 하는게 적절한가? 혹시모르니 중복으로 해둠
        setTimeout(() => {
            this.refs['MAP_Capture'].getWrappedInstance().takeSnapshot()
                .then(
                    uri => this.props.dispatch( setMapImageCapture( uri ) )
                );
        }, 2000); // 시간으로 하는게 적절한가? 혹시모르니 중복으로 해둠
        setTimeout(() => {
            this.refs['MAP_Capture'].getWrappedInstance().takeSnapshot()
                .then(
                    uri => this.props.dispatch( setMapImageCapture( uri ) )
                );
        }, 3000); // 시간으로 하는게 적절한가? 혹시모르니 중복으로 해둠
        ModalsService.openSaveMetaModal( this.props.navigator );
    };
    goCenter = () => {
        this.props.dispatch( updateCenter( MapEditorService.getPosition( this.props.travel.photos ) ) );
    };
    render() {
        var toolBar = () => {
            switch (this.props.tab) {
                case TABS.CREATE:
                    return <CreateToolBar navigator={this.props.navigator} />;
                case TABS.EDIT:
                    return <EditToolBar navigator={this.props.navigator} />;
                case TABS.EDIT_MAP_STYLE:
                    return <MapStyleToolBar navigator={this.props.navigator} />;
                case TABS.EDIT_PHOTO_STYLE:
                    return <PhotoStyleToolBar navigator={this.props.navigator} />;
                case TABS.EDIT_ROUTE_STYLE:
                    return <RouteStyleToolBar navigator={this.props.navigator} />;
                case TABS.EDIT_TITLE_STYLE:
                    return <TitleStyleToolBar navigator={this.props.navigator} />;
                default:
                    return null;
            }
        };
        var tabBar = () => {
            switch (this.props.tab) {
                case TABS.CREATE:
                    return <TabBar navigator={this.props.navigator} />;
                case TABS.EDIT:
                    return <TabBar navigator={this.props.navigator} />;
                case TABS.STORAGE:
                    return <TabBar navigator={this.props.navigator} />;
                case TABS.EDIT_MAP_STYLE:
                    return <EditModeNavigation navigator={this.props.navigator} />;
                case TABS.EDIT_PHOTO_STYLE:
                    return <EditModeNavigation navigator={this.props.navigator} />;
                case TABS.EDIT_ROUTE_STYLE:
                    return <EditModeNavigation navigator={this.props.navigator} />;
                case TABS.EDIT_TITLE_STYLE:
                    return null;
                default:
                    return <TabBar navigator={this.props.navigator} />;
            }
        };
        var baiduMap = () => {
            if (this.props.currentScreen == SCREENS.MAP_EDITOR){
                return (
                    <BaiduMapView
                        ref={"MAP_Capture"}
                        navigator={this.props.navigator}
                        photos={this.props.travel.photos}
                        photosWithNoGPS={this.props.travel.photosWithNoGPS}
                        center={this.props.travel.center}
                        locationText={this.props.travel.locationText || null}
                        mapStyle={this.props.travel.mapStyle}
                        routeColor={this.props.travel.routeColor}
                        routeWidth={this.props.travel.routeWidth} />
                )
            } else {
                return null;
            }

        }
        return (
            <View style={styles.container}>
                <View style={styles.captureSection}>
                    { baiduMap( ) }
                    <Image style={styles.watermarkImg} source={{uri: "logo_large"}} />
                    { (this.props.travel.titleText != null && this.props.travel.titleText != "") || this.props.tab == TABS.EDIT_TITLE_STYLE
                        ? <TitleBox />
                        : null
                    }
                </View>
                { this.props.wideScreen ? null : (
                    <View style={styles.toolBoxContainer}>
                        <TouchableHighlight
                            style={styles.captureIcon}
                            underlayColor= '#EEEEEE'
                            onPress={ this.captureScreen.bind( this ) } >
                            <Image style={styles.captureIcon_Img} source={{uri: 'icon_capture_black'}} />
                        </TouchableHighlight>
                        <View style={styles.toolBoxSeperator}></View>
                        <TouchableHighlight
                            style={styles.saveIcon}
                            underlayColor= '#EEEEEE'
                            onPress={ this.saveTravel.bind( this ) } >
                            <Text style={styles.saveIcon_Text}>{I18n.t('Save')}</Text>
                        </TouchableHighlight>
                    </View>
                )}
                { this.props.wideScreen || this.props.travel.photos.length == 0  ? null : (
                    <TouchableHighlight
                        style={styles.goCenterIcon}
                        underlayColor= '#EEEEEE'
                        onPress={ this.goCenter.bind( this ) } >
                        <Image style={styles.goCenterIcon_Img} source={{uri: 'icon_go_center_black'}} />
                    </TouchableHighlight>
                )}
                { this.props.wideScreen ? null : toolBar( ) }
                { this.props.wideScreen ? null : tabBar( ) }
                { this.props.isPhotoModalOn && this.props.travel.photos.length > this.props.photoIndex ? <PhotoModal navigator={this.props.navigator} photosWithNoGPSLength={this.props.travel.photosWithNoGPS.length} /> : null }

                { this.props.travel.photos.length > 0
                    ? <CaptureTimelineView ref="TIMELINE_Capture" collapsable={false} navigator={this.props.navigator} travel={this.props.travel} />
                    : null
                }

                { this.props.tab == TABS.STORAGE
                    ? <View style={styles.storageView}><Storage navigator={this.props.navigator} /></View>
                    : null }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1
    },
    captureSection: {
        position: 'relative',
        flexDirection: 'column',
        flex: 1,
    },
    watermarkImg: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        width: 70,
        height: 30
    },
    toolBoxContainer: {
        position: 'absolute',
        flexDirection: 'row',
        ...Platform.select({
            ios: {
                top: 20,
            },
            android: {
                top: 10,
            },
        }),
        right: 10,
        width: 105 + 2,
        height: 35,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        //zIndex: 1
    },
    toolBoxSeperator: {
        marginTop: 12,
        width: 1,
        height: 10,
        borderWidth: 0.5,
        borderColor: '#DDDDDD',
    },
    captureIcon: {
        margin: 5,
        width: 25,
        height: 25,
        alignItems: "center",
    },
    captureIcon_Img: {
        width: 24,
        height: 24,
    },
    saveIcon: {
        margin: 4,
        width: 62,
        height: 25,
        borderRadius: 4,
        backgroundColor: '#3a5fcf',
        justifyContent: 'center',
        alignItems: 'center'
    },
    saveIcon_Text: {
        fontSize: 14,
        color: "#FFFFFF",
        textAlign: 'center'
    },

    goCenterIcon: {
        position: 'absolute',
        ...Platform.select({
            ios: {
                top: 60,
            },
            android: {
                top: 50,
            },
        }),
        right: 10,
        width: 35,
        height: 35,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        alignItems: "center",
        //zIndex: 1
    },
    goCenterIcon_Img: {
        marginTop: 4,
        width: 24,
        height: 24,
    },
    storageView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 45,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        //zIndex: 5
    }
})
export default connect((state) => {
    return {
        tab: state.services.navigation.tab,
        currentScreen: state.services.navigation.currentScreen,
        wideScreen: state.services.navigation.wideScreen,

        travel: state.services.mapEditor,

        isPhotoModalOn: state.services.modals.isPhotoModalOn,
        photoIndex: state.services.modals.photoIndex,
    };
})(MapEditor);


