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
* props.navigator
* props.photo
* props.index
* props.openPhoto
*/

class PhotoView extends Component {
    render() {
        return (
            <TouchableHighlight style={[styles.imgItem, this.props.isPhotoModalOn && this.props.photoIndex == this.props.index ? styles.imgItemActive: null]}
                                underlayColor= 'rgba(48, 50, 59, 0.1)'
                                onPress={ this.props.openPhoto.bind( this, this.props.photo, this.props.index )} >
              <Image style={styles.imgContent} source={{ uri: this.props.photo["uri@800"] }} />
            </TouchableHighlight>
        )
    }
}

export default connect((state) => {
    return {
        isPhotoModalOn: state.services.modals.isPhotoModalOn,
        photoIndex: state.services.modals.photoIndex,
    };
})(PhotoView);
