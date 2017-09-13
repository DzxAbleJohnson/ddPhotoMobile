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
  Slider
} from 'react-native';

import Dimensions from 'Dimensions';
import { connect } from 'react-redux';

// Actions
import { COLORS, SHAPES, selectPhotoShape, selectPhotoOutlineColor, selectPhotoOutlineWidth } from 'ActionMapEditor2';

// Services
import * as MapEditorService from 'MapEditorService';

// i18n
import I18n from 'I18n'

/**
* props.navigator
**/
class PhotoStyleToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currentState: "SHAPE" // SHAPE 랑 OUTLINE이 있음
    }
  }
  selectPhotoShape = ( shape ) => {
    this.props.dispatch( selectPhotoShape( shape ) );
      MapEditorService.updateMarkers( this.props.photoOutlineColor, shape, this.props.photoOutlineWidth );
  }
  selectPhotoOutlineColor = ( color ) => {
    this.props.dispatch( selectPhotoOutlineColor( color ) );
      MapEditorService.updateMarkers( color, this.props.photoShape, this.props.photoOutlineWidth );
  }
  selectPhotoOutlineWidth = ( width ) => {
    this.props.dispatch( selectPhotoOutlineWidth( width ) );
      MapEditorService.updateMarkers( this.props.photoOutlineColor, this.props.photoShape, width );
  }
  render() {
    let shapes = Object.keys(SHAPES).map((shapeKey, index) => {
          return (
            <TouchableHighlight
                key={index}
                style={styles.photoShapeItem}
                underlayColor= 'rgba(0, 0, 0, 0)'
                onPress={this.selectPhotoShape.bind(this, SHAPES[shapeKey])} >
                <Image source={{uri: SHAPES[shapeKey] == this.props.photoShape ? 'icon_edit_picture_' + SHAPES[shapeKey] + '_select' : 'icon_edit_picture_' + SHAPES[shapeKey]}} style={styles.photoShapeImg} />
            </TouchableHighlight>
          )
    })
    let colors = Object.keys(COLORS).map((colorKey, index) => {
          return (
            <TouchableHighlight
                key={index}
                style={[styles.photoOutlineColorBox, {backgroundColor: COLORS[colorKey]}]}
                underlayColor= 'rgba(0, 0, 0, 0)'
                onPress={this.selectPhotoOutlineColor.bind(this, COLORS[colorKey])} >
                <View style={ this.props.photoOutlineColor == COLORS[colorKey] ? styles.photoOutlineColorBoxActive : null}>
                </View>
            </TouchableHighlight>
          )
    })
    return (
        <View style={styles.container}>
            <TouchableHighlight
                onPress={()=>{ this.setState({currentState: "SHAPE"}) }}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{I18n.t('PhotoShape')}</Text>
                    <View style={{flex: 1}}>
                        <Image source={{uri: "icon_edit_down"}} style={styles.titleImg} />
                    </View>
                </View>
            </TouchableHighlight>
            { this.state.currentState == "SHAPE"
                ? (
                    <View style={styles.configContainer}>
                        <ScrollView
                            style={styles.photoOutlineColorScroll}
                            horizontal={true}>
                            { shapes }
                        </ScrollView>
                    </View>
                )
                : null
            }
            <TouchableHighlight
                onPress={()=>{ this.setState({currentState: "OUTLINE"}) }}>
                <View style={[styles.titleContainer, styles.titleContainerTopLine]}>
                    <Text style={styles.titleText}>{I18n.t('PhotoOutline')}</Text>
                    <View style={{flex: 1}}>
                        <Image source={{uri: "icon_edit_down"}} style={styles.titleImg} />
                    </View>
                </View>
            </TouchableHighlight>
            { this.state.currentState == "OUTLINE"
                ? (
                    <View style={styles.configContainer}>
                        <View style={styles.photoOutlineWidthSliderContainer}>
                            <Slider
                                style={styles.photoOutlineWidthSlider}
                                step={1}
                                value={this.props.photoOutlineWidth}
                                minimumValue={1}
                                thumbTintColor={"#FFFFFF"}
                                onSlidingComplete={this.selectPhotoOutlineWidth}
                                maximumValue={6}>
                            </Slider>
                        </View>
                        <View style={styles.photoOutlineColorScrollContainer}>
                            <ScrollView
                                style={styles.photoOutlineColorScroll}
                                horizontal={true}>
                                { colors }
                            </ScrollView>
                        </View>
                    </View>
                )
                : null
            }
        </View>
    );
  }
}
const styles = StyleSheet.create({
      container: { // 전체 Container
          position: 'absolute',
          flexDirection: 'column',
          left: 0,
          right: 0,
          bottom: 45,
          width: Dimensions.get('window').width,
          height: 150,
          //zIndex: 5,
      },
      titleContainer: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: 'rgba(44, 46, 56, 0.9)'
      },
      titleContainerTopLine: {
        borderTopWidth: 1,
        borderColor: '#5D5D61'
      },
      titleText: {
        flex: 9,
        paddingTop: 15,
        paddingLeft: 10,
        color: '#FFFFFF',
        fontSize: 15
      },
      titleImg: {
        marginTop: 15,
        width: 20,
        height: 20,
      },
      configContainer:{
        flexDirection: 'row',
        width: '100%',
        height: 51,
        backgroundColor: 'rgba(67, 70, 84, 0.9)',
        alignItems: 'center'
      },
      photoShapeItem: {
        marginLeft: 10,
        marginRight: 5,
        height: 50,
      },
      photoShapeImg: {
        marginTop: 10,
        width: 32,
        height: 32,
      },
      photoOutlineWidthSliderContainer: {
        flex: 4,
        paddingRight: 5
      },
      photoOutlineColorScrollContainer: {
        flex: 6
      },
      photoOutlineWidthSlider: {
          marginLeft: 10,
          marginRight: 10,
        height: 50
      },
      photoOutlineColorScroll: {
        height: 50
      },
      photoOutlineColorBox: {
        marginRight: 5,
        width: 25,
        height: 25,
        borderRadius: 2,
        alignSelf: 'center'
      },
      photoOutlineColorBoxActive: {
        width: 25,
        height: 25,
        borderWidth: 2,
        borderColor: "#7EACFF",
        borderRadius: 2
      }
});

export default connect((state) => {
  return {
    photoShape: state.services.mapEditor.photoShape,
    photoOutlineColor: state.services.mapEditor.photoOutlineColor,
    photoOutlineWidth: state.services.mapEditor.photoOutlineWidth
  };
})(PhotoStyleToolBar);