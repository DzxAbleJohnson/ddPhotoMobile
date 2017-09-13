/**
 * @providesModule SaveModal
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

// Actions
import { changeTab, TABS } from 'ActionNavigation';

// Services
import * as MapEditorService from 'MapEditorService';
import * as ModalsService from 'ModalsService';


// i18n
import I18n from 'I18n'

/**
 * props.navigator
**/
class SaveModal extends Component {
  constructor(props) {
    super(props);
  }
  closeModal = () => {
    this.props.navigator.dismissLightBox();
  }
  reset = () => {
    MapEditorService.resetMapEditor();
    this.closeModal();
  }
  render() {
    return (
        <View style={styles.container}>
            <Image style={styles.modalIcon} source={{uri: 'icon_modal_save_caution'}} />
            <Text style={styles.modalDescription}>{I18n.t('CannotEditAfterSave1')}</Text>
            <Text style={styles.modalDescription}>{I18n.t('CannotEditAfterSave2')}</Text>
            <TouchableHighlight style={[styles.modalBtn, styles.modalBtnBlue]}
                underlayColor= '#3356C0'
                onPress={ ModalsService.openSaveMetaModal.bind(this, this.props.navigator ) }>
                <Text style={styles.modalBtnBlue_Text}>{I18n.t('SaveLong')}</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.modalBtn, styles.modalBtnWhite]}
                underlayColor= '#F5F5F5'
                onPress={this.closeModal.bind(this)}>
                <Text style={styles.modalBtnWhite_Text}>{I18n.t('Cancel')}</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.modalBtn, styles.modalBtnBlack]}
                underlayColor= '#313131'
                onPress={this.reset.bind(this)}>
                <Text style={styles.modalBtnBlack_Text}>{I18n.t('CreateNew')}</Text>
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
      //
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
      },
      modalBtnBlack: {
        backgroundColor: '#424242'
      },
      modalBtnBlack_Text: {
        color: '#FFFFFF'
      }
})

export default connect()(SaveModal);