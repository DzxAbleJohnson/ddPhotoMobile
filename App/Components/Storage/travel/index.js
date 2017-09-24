/**
 * @providesModule Storage
 */
import React, {
  Component,
} from 'react';

import {
    Alert,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
    Image,
    Platform
} from 'react-native';


import Dimensions from 'Dimensions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';

import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import { CachedImage, CustomCachedImage } from "react-native-img-cache";

// Action
import { deleteTravel } from 'ActionTravels';
import { changeTab, setScreen, TABS, SCREENS } from 'ActionNavigation';

// Service
import * as DateUtil from 'DateUtilService';
import * as ModalsService from 'ModalsService';
import * as TravelsService from 'TravelsService';

// i18n
import I18n from 'I18n'

/*
* props.navigator
* props.index
* props.travel
*/
class Travel extends Component {
  constructor(props) {
    super(props);
  }
  openTravel = () => {
      this.props.dispatch( changeTab( TABS.TRAVEL ) );
      this.props.dispatch( setScreen( SCREENS.TRAVEL ) );
    this.props.navigator.push({
      screen: 'app.Travel', // unique ID registered with Navigation.registerScreen
      animated: true, // does the push have transition animation or does it happen immediately (optional)
      animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
      passProps: { index: this.props.index, travel: this.props.travel }
    });
  }
  clickShare = () => {
      if (this.props.uId) {
          TravelsService.share( this.props.travel );
      } else {
          Alert.alert(
              I18n.t('Signup'),
              I18n.t('PleaseSignUp'),
              [
                  {text: I18n.t('Cancel'), onPress: () => {}},
                  {text: I18n.t('Signup'), onPress: () => {
                      this.props.globalNavigator.push({
                          screen: 'app.Login', // unique ID registered with Navigation.registerScreen
                          animated: true, // does the push have transition animation or does it happen immediately (optional)
                          animationType: 'fade' // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                      });
                  }}
              ]
          )
      }
  }
  clickDelete = ( ) => {
    ModalsService.openAskModal( this.props.navigator, I18n.t('DoYouWant2Delete'), ( isRun ) => {
        if (isRun){
            TravelsService.deleteTravelApi( this.props.travel ).then(()=>{}).catch((err)=>{});
            this.props.dispatch( deleteTravel( this.props.index ) );
        }
    });
  }
  render() {
    return (
        <TouchableHighlight
            style={styles.container}
            underlayColor= 'rgba(240, 240, 240, 0.1)'
            onPress={this.openTravel.bind( this )} >
            <View>
                <View style={styles.imgContentBox}>
                    <CachedImage style={styles.imgContent} source={{uri: this.props.travel.mapImgUrl}} />
                </View>
                <View style={styles.descContent}>
                    <Text numberOfLines={1} style={styles.desc_Date}>{ DateUtil.format('llll', this.props.travel.date) }</Text>

                    { this.props.travel.titleText != null && this.props.travel.titleText != ""
                        ?   null /*<Text numberOfLines={1} style={styles.desc_Title}>{this.props.travel.titleText}</Text>*/
                        :   null
                    }
                    { this.props.travel.description != null && this.props.travel.description != ""
                        ?   <Text style={styles.desc_Desc}>{this.props.travel.description}</Text>
                        :   null
                    }
                    <Grid>
                        <Col style={{height: 25, flexDirection: 'row'}}>
                            <Image style={styles.meta_PicImg} source={{uri: "icon_storage_picture_blue"}} />
                            <Text style={styles.meta_PicText}>{this.props.travel.photos.length}{I18n.t('CountPhoto')}</Text>
                        </Col>
                        <Col style={{width: 60, height: 25}}>
                            <Menu renderer={ renderers.SlideInMenu }>
                              <MenuTrigger style={{paddingLeft: 10, paddingRight: 10}}>
                                  <Text style={styles.meta_MoreBtn}>{I18n.t('More')}</Text>
                              </MenuTrigger>
                              <MenuOptions optionsContainerStyle={styles.meta_OptionContainer}>
                                <MenuOption onSelect={ this.clickShare }>
                                    <View style={[styles.meta_Option, styles.meta_OptionFirst]}>
                                        <Image resizeMode='cover' style={styles.meta_OptionImg} source={{uri: "icon_share_white"}} />
                                        <Text style={styles.meta_OptionText}>{I18n.t('ShareLong')}</Text>
                                    </View>
                                </MenuOption>
                                  <MenuOption onSelect={ this.clickDelete }>
                                      <View style={[styles.meta_Option, styles.meta_OptionBelows]}>
                                          <Image resizeMode='cover' style={styles.meta_OptionImg} source={{uri: "icon_create_trash"}} />
                                          <Text style={styles.meta_OptionText}>{I18n.t('DeleteLong')}</Text>
                                      </View>
                                  </MenuOption>
                              </MenuOptions>
                            </Menu>
                        </Col>
                    </Grid>
                </View>
            </View>
        </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flexDirection: 'column',
        marginBottom: 10,
        backgroundColor: "#FFFFFF",
        borderColor: '#D5D5D5',
        borderWidth: 1,
        borderRadius: 3,
    },
    imgContentBox: {
        width: (Dimensions.get('window').width / 2) - 15 - 2,
        height: (Dimensions.get('window').width / 2) - 15 - 2,
    },
    imgContent: {
        width: (Dimensions.get('window').width / 2) - 15 - 2,
        height: (Dimensions.get('window').width / 2) - 15 - 2,
    },
    descContent: {
        marginBottom: 5,
        flexDirection: 'column'
    },
    desc_Date: {
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        color: "#7D7D7D",
        fontSize: 10
    },
    desc_Title: {
        marginTop: 6,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 15,
        color: "#000000",
    },
    desc_Desc: {
        marginTop: 7,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 3,
        color: "#444444",
        fontSize: 13
    },
    meta_PicImg: {
        marginTop: 5,
        marginLeft: 10,
        width: 15,
        height: 15,
        justifyContent: "center"
    },
    meta_PicText: {
        ...Platform.select({
            ios: {
                marginTop: 6,
            },
            android: {
                marginTop: 4,
            },
        }),
        marginLeft: 5,
        fontSize: 12,
        color: "#666666",
        justifyContent: "center"
    },
    meta_MoreBtn: {
        ...Platform.select({
            ios: {
                paddingTop: 6,
                paddingBottom: 10,
            },
            android: {
                paddingTop: 4,
                paddingBottom: 12,
            },
        }),
        width: 40,
        justifyContent: "center",
        fontSize: 12,
        color: '#3a5fcf',
        textAlign: 'right',
    },
    //
    meta_OptionContainer: {
        backgroundColor: 'rgba(44, 46, 56, 0.9)',
    },
    meta_Option: {
        flexDirection: 'row',
        width: '100%',
        borderBottomWidth: 1,
        borderColor: 'rgba(44, 46, 56, 0.97)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    meta_OptionFirst: {
        height: 40,
        paddingBottom: 5,
    },
    meta_OptionBelows: {
        height: 30,
        paddingBottom: 10,
    },
    meta_OptionImg: {
        width: 20,
        height: 20,
    },
    meta_OptionText: {
        marginLeft: 10,
        color: '#FFFFFF',
        fontSize: 15,
    },
});
export default connect((state) => {
    return {
        uId: state.data.auth.id,
        globalNavigator: state.services.navigation.navigator,
    };
})(Travel);