/**
 * @providesModule captureModal
 */

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
    CameraRoll
} from 'react-native';

import { connect } from 'react-redux';
import Dimensions from 'Dimensions';
import { CachedImage } from "react-native-img-cache";

// Actions


// Services


// i18n
import I18n from 'I18n'

/**
 * props.navigator
 * props.uri
**/
class SaveModal extends Component {
  constructor(props) {
    super(props);
  }
  save = () => {
      CameraRoll.saveToCameraRoll(this.props.uri)
          .then(()=>{
              this.closeModal();
          });
  }
  closeModal = () => {
    this.props.navigator.dismissLightBox();
  }
  render() {
    return (
        <View style={styles.container}>
            { this.props.uri.indexOf("http") > -1
                ? <CachedImage style={styles.captureImg} source={{uri: this.props.uri}} />
                : <Image style={styles.captureImg} source={{uri: this.props.uri}} />
            }
            <View style={styles.modalRowBtns}>
                <TouchableHighlight style={[styles.modalBtn, styles.modalBtnBlue]}
                    underlayColor= '#3356C0'
                    onPress={this.save.bind(this)}>
                    <Text style={styles.modalBtnBlue_Text}>{I18n.t('SavePhoto')}</Text>
                </TouchableHighlight>
                <View style={{flex: 0.5}}></View>
                <TouchableHighlight style={[styles.modalBtn, styles.modalBtnWhite]}
                    underlayColor= '#F5F5F5'
                    onPress={this.closeModal.bind(this)}>
                    <Text style={styles.modalBtnWhite_Text}>{I18n.t('Cancel')}</Text>
                </TouchableHighlight>
            </View>
        </View>
    );
  }
}
const styles = StyleSheet.create({
    container: { // 전체 Container
      flexDirection: 'column',
      alignItems:'center',
      justifyContent:'center',
      width: 270,
        height: 500,
      padding: 15,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      borderRadius: 10
    },
    ///////////
    captureImg: {
        width: 240,
        height: 400
    },

    ////////////
    modalRowBtns: {
        marginTop: 15,
        flexDirection: 'row',
    },
    modalBtn: {
        flex: 4,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    //
    modalBtnBlue: {
        backgroundColor: '#4467D1'
    },
    modalBtnBlue_Text: {
        color: '#FFFFFF'
    },
    modalBtnWhite: {
        backgroundColor: '#FFFFFF',
    },
    modalBtnWhite_Text: {
        color: '#4467D1'
    }
})

export default connect()(SaveModal);