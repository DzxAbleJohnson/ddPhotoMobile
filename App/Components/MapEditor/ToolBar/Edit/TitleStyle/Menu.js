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
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';

import Dimensions from 'Dimensions';
import { connect } from 'react-redux';
import { FONTS, selectTitleAlign, setTitleText } from 'ActionMapEditor2';
import { changeTab, changeEditTitleTab, TABS, EDIT_TITLE_TABS } from 'ActionNavigation';

import TextFontToolBar from './TextFont';
import TextStyleToolBar from './TextStyle';

/**
* props.navigator
* props.title
**/
class EditModeNav extends Component {
  constructor(props) {
    super(props);
  }
  goBack = () => {
    Keyboard.dismiss();
    this.props.dispatch( changeTab(TABS.EDIT) );
  }
  deleteTitle = () => {
    Keyboard.dismiss();
    this.props.dispatch( setTitleText(null) );
    this.goBack();
  }
  changeEditTitleTab = ( editTitleTab ) => {
    this.props.dispatch( changeEditTitleTab(editTitleTab) );
    switch ( editTitleTab ){
        case EDIT_TITLE_TABS.ALIGN:
            if ( this.props.titleAlign == 'left' )
                this.props.dispatch( selectTitleAlign('center') );
            if ( this.props.titleAlign == 'center' )
                this.props.dispatch( selectTitleAlign('right') );
            if ( this.props.titleAlign == 'right' )
                this.props.dispatch( selectTitleAlign('left') );
            break;
    }
  }
  render() {
    return (
        <View style={styles.toolBarContainer}>
            <TouchableHighlight
                style={styles.btnContainer}
                underlayColor= 'rgba(0, 0, 0, 0.1)'
                onPress={ this.goBack.bind( this ) } >
                <Image source={{uri: 'icon_back'}} style={styles.btnImg} />
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.btnContainer}
                underlayColor= 'rgba(0, 0, 0, 0.1)'
                onPress={ this.changeEditTitleTab.bind( this, EDIT_TITLE_TABS.KEYBOARD ) } >
                <Image source={{uri: this.props.editTitleTab == EDIT_TITLE_TABS.KEYBOARD ? 'icon_edit_title_keyboard_active' : 'icon_edit_title_keyboard'}} style={styles.btnImg} />
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.btnContainer}
                underlayColor= 'rgba(0, 0, 0, 0.1)'
                onPress={ this.changeEditTitleTab.bind( this, EDIT_TITLE_TABS.FONT ) } >
                <Image source={{uri: this.props.editTitleTab == EDIT_TITLE_TABS.FONT ? 'icon_edit_title_size_active' : 'icon_edit_title_size'}} style={styles.btnImg} />
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.btnContainer}
                underlayColor= 'rgba(0, 0, 0, 0.1)'
                onPress={ this.changeEditTitleTab.bind( this, EDIT_TITLE_TABS.ALIGN ) } >
                <Image source={{uri: this.props.editTitleTab == EDIT_TITLE_TABS.ALIGN ? 'icon_edit_title_align_' + this.props.titleAlign + "_active" : 'icon_edit_title_align_' + this.props.titleAlign}} style={styles.btnImg} />
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.btnContainer}
                underlayColor= 'rgba(0, 0, 0, 0.1)'
                onPress={ this.changeEditTitleTab.bind( this, EDIT_TITLE_TABS.COLOR ) } >
                <Image source={{uri: this.props.editTitleTab == EDIT_TITLE_TABS.COLOR ? 'icon_edit_title_bg_active' : 'icon_edit_title_bg'}} style={styles.btnImg} />
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.btnContainer}
                underlayColor= 'rgba(0, 0, 0, 0.1)'
                onPress={ this.deleteTitle.bind( this ) } >
                <Image source={{uri: 'icon_edit_title_trash'}} style={styles.btnImg} />
            </TouchableHighlight>
        </View>
    );
  }
}
const styles = StyleSheet.create({
      toolBarContainer: {
          flexDirection: 'row',
          height: 50,
          backgroundColor: '#FFFFFF'
      },
      btnContainer: {
        flex: 1,
        height: 50
      },
      btnImg: {
        marginTop: 13,
        width: 23,
        height: 23,
        alignSelf: 'center'
      }
})

export default connect((state) => {
  return {
    editTitleTab: state.services.navigation.editTitleTab,

    title: state.services.mapEditor.title,
    titleColor: state.services.mapEditor.titleColor,
    titleBackground: state.services.mapEditor.titleBackground,
    titleAlign: state.services.mapEditor.titleAlign,
    titleFont: state.services.mapEditor.titleFont
  };
})(EditModeNav);