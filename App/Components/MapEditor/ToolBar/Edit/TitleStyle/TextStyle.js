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
  KeyboardAvoidingView
} from 'react-native';

import Dimensions from 'Dimensions';
import { connect } from 'react-redux';
import { COLORS, selectTitleBg, selectTitleColor } from 'ActionMapEditor2';

/**
* props.navigator
**/
class MapStyleToolBar extends Component {
  constructor(props) {
    super(props);
  }
  selectTitleBg = ( color ) => {
    this.props.dispatch( selectTitleBg( color ) );
  }
  selectTitleColor = ( color ) => {
    this.props.dispatch( selectTitleColor( color ) );
  }
  render() {
    let colors4Bg = Object.keys(COLORS).map((colorKey, index) => {
          return (
            <TouchableHighlight
                key={index}
                style={[styles.colorBox, {backgroundColor: COLORS[colorKey]}]}
                underlayColor= 'rgba(0, 0, 0, 0)'
                onPress={this.selectTitleBg.bind(this, COLORS[colorKey])} >
                <View style={ this.props.titleBg == COLORS[colorKey] ? styles.colorBoxActive : null}>
                </View>
            </TouchableHighlight>
          )
    })
    let colors4text = Object.keys(COLORS).map((colorKey, index) => {
          return (
            <TouchableHighlight
                key={index}
                style={[styles.colorBox, {backgroundColor: COLORS[colorKey]}]}
                underlayColor= 'rgba(0, 0, 0, 0)'
                onPress={this.selectTitleColor.bind(this, COLORS[colorKey])} >
                <View style={ this.props.titleColor == COLORS[colorKey] ? styles.colorBoxActive : null}>
                </View>
            </TouchableHighlight>
          )
    })
    return (
        <View style={styles.container}>
            <View style={[styles.colorContainer, styles.colorBottomLine]}>
                <Image source={{uri: 'icon_edit_title_bg_black'}} style={styles.colorLeftIcon} />
                <ScrollView
                    style={styles.colorScroll}
                    horizontal={true}>
                    { colors4Bg }
                </ScrollView>
            </View>
            <View style={styles.colorContainer}>
                <Image source={{uri: 'icon_edit_title_color_black'}} style={styles.colorLeftIcon} />
                <ScrollView
                    style={styles.colorScroll}
                    horizontal={true}>
                    { colors4text }
                </ScrollView>
            </View>
        </View>
    );
  }
}
const styles = StyleSheet.create({
      container: { // 전체 Container
          flexDirection: 'column',
          height: 100,
          backgroundColor: 'rgba(44, 46, 56, 0.9)'
      },
      colorContainer: {
        flexDirection: 'row',
        height: 50
      },
      colorBottomLine: {
        borderBottomWidth: 1,
        borderColor: 'rgba(44, 46, 56, 0.97)'
      },
      colorLeftIcon: {
        marginTop: 7,
        marginLeft: 10,
        height: 36,
        width: 36
      },
      colorScroll: {
        marginLeft: 10,
        marginRight: 10,
        width: Dimensions.get('window').width - 66,
        height: 50
      },
      colorBox: {
        marginRight: 5,
        width: 25,
        height: 25,
        borderRadius: 2,
        alignSelf: 'center'
      },
      colorBoxActive: {
        width: 25,
        height: 25,
        borderWidth: 2,
        borderColor: "#7EACFF",
        borderRadius: 2
      }
})

export default connect((state) => {
  return {
    titleBg: state.services.mapEditor.titleBg,
    titleColor: state.services.mapEditor.titleColor
  };
})(MapStyleToolBar);