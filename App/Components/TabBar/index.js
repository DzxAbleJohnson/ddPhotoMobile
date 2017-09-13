/**
 * @providesModule TabBar
 */
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
  TouchableHighlight,
    Platform
} from 'react-native';

import Dimensions from 'Dimensions';
import { connect } from 'react-redux';

// Actions
import { changeTab, TABS } from 'ActionNavigation';

// i18n
import I18n from 'I18n'

/**
* props.navigator
**/
class TabBar extends Component {
  constructor(props) {
    super(props);
  }
  openDrawer = () => {
      this.props.navigator.toggleDrawer({
        side: 'right' // the side of the drawer since you can have two, 'left' / 'right'
      });
  }
  openMapEditor = (tab) => {
    this.props.dispatch( changeTab( tab ) );
    if (tab == TABS.CREATE) {
        setTimeout(() => {
            if (this.props.scrollRef) {
                this.props.scrollRef.scrollTo({x: 0, animated: true});
            }
        }, 100)
    }
  }

  openStorage = () => {
      this.props.dispatch( changeTab(TABS.STORAGE) );
  }

  render() {
    return (
        <View style={styles.tab}>
            <TouchableHighlight
                style={styles.tabItem}
                underlayColor= '#E5E7E8'
                onPress={this.openMapEditor.bind( this, TABS.CREATE)}>
                <View>
                    <Image source={{uri: this.props.tab == TABS.CREATE ? 'icon_home_menu_create_active' : 'icon_home_menu_create' }} style={styles.tabItem_img}/>
                    <Text style={[styles.tabItem_text, this.props.tab == TABS.CREATE ? styles.tabItem_textActive : styles.tabItem_textDeactive]}>{I18n.t('Create')}</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.tabItem}
                underlayColor= '#E5E7E8'
                onPress={this.openMapEditor.bind( this, TABS.EDIT)} >
                <View>
                    <Image source={{uri: this.props.tab == TABS.EDIT ? 'icon_home_menu_edit_active' : 'icon_home_menu_edit'}} style={styles.tabItem_img}/>
                    <Text style={[styles.tabItem_text, this.props.tab == TABS.EDIT ? styles.tabItem_textActive : styles.tabItem_textDeactive]}>{I18n.t('Edit')}</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.tabItem}
                underlayColor= '#E5E7E8'
                onPress={this.openStorage.bind( this )} >
                <View>
                    <Image source={{uri: this.props.tab == TABS.STORAGE ? 'icon_home_menu_storage_active' : 'icon_home_menu_storage'}} style={styles.tabItem_img}/>
                    <Text style={[styles.tabItem_text, this.props.tab == TABS.STORAGE ? styles.tabItem_textActive : styles.tabItem_textDeactive]}>{I18n.t('Storage')}</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.tabItem}
                underlayColor= '#E5E7E8'
                onPress={this.openDrawer.bind( this )} >
                <View>
                    <Image source={{uri: 'icon_home_menu_user'}} style={styles.tabItem_img}/>
                    <Text style={[styles.tabItem_text, styles.tabItem_textDeactive]}>{I18n.t('More')}</Text>
                </View>
            </TouchableHighlight>

        </View>
    );
  }
}
const styles = StyleSheet.create({
  tab: {
      ...Platform.select({
          ios: {
              position: 'absolute',
              flexDirection: 'row',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#F6F8F9',
              borderColor: '#D5D5D5',
              borderTopWidth: 1,
              //zIndex: 10
          },
          android: {
              position: 'absolute',
              flexDirection: 'row',
              left: 0,
              right: 0,
              bottom: 0,
              height: 45,
              backgroundColor: '#F6F8F9',
              borderColor: '#D5D5D5',
              borderTopWidth: 1,
              //zIndex: 10
          }
      }),
  },
  tabItem: {
    height: 45,
    flex: 2.5,
      justifyContent: 'center',
      alignItems: 'center'
  },
  tabItem_img: {
    width: 26,
    height: 26,
    alignSelf: 'center'
  },
  tabItem_text: {
      textAlign: 'center',
    fontSize: 11
  },
  tabItem_textActive: {
    color: '#3a5fcf'
  },
  tabItem_textDeactive: {
    color: '#555555'
  }
})
export default connect((state) => {
  return {
    tab: state.services.navigation.tab,
      scrollRef: state.services.navigation.scrollRef,

    photos: state.services.mapEditor.photos
  };
})(TabBar);