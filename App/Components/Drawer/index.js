/**
 * @providesModule Drawer
 */
'use strict';
import React, {
    Component,
    PropTypes
} from 'react';

import {
    View,
    StyleSheet,
    Image,
    Button,
    Text,
    TouchableHighlight,
    Linking,
    Platform
} from 'react-native';

import { connect } from 'react-redux';

// Actions
import { setRemember } from 'ActionMapEditor2';
import { setScreen, SCREENS } from 'ActionNavigation';

// Service
import * as AuthService from 'AuthService';

// i18n
import I18n from 'I18n'

class DrawerPanel extends Component {
    constructor(props) {
        super(props);
    }
    openLogin = () => {
        this.props.dispatch(setScreen(SCREENS.LOGIN));
        // 로그인화면 열기
        this.props.globalNavigator.push({
            screen: 'app.Login', // unique ID registered with Navigation.registerScreen
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'fade' // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
        });
        // Drawer 닫기
        this.props.globalNavigator.toggleDrawer({
            side: 'right', // the side of the drawer since you can have two, 'left' / 'right'
            animated: true, // does the toggle have transition animation or does it happen immediately (optional)
            to: 'closed' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
        });
    };
    openHomepage = () => {
        Linking.openURL("http://ddphoto.com.cn");
    };
    openGPSInfo = () => {
        Linking.openURL("http://ddphoto.com.cn/gpsinfo");
    };
    openRateThisApp = () =>{
        let APP_STORE_URL = 'https://itunes.apple.com/us/app/点点照/id1239701338?mt=8';
        let PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.recordfarm.recordfarm';
        if(Platform.OS =='ios'){
            Linking.openURL(APP_STORE_URL).catch(err => console.error('An error occurred', err));
        } else {
            Linking.openURL(PLAY_STORE_URL).catch(err => console.error('An error occurred', err));
        }
    }

    logout = () => {
        AuthService.logoutApi();
    };
    setRemember = (isRemember) => {
        this.props.dispatch( setRemember( isRemember ) );
    };
    render() {
        let loginMenu = () => {
            if (this.props.userName){
                return (
                    <View style={styles.sectionBtn}>
                        <Text style={styles.sectionBtn_userName}>{this.props.userName}</Text>
                        <Text style={styles.sectionBtn_logout} onPress={this.logout.bind( this )}>{I18n.t('Logout')}</Text>
                    </View>
                );
            } else {
                return (

                    <TouchableHighlight
                        style={styles.sectionBtn}
                        underlayColor= 'rgba(48, 50, 59, 0.2)'
                        onPress={this.openLogin.bind(this)}>
                        <View style={{ width: '100%', height: 45, flexDirection: "row" }}>
                            <View style={styles.sectionBtn_leftIcon}>
                                <Image source={{uri: 'icon_drawer_user'}} style={styles.sectionBtn_leftIconImage}/>
                            </View>
                            <Text style={styles.sectionBtn_text}>{I18n.t('LoginSignUp')}</Text>
                            <View style={styles.sectionBtn_rightArrow}><Image source={{uri: 'icon_arrow_right'}} style={styles.sectionBtn_rightIconImage}/></View>
                        </View>
                    </TouchableHighlight>
                );
            }
        };
        return (
            <View style={styles.container}>
                <Image source={{uri: 'drawer_bg'}} style={styles.logo}>
                    <Image source={{uri: 'drawer_logo'}} style={styles.logoImg}/>
                </Image>
                <View style={styles.section}>
                    {loginMenu()}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{I18n.t('StyleDefaultSetting')}</Text>
                    <TouchableHighlight
                        style={styles.sectionBtn}
                        underlayColor= 'rgba(48, 50, 59, 0.2)'
                        onPress={this.setRemember.bind(this, true)}>
                        <View style={{ width: '100%', height: 45, flexDirection: "row" }}>
                            <View style={styles.sectionBtn_leftIcon}>
                                <Image source={{uri: this.props.remember ? 'icon_checkbox_active' : 'icon_checkbox'}} style={styles.sectionBtn_leftIconImage}/>
                            </View>
                            <Text style={styles.sectionBtn_textWithoutRight}>{I18n.t('RememberLastStyle')}</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.sectionBtn}
                        underlayColor= 'rgba(48, 50, 59, 0.2)'
                        onPress={this.setRemember.bind(this, false)}>
                        <View style={{ width: '100%', height: 45, flexDirection: "row"}}>
                            <View style={styles.sectionBtn_leftIcon}>
                                <Image source={{uri: this.props.remember ? 'icon_checkbox' : 'icon_checkbox_active'}} style={styles.sectionBtn_leftIconImage}/>
                            </View>
                            <Text style={styles.sectionBtn_textWithoutRight}>{I18n.t('StartWithDefaultStyle')}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{I18n.t('HelpAndSupport')}</Text>
                    <TouchableHighlight
                        style={styles.sectionBtn}
                        underlayColor= 'rgba(48, 50, 59, 0.2)'
                        onPress={this.openHomepage.bind( this )}>
                        <View style={{ width: '100%', height: 45, flexDirection: "row" }}>
                            <View style={styles.sectionBtn_leftIcon}><Image source={{uri: 'icon_drawer_homepage'}} style={styles.sectionBtn_leftIconImage}/></View>
                            <Text style={styles.sectionBtn_text}>{I18n.t('Homepage')}</Text>
                            <View style={styles.sectionBtn_rightArrow}><Image source={{uri: 'icon_arrow_right'}} style={styles.sectionBtn_rightIconImage}/></View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.sectionBtn}
                        underlayColor= 'rgba(48, 50, 59, 0.2)'
                        onPress={this.openGPSInfo.bind( this )}>
                        <View style={{ width: '100%', height: 45, flexDirection: "row" }}>
                            <View style={styles.sectionBtn_leftIcon}><Image source={{uri: 'icon_drawer_gps'}} style={styles.sectionBtn_leftIconImageGps}/></View>
                            <Text style={styles.sectionBtn_text}>{I18n.t('GpsInfo')}</Text>
                            <View style={styles.sectionBtn_rightArrow}><Image source={{uri: 'icon_arrow_right'}} style={styles.sectionBtn_rightIconImage}/></View>
                        </View>
                    </TouchableHighlight>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{I18n.t('App')}</Text>
                    <TouchableHighlight
                        style={styles.sectionBtn}
                        underlayColor= 'rgba(48, 50, 59, 0.2)'
                        onPress={this.openRateThisApp.bind( this )}>
                        <View style={{ width: '100%', height: 45, flexDirection: "row" }}>
                            <View style={styles.sectionBtn_leftIcon}><Image source={{uri: 'icon_drawer_rate'}} style={styles.sectionBtn_leftIconImage}/></View>
                            <Text style={styles.sectionBtn_text}>{I18n.t('AppStoreRating')}</Text>
                            <View style={styles.sectionBtn_rightArrow}><Image source={{uri: 'icon_arrow_right'}} style={styles.sectionBtn_rightIconImage}/></View>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F3F3F3'
    },
    logo: {
        flexDirection: 'column',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoImg: {
        marginTop: 30,
        width: 120,
        height: 70,
        alignSelf: 'center'
    },
    logoVersion: {
        marginTop: 5,
        fontSize: 13,
        color: '#888888'
    },
    section: {
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#F2F2F2'
    },
    sectionTitle: {
        marginTop: 7,
        marginBottom: 7,
        marginLeft: 12,
        fontSize: 12,
        color: '#999999'
    },
    sectionBtn: {
        flexDirection: 'row',
        paddingLeft: 5,
        paddingRight: 5,
        height: 45,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderColor: '#F2F2F2',
    },
    sectionBtn_leftIcon: {
        flex: 1,
        alignSelf: 'center'
    },
    sectionBtn_leftIconImage: {
        width: 23,
        height: 23,
        alignSelf: 'center'
    },
    sectionBtn_leftIconImageGps: {
        width: 19,
        height: 19,
        alignSelf: 'center'
    },
    sectionBtn_text: {
        flex: 6,
        paddingLeft: 3,
        ...Platform.select({
            ios: {
                paddingTop: 14,
            },
            android: {
                paddingTop: 12,
            },
        }),
        height: 45,
        fontSize: 14,
        color: '#000000',
    },
    sectionBtn_textWithoutRight: {
        flex: 7,
        paddingLeft: 3,
        ...Platform.select({
            ios: {
                paddingTop: 14,
            },
            android: {
                paddingTop: 11,
            },
        }),
        height: 45,
        fontSize: 14,
        color: '#000000'
    },
    sectionBtn_rightArrow: {
        flex: 1,
        height: 20,
        alignSelf: 'center'
    },
    sectionBtn_rightIconImage: {
        width: 19,
        height: 19,
        alignSelf: 'center'
    },
    sectionBtn_userName: {
        flex: 7,
        paddingLeft: 5,
        paddingTop: 12,
        height: 45,
        fontSize: 14,
        color: '#000000'
    },
    sectionBtn_logout: {
        flex: 3,
        paddingRight: 5,
        paddingTop: 14,
        height: 45,
        fontSize: 14,
        color: '#5c7fef',
        textAlign: 'right'
    }
})

export default connect((state) => {
    return {
        remember: state.services.mapEditor.remember,
        globalNavigator: state.services.navigation.navigator,

        userName: state.data.auth.name
    };
})(DrawerPanel);
