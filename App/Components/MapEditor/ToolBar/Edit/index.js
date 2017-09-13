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
import { changeTab, TABS } from 'ActionNavigation';

// i18n
import I18n from 'I18n'

/**
* props.navigator
**/
class EditToolBar extends Component {
  constructor(props) {
    super(props);
  }
  openMapStyle = () => {
    this.props.dispatch( changeTab( TABS.EDIT_MAP_STYLE ) );
  }
  openPhotoStyle = () => {
    this.props.dispatch( changeTab( TABS.EDIT_PHOTO_STYLE ) );
  }
  openRouteStyle = () => {
    this.props.dispatch( changeTab( TABS.EDIT_ROUTE_STYLE ) );
  }
  openTitleStyle = () => {
    this.props.dispatch( changeTab( TABS.EDIT_TITLE_STYLE ) );
  }

  render() {
    return (
        <View style={styles.container}>
            <TouchableHighlight
                style={styles.tab}
                underlayColor= 'rgba(44, 46, 55, 0.9)'
                onPress={this.openMapStyle.bind(this)} >
                <View style={styles.tabItem}>
                    <Image source={{uri: 'icon_edit_map'}} style={styles.tabItem_img} />
                    <Text style={styles.tabItem_txt}>{I18n.t('Map')}</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.tab}
                underlayColor= 'rgba(44, 46, 55, 0.9)'
                onPress={this.openPhotoStyle.bind(this)} >
                <View style={styles.tabItem}>
                    <Image source={{uri: 'icon_edit_picture'}} style={styles.tabItem_img} />
                    <Text style={styles.tabItem_txt}>{I18n.t('Photo')}</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.tab}
                underlayColor= 'rgba(44, 46, 55, 0.9)'
                onPress={this.openRouteStyle.bind(this)} >
                <View style={styles.tabItem}>
                    <Image source={{uri: 'icon_edit_route'}} style={styles.tabItem_img} />
                    <Text style={styles.tabItem_txt}>{I18n.t('Route')}</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.tab}
                underlayColor= 'rgba(44, 46, 55, 0.9)'
                onPress={this.openTitleStyle.bind(this)} >
                <View style={styles.tabItem}>
                    <Image source={{uri: 'icon_edit_title'}} style={styles.tabItem_img} />
                    <Text style={styles.tabItem_txt}>{I18n.t('Title')}</Text>
                </View>
            </TouchableHighlight>
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
          height: 60,
          //zIndex: 5,
          backgroundColor: 'rgba(44, 46, 55, 0.8)'
      },
      tab: {
        flex: 2.5
      },
      tabItem: {
        flexDirection: 'column',
        height: 60
      },
      tabItem_img: {
        marginTop: 5,
        width: 32,
        height: 32,
        alignSelf: 'center'
      },
      tabItem_txt: {
        marginTop: 3,
        color: '#FFFFFF',
        fontSize: 12,
        alignSelf: 'center'
      }
})

export default connect()(EditToolBar);