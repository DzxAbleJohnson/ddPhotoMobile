'use strict';

import React, {
  Component,
  PropTypes
} from 'react';

import {
  View,
  Button,
  Text,
  Image,
  ScrollView,
  TouchableHighlight,
  Alert
} from 'react-native';

import Dimensions from 'Dimensions';
import { connect } from 'react-redux';

import { styles } from './styles.android';

// Services
import * as ModalsService from 'ModalsService';

/*
* props.photo
* props.index
* props.navigator
* props.openPlaceSuggestionModal ( index )
*/
class PhotoViewWithoutGps extends Component {
  render() {
    return (
        <View style={styles.imgItem}>
            <Image style={styles.imgContent} source={{ uri: this.props.photo["uri@800"] }} />
            <TouchableHighlight
                style={styles.imgNoGPS}
                underlayColor= 'rgba(0, 0, 0, 0.5)'
                onPress={ModalsService.openPlaceSuggestionModal.bind(this, this.props.navigator, this.props.index)} >
                <View></View>
            </TouchableHighlight>
        </View>
    )
  }
}

export default PhotoViewWithoutGps;