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
  KeyboardAvoidingView,
  Keyboard,
    Platform
} from 'react-native';

import Dimensions from 'Dimensions';
import { connect } from 'react-redux';
import { changeTab, changeEditTitleTab, TABS, EDIT_TITLE_TABS } from 'ActionNavigation';

import TextFontToolBar from './TextFont';
import TextStyleToolBar from './TextStyle';
import Menu from './Menu';

/**
* props.navigator
* props.title
**/
class EditModeNav extends Component {
  constructor(props) {
    super(props);
  }
  closeTitleStyle = () => {
    Keyboard.dismiss();
    this.props.dispatch( changeTab(TABS.EDIT) );
  }
  render() {
    var editTitleToolBar = ( editTitleTab ) => {
        switch ( editTitleTab ) {
            case EDIT_TITLE_TABS.KEYBOARD:
                return null;
            case EDIT_TITLE_TABS.FONT:
                return <TextFontToolBar navigator={this.props.navigator} />;
            case EDIT_TITLE_TABS.ALIGN:
                return null;
            case EDIT_TITLE_TABS.COLOR:
                return <TextStyleToolBar navigator={this.props.navigator} />;
            default:
                return null;
        }
    }
    return (
        <View style={styles.container}>
            <TouchableHighlight
                style={ styles.closeContainer }
                underlayColor= 'rgba(0, 0, 0, 0.1)'
                onPress={ this.closeTitleStyle.bind( this ) } >
                <View></View>
            </TouchableHighlight>
            <KeyboardAvoidingView style={styles.toolBarContainer} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -22} behavior="padding">
                { editTitleToolBar( this.props.editTitleTab ) }
                <Menu />
            </KeyboardAvoidingView>
        </View>
    );
  }
}
const styles = StyleSheet.create({
      container: { // 전체 Container
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          //zIndex: 1,
      },
      closeContainer: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
      },
      toolBarContainer: { // 전체 Container
          flexDirection: 'column',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          //zIndex: 5,
      }
})

export default connect((state) => {
  return {
    editTitleTab: state.services.navigation.editTitleTab
  };
})(EditModeNav);