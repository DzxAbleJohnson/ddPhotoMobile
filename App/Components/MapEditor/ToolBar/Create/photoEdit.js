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

/*
* props.index
* props.photo
* props.deleteAddPhoto( index )
* props.deleteIndex
*/
class PhotoEdit extends Component {
  render() {
    return (
        <TouchableHighlight
            underlayColor= 'rgba(0, 0, 0, 0)'
            onPress={this.props.deleteAddPhoto.bind( this, this.props.index )}>
            <View style={[styles.imgItem]}>
                <Image style={styles.imgContent} source={{ uri: this.props.photo["uri@800"] }} />
                { this.props.photo.longitude ? null : <View style={styles.imgNoGPS}></View>}
                <View style={[styles.imgDelete, this.props.deleteIndex.indexOf(this.props.index) > -1 ? styles.imgDeleteClick : null]}>
                   <Image style={[{}, this.props.deleteIndex.indexOf(this.props.index) > -1 ? styles.imgDelete_Icon : null]}  source={{uri: 'icon_create_save'}} />
                </View>
            </View>
        </TouchableHighlight>
    )
  }
}
export default PhotoEdit;