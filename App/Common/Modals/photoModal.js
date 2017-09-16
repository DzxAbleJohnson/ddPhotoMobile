/**
 * @providesModule PhotoModal
 */

'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';

import {
  View,
  StyleSheet,
  Button,
  Text,
  TouchableHighlight,
  Platform,
  Animated,
    Image
} from 'react-native';

import Dimensions from 'Dimensions';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';

import { CachedImage } from "react-native-img-cache";
import Swiper from 'react-native-swiper';

// Actions
import { isPhotoModalOn, setPhotoIndex } from 'ActionModals';
import { updateCenter } from 'ActionMapEditor2';
import { TABS } from 'ActionNavigation';


// Services
import * as DateUtil from 'DateUtilService';
import * as TravelsService from 'TravelsService';

import store from 'Store';

/**
 * props.navigator
 * props.photosWithNoGPSLength
 **/
class PhotoModal extends Component {
    constructor(props) {
        super(props);
        this.photos = store.getState().services.modals.photos;
        this.photoIndex = store.getState().services.modals.photoIndex;

        // 데이터가 정상적인지 검증
        if (!this.photos[this.photoIndex]){
            this.closeModal();
        }
    };

    componentDidMount = () => {
        if (this.refs["modalContainer"]) {
            this.refs["modalContainer"].zoomIn(400);
        }
    };

    closeModal = () => {
        if (this.refs["modalContainer"]){
            this.refs["modalContainer"].zoomOut(400).then(() => {
                this.props.dispatch( isPhotoModalOn( false ) );
                this.props.dispatch( setPhotoIndex( 0 ) );
            });
        }else{
            this.props.dispatch( isPhotoModalOn( false ) );
            this.props.dispatch( setPhotoIndex( 0 ) );
        }
    };

    onSwipe = ( index ) => {
        this.props.dispatch( setPhotoIndex( index ) );
        var center = TravelsService.getCenter4PhotoModal( this.photos[index] );
        this.props.dispatch( updateCenter( center ) );

        if (this.props.tab == TABS.CREATE && this.props.wideScreen == false){
            let photosLength = this.props.photosWithNoGPSLength + index - 1;
            let x = 0;
            if ( photosLength > 0) {
                x = photosLength * 77 ;
            }
            this.props.scrollRef.scrollTo({x: x, animated: true});
        }
    };

    render() {
        let swipeListView = this.photos.map(( photo, index ) => {
            return (
                <View key={index} style={styles.swiperContainer}>
                    <View style={styles.photoContainer}>
                        { photo["url@800"] != null
                            ? <CachedImage key={index} style={styles.photo} source={{uri: photo["url@800"]}} />
                            : <Image key={index} style={styles.photo} source={{uri: photo["uri@800"]}} />
                        }
                        <View style={styles.photoHideBottomRadius}></View>
                    </View>
                    <View style={styles.photoDescContainer}>
                        <View style={styles.photoDescLeft}>
                            <Text style={styles.photoDescLeft_Step}>STEP</Text>
                            <Text style={styles.photoDescLeft_Count}>{ index + 1 }</Text>
                        </View>
                        <View style={styles.photoDescRight}>
                            <Text style={styles.photoDescRightDate} numberOfLines={1}>{ DateUtil.format('llll', photo.date) }</Text>
                            <Text style={styles.photoDescRightLocation} numberOfLines={1}>{ photo.locationText }</Text>
                        </View>
                    </View>
                </View>
            )
        });
        return (
            <View style={styles.container}>
                <TouchableHighlight
                    style={styles.closeContainer}
                    underlayColor= 'rgba(0, 0, 0, 0)'
                    onPress={this.closeModal.bind(this)}>
                    <View></View>
                </TouchableHighlight>
                <Animatable.View ref="modalContainer" style={styles.modalContainer}>
                    <Swiper index={ this.photoIndex } loop={true} loadMinimal={true} loadMinimalSize={3} onIndexChanged={ this.onSwipe } showButtons={false} showsPagination={false}>
                        {swipeListView}
                    </Swiper>
                </Animatable.View>
            </View>
        );
    };
}

/*
*
 <View style={styles.photoSpeechBubbleTailBottom}>
 <Image style={styles.photoSpeechBubbleTailBottomImg} source={{uri: "icon_speech_bubble_tail_bottom"}} />
 </View>
* */
const styles = StyleSheet.create({
      container: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        //zIndex: 20,
        backgroundColor: "rgba(0, 0, 0, 0.05)"
      },
      // Close Section
      closeContainer: {
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          //zIndex: 5
      },
      // Modal
      modalContainer: {
        position: 'absolute',
        top: (Dimensions.get('window').height / 2) - 165 - 70,
        left: (Dimensions.get('window').width / 2) - 135,
        flexDirection: 'column',
        width: 270,
        height: 330,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: 4,
        ...Platform.select({
            ios: {
                shadowOpacity: 0.3,
                shadowRadius: 3,
                shadowOffset: {
                    height: 3,
                    width: 3
                }
            },
            android: {
                elevation: 3
            },
        }),
          //zIndex: 10,
      },
    swiperContainer: {
        width: 270,
        height: 330,
    },
      photoContainer: {
        position: 'relative',
        width: 270,
        height: 270,
      },
      photo: {
        width: 270,
        height: 270,
          borderRadius: 4,
      },
      photoHideBottomRadius: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 3,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        //zIndex: 1
      },
      photoDescContainer:{
        flexDirection: 'row',
        marginTop: 3,
      },
      photoDescLeft: {
        flexDirection: 'column',
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        height: 50,
        width: 50,
        backgroundColor: '#2D4EAF',
        borderRadius: 5,
        alignItems:'center',
        justifyContent:'center',
      },
      photoDescLeft_Step: {
        color: '#A4BBFF',
        fontSize: 12
      },
      photoDescLeft_Count: {
        color: '#FFFFFF',
        fontSize: 16
      },
      photoDescRight: {
        margin: 5
      },
      photoDescRightDate: {
        marginTop: 3,
        width: 195,
        color: '#3E3E3E',
        fontSize: 14
      },
      photoDescRightLocation: {
        marginTop: 3,
        width: 195,
        color: '#5B5B5B',
        fontSize: 12
      },
      photoSpeechBubbleTailBottom: {
        position: 'absolute',
        top: 330,
        left: 125,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        ...Platform.select({
            ios: {
                shadowOpacity: 0.3,
                shadowRadius: 3,
                shadowOffset: {
                    height: 3,
                    width: 3
                }
            },
            android: {
                elevation: 3
            },
        })
      },
      photoSpeechBubbleTailBottomImg: {
        width: 20,
        height: 15,
      }
});

export default connect((state) => {
    return {
        isPhotoModalOn: state.services.modals.isPhotoModalOn,

        wideScreen: state.services.navigation.wideScreen,
        tab: state.services.navigation.tab,
        scrollRef: state.services.navigation.scrollRef,
    };
})(PhotoModal);
