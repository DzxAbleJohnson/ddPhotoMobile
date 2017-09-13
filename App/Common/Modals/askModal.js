/**
 * @providesModule AskModal
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
  TouchableHighlight
} from 'react-native';

import { connect } from 'react-redux';
import Dimensions from 'Dimensions';
import { changeTab, TABS } from 'ActionNavigation';

import * as MapEditorService from 'MapEditorService';

// i18n
import I18n from 'I18n'

/**
* props.navigator
* props.text
* props.event
**/
class AskModal extends Component {
  constructor(props) {
    super(props);
  }
  runEvent = () => {
    this.props.event( true );
    this.closeModal( );
  }
  closeModal = () => {
      this.props.event( false );
    this.props.navigator.dismissLightBox();
  }
  render() {
    return (
        <View style={styles.container}>
            <Image style={styles.modalIcon} source={{uri: 'icon_modal_save_caution'}} />
            <Text style={styles.modalDescription}>{ this.props.text }</Text>
            <TouchableHighlight style={[styles.modalBtn, styles.modalBtnBlue]}
                underlayColor= '#F5F5F5'
                onPress={ this.runEvent.bind(this) }>
                <Text style={styles.modalBtnBlue_Text}>{I18n.t('Ok')}</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.modalBtn, styles.modalBtnWhite]}
                underlayColor= '#F5F5F5'
                onPress={this.closeModal.bind(this)}>
                <Text style={styles.modalBtnWhite_Text}>{I18n.t('Cancel')}</Text>
            </TouchableHighlight>
        </View>
    );
  }
}
const styles = StyleSheet.create({
      container: { // 전체 Container
        flexDirection: 'column',
        alignItems:'center',
        justifyContent:'center',
        width: 260,
        padding: 30,
        backgroundColor: 'rgba(255, 255, 255, 1.0)',
        borderRadius: 10
      },
      modalIcon: {
        marginTop: 15,
        marginBottom: 20,
        width: 60,
        height: 60
      },
      modalDescription: {
        marginBottom: 7,
        fontSize: 14,
        textAlign: 'center',
        color: '#565656'
      },

      ////////////
      modalBtn: {
        marginTop: 15,
        width: 200,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
      },
      modalBtnBlue: {
        backgroundColor: '#4467D1'
      },
      modalBtnBlue_Text: {
        color: '#FFFFFF'
      },
      modalBtnWhite: {
        backgroundColor: '#FFFFFF',
        borderColor: '#4467D1',
        borderWidth: 1
      },
      modalBtnWhite_Text: {
        color: '#4467D1'
      }

})

export default connect()(AskModal);