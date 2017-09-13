'use strict';
import React, {
    Component,
    PropTypes
} from 'react';

import {
    View,
    StyleSheet,
    Button,
    Text,
    Image,
    ScrollView,
    TouchableHighlight,
    Alert,
    Platform
} from 'react-native';

import Dimensions from 'Dimensions';

import { connect } from 'react-redux';
import * as MultipleImagePicker from 'react-native-multiple-image-picker';

// Actions
import { setScrollRef } from 'ActionNavigation'
import { addPhoto, deletePhoto, deleteAllPhoto, changePhotosArray, addPhotoWithNoGPS, deleteAllPhotoWithNoGPS, deletePhotoWithNoGPS, changePhotosWithNoGPSArray, updateCenter, setMapImageCapture, setTimelineImageCapture } from 'ActionMapEditor2';
import { isPhotoModalOn, setPhotoIndex, setPhotos } from 'ActionModals';

// Services
import * as ImageManager from 'ImageManager';
import * as MapEditorService from 'MapEditorService';
import * as ModalsService from 'ModalsService';
import * as TravelsService from 'TravelsService';
import * as DateUtil from 'DateUtilService';

// Styles
import { styles } from './styles.android';

// Components
import PhotoViewWithoutGps from './photoViewWithoutGps';
import PhotoView from './photoView';
import PhotoEdit from './photoEdit';

// i18n
import I18n from 'I18n'

/**
 * props.navigator
 * props.mapCaptureRef
 * props.timelineCaptureRef
 **/
class CreateToolBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPickerOpen: false,
            deleteMode: false,
            deleteIndex: [],
            deleteIndexNoGps: [],
        };
        Array.prototype.remove = function() {
            var what, a = arguments, L = a.length, ax;
            while (L && this.length) {
                what = a[--L];
                while ((ax = this.indexOf(what)) !== -1) {
                    this.splice(ax, 1);
                }
            }
            return this;
        };
    };
    componentDidMount = () => {
        this.props.dispatch( setScrollRef(this.refs["scrollPhotos"]) );
    };
    // 새로운 사진을 추가함
    openImagePicker = () => {
        if (this.state.isPickerOpen && Platform.OS == 'ios')
            return;
        this.setState({ isPickerOpen: true});
        MultipleImagePicker.launchImageGallery({
            maxImagesCount: 50,      // Max number of images user can select; if maxImagesCount == 1, Single mode (i.e. Tap to Select & Finish) will be activated.
            selectedPaths: []        // Currently selected paths, must be from result of previous calls. Empty array allowed.
        }).then((newSelectedPaths) => {
            this.setState({ isPickerOpen: false});
            var photos = [];
            var promises = [];
            newSelectedPaths.forEach( (data, i) => {
                promises.push(new Promise((resolve, reject)=>{
                    var photo = {
                        fileName: newSelectedPaths[i].fileName,
                        uri: newSelectedPaths[i].uri,
                        longitude: newSelectedPaths[i].longitude,
                        latitude: newSelectedPaths[i].latitude,
                        locationText: null,
                        date: newSelectedPaths[i].timestamp
                    };
                    ImageManager.resize( photo, 800, 800 ).then((response) => {
                        photo["uri@800"] = response.uri;
                        if (!photo.longitude || !photo.latitude){
                            this.props.dispatch( addPhotoWithNoGPS( photo ) );
                        }else{
                            photos.push( photo );
                        }
                        resolve();
                    }).catch((e)=>{console.log(e); reject(e)});

                }));
            });
            setTimeout(()=>{
                Promise.all(promises).then(() => {
                    MapEditorService.addPhotos( photos );
                });
            }, 100);
        }).catch((e)=>{
            console.log(e);
            this.setState({ isPickerOpen: false});
        });
    };

    openPhoto = ( photo, index ) => {
        let photosLength = this.props.photosWithNoGPS.length + index - 1;
        let x = 0;
        if ( photosLength > 0) {
            x = photosLength * 77 ;
        }
        this.props.scrollRef.scrollTo({x: x, animated: true});

        this.props.dispatch( isPhotoModalOn( false ) );
        this.props.dispatch( setPhotos( this.props.photos ) );
        this.props.dispatch( setPhotoIndex( index ) );
        var center = TravelsService.getCenter4PhotoModal( photo );
        this.props.dispatch( updateCenter( center ) );
        setTimeout(() => {
            this.props.dispatch( isPhotoModalOn( true ) );
        }, 200);
    };

    // 사진 삭제모드 전환 이벤트
    deleteMode = ( ) => {
        if (this.state.deleteIndex.length > 0 || this.state.deleteIndexNoGps.length > 0){
            ModalsService.openAskModal( this.props.navigator, I18n.t('WantToDeletePhotos1') + (this.state.deleteIndexNoGps.length + this.state.deleteIndex.length) + I18n.t('WantToDeletePhotos2'), ( isRun ) => {
                if (isRun) {
                    if (this.state.deleteIndex.length > 0){
                        var photos = [];
                        this.props.dispatch( deleteAllPhoto( ) );
                        this.props.photos.forEach(( photo, i ) => {
                            if (this.state.deleteIndex.indexOf(i) == -1){
                                photos.push(photo);
                            }
                        });
                        this.props.dispatch( changePhotosArray(photos) );
                        setTimeout(() => {
                            this.props.dispatch( updateCenter( MapEditorService.getPosition( this.props.photos ) ) );
                            MapEditorService.updateMarkers( this.props.photoOutlineColor, this.props.photoShape, this.props.photoOutlineWidth, function(){});
                        }, 300);
                    }
                    if (this.state.deleteIndexNoGps.length > 0){
                        var photos = [];
                        this.props.dispatch( deleteAllPhotoWithNoGPS( ) );
                        this.props.photosWithNoGPS.forEach(( photo, i ) => {
                            if (this.state.deleteIndexNoGps.indexOf(i) == -1){
                                photos.push(photo);
                            }
                        });
                        this.props.dispatch( changePhotosWithNoGPSArray(photos) );
                    }
                }
                setTimeout(()=>{
                    this.setState ({
                        deleteMode: false,
                        deleteIndex: [],
                        deleteIndexNoGps: [],
                    });
                }, 300);
            });
        } else {
            this.setState ({
                deleteMode: !this.state.deleteMode,
                deleteIndex: [],
                deleteIndexNoGps: [],
            });
        }
    };

    // 사진 삭제버튼을 눌렀을 시, 실행
    deleteAddPhoto = ( index:number ) => {
        if (this.state.deleteIndex.indexOf(index) > -1){
            var arr = JSON.parse(JSON.stringify(this.state.deleteIndex));
            var arr = arr.remove(index);
            this.setState ({
                deleteIndex: arr
            });
        } else {
            this.setState ({
                deleteIndex: [...this.state.deleteIndex, index]
            });
        }
    };
    deleteAddPhotoNoGps = ( index:number ) => {
        if (this.state.deleteIndexNoGps.indexOf(index) > -1){
            var arr = JSON.parse(JSON.stringify(this.state.deleteIndexNoGps));
            var arr = arr.remove(index);
            this.setState ({
                deleteIndexNoGps: arr
            });
        } else {
            this.setState ({
                deleteIndexNoGps: [...this.state.deleteIndexNoGps, index]
            });
        }
    };


    render() {
        var photos = this.props.photos.map(( photo, index ) => {
            return <PhotoView key={ index } navigator={ this.props.navigator } index={ index } photo={ photo } openPhoto={ this.openPhoto } />
        });
        var photosEdit = this.props.photos.map(( photo, index ) => {
            return <PhotoEdit key={ index } index={ index } photo={ photo } deleteIndex={this.state.deleteIndex} deleteAddPhoto={this.deleteAddPhoto} />
        });
        var photosWithoutGps = this.props.photosWithNoGPS.map(( photo, index ) => {
            return <PhotoViewWithoutGps key={ index } navigator={ this.props.navigator } index={index} photo={ photo } />
        });
        var photosWithoutGpsEdit = this.props.photosWithNoGPS.map(( photo, index ) => {
            return <PhotoEdit key={index} index={ index } photo={ photo } deleteIndex={this.state.deleteIndexNoGps} deleteAddPhoto={this.deleteAddPhotoNoGps} />
        });
        var imgGuide = () => {
            if (this.props.photos.length > 0 || this.props.photosWithNoGPS.length > 0){
                return null
            }else{
                return (
                    <View style={styles.imgGuideBox}>
                        <View style={styles.imgGuide}>
                            <Text style={styles.imgGuideText}>{I18n.t('PleaseAddNewPhoto')}</Text>
                        </View>
                        <Image style={styles.imgGuideSpeechBubble} source={{uri: 'icon_create_speech_bubble_deco'}} />
                    </View>
                )
            }
        };
        return (
            <View style={styles.container}>
                { this.props.photos.length > 0 || this.props.photosWithNoGPS.length > 0
                    ? (
                        <TouchableHighlight style={styles.headerDeleteBtn}
                                            underlayColor= 'rgba(48, 50, 59, 1.0)'
                                            onPress={this.deleteMode.bind(this)}>
                            <View style={styles.headerDeleteBtnInside}>
                                <Image style={styles.headerBtnImg} source={{uri: 'icon_create_trash'}} />
                                <Text style={styles.headerBtnText}>{I18n.t('Delete')}</Text>
                            </View>
                        </TouchableHighlight>
                    )
                    : null}
                <View style={styles.bodyContainer}>
                    <ScrollView
                        ref={"scrollPhotos"}
                        style= {styles.imgScroll}
                        horizontal= {true}>
                        <TouchableHighlight
                            style={[styles.imgItem, styles.imgAddBtn]}
                            underlayColor= 'rgba(48, 50, 59, 1.0)'
                            onPress={this.openImagePicker.bind(this)} >
                            <Image style={styles.imgAddBtnIcon} source={{uri: 'icon_create_img_add'}} />
                        </TouchableHighlight>
                        { this.state.deleteMode == false ? photosWithoutGps : photosWithoutGpsEdit }
                        { this.state.deleteMode == false ? photos : photosEdit }
                        { imgGuide() }
                    </ScrollView>
                </View>
            </View>
        );
    }
}


export default connect((state) => {
  return {
    photos: state.services.mapEditor.photos,
    photosWithNoGPS: state.services.mapEditor.photosWithNoGPS,
      scrollRef: state.services.navigation.scrollRef,

      photoShape: state.services.mapEditor.photoShape,
      photoOutlineColor: state.services.mapEditor.photoOutlineColor,
      photoOutlineWidth: state.services.mapEditor.photoOutlineWidth
  };
})(CreateToolBar);
