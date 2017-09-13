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

import Dimensions from 'Dimensions';
import { connect } from 'react-redux';
import { changeTab, TABS, TAB_TITLES } from 'ActionNavigation';

// i18n
import I18n from 'I18n'

/**
* props.navigator
* props.title
**/
class EditModeNav extends Component {
  constructor(props) {
    super(props);
  }
  goBack = () => {
    this.props.dispatch( changeTab(TABS.EDIT) );
  }
  render() {
    return (
        <View style={styles.container}>
            <TouchableHighlight
                style={styles.navBack}
                underlayColor= 'rgba(0, 0, 0, 0)'
                onPress={ this.goBack.bind() } >
                <Image source={{uri: 'icon_back'}} style={styles.navBack_Img} />
            </TouchableHighlight>
            <Text style={styles.navTitle}>{I18n.t(TAB_TITLES[this.props.tab])}{I18n.t('Style')}</Text>
            <View style={styles.navCheckBox}></View>
        </View>
    );
  }
}
const styles = StyleSheet.create({
      container: { // 전체 Container
          position: 'absolute',
          flexDirection: 'row',
          left: 0,
          right: 0,
          bottom: 0,
          height: 45,
          //zIndex: 10,
          alignItems:'center',
          justifyContent:'center',
          backgroundColor: '#F6F8F9',
          borderColor: '#D5D5D5',
          borderTopWidth: 1,
      },
      navBack: {
        flex: 1,
        flexDirection: 'column',
        alignItems:'center',
        justifyContent:'center'
      },
      navBack_Img: {
        width: 23,
        height: 23,
        alignSelf: 'center'
      },
      navTitle: {
       flex: 8,
       fontSize: 15,
       color: '#2D2D2D',
       textAlign: 'center',
       alignSelf: 'center'
      },
      navCheckBox: {
        flex: 1
      }
})

export default connect((state) => {
  return {
    tab: state.services.navigation.tab
  };
})(EditModeNav);