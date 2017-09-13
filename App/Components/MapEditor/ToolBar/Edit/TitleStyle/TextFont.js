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
import { FONTS, selectTitleFont } from 'ActionMapEditor2';

// i18n
import I18n from 'I18n'

/**
* props.navigator
**/
class TextFont extends Component {
  constructor(props) {
    super(props);
  }
  selectTitleFont = ( font ) => {
    this.props.dispatch( selectTitleFont( font ) );
  }
  render() {
    let fonts = Object.keys(FONTS).map((fontKey, index) => {
          return (
            <TouchableHighlight
                key={index}
                style={[styles.titleItem, styles.titleItemBottomLine]}
                underlayColor= 'rgba(0, 0, 0, 0.2)'
                onPress={this.selectTitleFont.bind(this, FONTS[fontKey])} >
                <Text style={[styles.titleItemText, {fontFamily: FONTS[fontKey], color: FONTS[fontKey] == this.props.titleFont ? "#7EACFF" : "#FFFFFF"}]}>{I18n.t('FontDesc')}</Text>
            </TouchableHighlight>
          )
    })
    return (
            <View style={styles.container}>
                <ScrollView
                    style={{height: 140}}
                    horizontal= {false}>
                    { fonts }
                </ScrollView>
            </View>
    );
  }
}
const styles = StyleSheet.create({
      container: { // 전체 Container
          flexDirection: 'row',
          height: 140,
          backgroundColor: 'rgba(44, 46, 56, 0.9)'
      },
      titleItem: {
        width: Dimensions.get('window').width,
        height: 50
      },
      titleItemBottomLine: {
        borderBottomWidth: 1,
        borderColor: '#7F7F83'
      },
      titleItemText: {
        flex: 9,
        paddingTop: 15,
        paddingLeft: 10,
        color: '#FFFFFF',
        fontSize: 15
      },
})

export default connect((state) => {
  return {
    titleText: state.services.mapEditor.titleText,
    titleFont: state.services.mapEditor.titleFont
  };
})(TextFont);