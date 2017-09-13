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
  Slider,
  TouchableHighlight
} from 'react-native';

import Dimensions from 'Dimensions';
import { connect } from 'react-redux';

import { COLORS, selectRouteColor, selectRouteWidth } from 'ActionMapEditor2';

/**
* props.navigator
**/
class MapLineToolBar extends Component {
  constructor(props) {
    super(props);
  }
  selectRouteWidth = ( width ) => {
    this.props.dispatch( selectRouteWidth( width ) );
  }
  selectRouteColor = ( color ) => {
    this.props.dispatch( selectRouteColor( color ) );
  }
  render() {
    let colors = Object.keys(COLORS).map((colorKey, index) => {
          return (
            <TouchableHighlight
                key={index}
                style={[styles.routeColorBox, {backgroundColor: COLORS[colorKey]}]}
                underlayColor= 'rgba(0, 0, 0, 0)'
                onPress={this.selectRouteColor.bind(this, COLORS[colorKey])} >
                <View style={ this.props.routeColor == COLORS[colorKey] ? styles.routeColorBoxActive : null}>
                </View>
            </TouchableHighlight>
          )
    })
    return (
        <View style={styles.container}>
            <View style={styles.routeWidthSliderContainer}>
                <Slider
                    style={styles.routeWidthSlider}
                    step={1}
                    value={this.props.routeWidth}
                    minimumValue={0}
                    thumbTintColor={"#FFFFFF"}
                    onSlidingComplete={this.selectRouteWidth}
                    maximumValue={7}>
                </Slider>
            </View>
            <View style={styles.routeColorScrollContainer}>
                <ScrollView
                    style={styles.routeColorScroll}
                    horizontal={true}>
                    { colors }
                </ScrollView>
            </View>
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
          bottom: 45,
          width: Dimensions.get('window').width,
          height: 50,
          //zIndex: 5,
          backgroundColor: 'rgba(67, 70, 84, 0.9)'
      },
      routeWidthSliderContainer: {
        flex: 4
      },
      routeColorScrollContainer: {
        flex: 6
      },
      routeWidthSlider: {
          marginLeft: 10,
          marginRight: 10,
        height: 50
      },
      routeColorScroll: {
        height: 50
      },
      routeColorBox: {
        marginRight: 5,
        width: 25,
        height: 25,
        borderRadius: 2,
        alignSelf: 'center'
      },
      routeColorBoxActive: {
        width: 25,
        height: 25,
        borderWidth: 2,
        borderColor: "#7EACFF",
        borderRadius: 2
      }
})

export default connect((state) => {
  return {
    routeColor: state.services.mapEditor.routeColor,
    routeWidth: state.services.mapEditor.routeWidth
  };
})(MapLineToolBar);