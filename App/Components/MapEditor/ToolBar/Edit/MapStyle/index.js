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

// Actions
import { setScreen, SCREENS } from 'ActionNavigation';
import { MAP_STYLES, selectMapStyle } from 'ActionMapEditor2';


/**
* props.navigator
**/
class MapStyleToolBar extends Component {
  constructor(props) {
    super(props);
  }
  setMapStyle = ( mapStyle ) => {
    this.props.dispatch( selectMapStyle( mapStyle ) );
    setTimeout(() => {
        this.props.dispatch( setScreen(SCREENS.TRAVEL) );
        setTimeout(() => {
            this.props.dispatch( setScreen(SCREENS.MAP_EDITOR) );
        }, 1000);
    }, 1000);
  }
  render() {
    let mapStyles = Object.keys(MAP_STYLES).map((mapStyleKey, index) => {
          return (
            <TouchableHighlight
                key={index}
                style={styles.mapStyleBtn}
                underlayColor= 'rgba(0, 0, 0, 0)'
                onPress={this.setMapStyle.bind(this, MAP_STYLES[mapStyleKey])} >
                <View>
                    <Image source={{uri: 'icon_edit_map_style_' + MAP_STYLES[mapStyleKey]}} style={styles.mapStyle_Img} />
                    <View style={this.props.mapStyle == MAP_STYLES[mapStyleKey] ? styles.mapStyle_ImgActive : null}></View>
                    <Text style={[styles.mapStyle_Txt, this.props.mapStyle == MAP_STYLES[mapStyleKey] ? styles.mapStyle_TxtActive : null]}>{MAP_STYLES[mapStyleKey]}</Text>
                </View>
            </TouchableHighlight>
          )
    })
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal= {true}>
                {mapStyles}
            </ScrollView>
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
          height: 85,
          //zIndex: 5,
          backgroundColor: 'rgba(44, 46, 55, 0.8)'
      },
      mapStyleBtn: {
        marginTop: 5,
        marginLeft: 5,
        marginBottom: 5,
        height: 85,
      },
      mapStyle_Img: {
        width: 60,
        height: 60,
        borderRadius: 4
      },
      mapStyle_ImgActive: {
        position: 'absolute',
        top: 0,
        width: 60,
        height: 60,
        borderWidth: 2,
        borderColor: "#7EACFF",
        borderRadius: 4
      },
      mapStyle_Txt: {
        marginTop: 2,
        color: '#FFFFFF',
        fontSize: 11,
        alignSelf: 'center'
      },
      mapStyle_TxtActive: {
        color: '#7EACFF'
      }
})

export default connect((state) => {
  return {
    photos: state.services.mapEditor.photos,
    mapStyle: state.services.mapEditor.mapStyle
  };
})(MapStyleToolBar);