import React, {
    Component,
} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Picker,
    Platform
} from 'react-native';

import Dimensions from 'Dimensions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import Toast, {DURATION} from 'react-native-easy-toast'

// Actions
import { setScreen, SCREENS } from 'ActionNavigation';

// i18n
import I18n from 'I18n'

// Components
import CountryPhoneInput from 'CountryPhoneInput';
import CountryPhonePicker from 'CountryPhonePicker';

// Services
import * as AuthService from 'AuthService';
/*
* props.navigator
*/
class LoginView extends Component {
    static navigatorStyle = {
        navBarHidden: true
    };
    constructor(props) {
        super(props);
        this.state = {
            pickerData: null
        }
    }
    /// For coutnry phone picker
    componentDidMount = () => {
        this.setState({
            pickerData: this.refs["phoneInput"].getPickerData(),
            phoneNumber: null,
            password: null,
            showWarn: false,
            warnText: null
        });
    }
    onPressFlag = () => {
        this.refs["countryPhonePicker"].open()
    }

    selectCountry = (country) => {
        this.refs["phoneInput"].selectCountry(country.iso2);
    }
    /////////
    startLogin = () => {

        if (!this.state.phoneNumber || this.state.phoneNumber.length < 4 || !this.refs["phoneInput"].getValue().replace("+", "")){
            this.refs["toast"].show(I18n.t('InputYourPhoneNumber'), 2000);
            return;
        }

        if (!this.state.password || this.state.password.length < 4){
            this.refs["toast"].show(I18n.t('InputYourPassword'), 2000);
            return;
        }

        // 로그인 시작
        AuthService.loginApi({
            countryDialCode: this.refs["phoneInput"].getValue().replace("+", ""),
            phoneNumber: this.state.phoneNumber,
            password: this.state.password
        }).then((userJson) => {
            this.close();
        }).catch((e) => {
            this.refs["toast"].show(I18n.t('LoginWrongEmailOrPassword'), 2000);
            if (e.message == "InvalidAuthenticationEmail"){
                this.setState({
                    showWarn: true,
                    warnText: I18n.t('LoginWrongEmailOrPassword')
                });
            }else if(e.message == "InvalidAuthenticationPassword"){
                this.setState({
                    showWarn: true,
                    warnText: I18n.t('LoginWrongEmailOrPassword')
                });
            }else{
                console.log(e);
            }
        });
    }
    goToSignup = () => {
        this.props.dispatch(setScreen(SCREENS.SIGNUP));
        this.props.navigator.push({
            screen: 'app.Signup', // unique ID registered with Navigation.registerScreen
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
        });
    }
    testPicker = () => {

    }
    close = () => {
        this.props.dispatch(setScreen(SCREENS.MAP_EDITOR));
        this.props.navigator.popToRoot({
            animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
            animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
        });
    }

    openFindPassword = () => {
        this.props.dispatch(setScreen(SCREENS.FINDPASSWORD));
        this.props.navigator.push({
            screen: 'app.FindPassword', // unique ID registered with Navigation.registerScreen
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <CountryPhonePicker
                    ref='countryPhonePicker'
                    data={this.state.pickerData}
                    onChange={(country)=>{ this.selectCountry(country) }}
                    cancelText='Cancel' />
                <Image source={{uri: 'widebg_gray'}} style={styles.contentContainer}>
                    <Image source={{uri: 'logo_large'}} style={styles.logoImg}/>
                    <KeyboardAvoidingView style={styles.loginBox} behavior="padding">
                        <Grid style={{width: '100%', height: 101}}>
                            <Row style={{height: 50}}>
                                <Col style={{width: 110}}>
                                    <CountryPhoneInput ref='phoneInput'
                                                       initialCountry={"cn"}
                                                       showFlag={true}
                                                       onPressFlag={this.onPressFlag} />
                                </Col>
                                <Col>
                                    <TextInput
                                        style={styles.loginInput}
                                        underlineColorAndroid={'#ffffff'}
                                        placeholder = {I18n.t('PhoneNumber')}
                                        placeholderTextColor = "#AAAAAA"
                                        clearTextOnFocus={true}
                                        keyboardType={"phone-pad"}
                                        onChangeText={ (text) => { this.setState({ phoneNumber: text }) } }
                                        maxLength={30}/>
                                </Col>
                            </Row>
                            <Row style={{height: 1}}>
                                <View style={styles.divider}></View>
                            </Row>
                            <Row style={{height: 50}}>
                                <TextInput
                                    style={styles.loginInput}
                                    underlineColorAndroid={'#ffffff'}
                                    placeholder = {I18n.t('Password')}
                                    placeholderTextColor = "#AAAAAA"
                                    clearTextOnFocus={true}
                                    secureTextEntry={true}
                                    onChangeText={ (text) => { this.setState({ password: text }) } }
                                    maxLength={30} />
                            </Row>
                        </Grid>
                    </KeyboardAvoidingView>
                    { this.state.showWarn
                        ? (
                            <View style={styles.warnBox}>
                                <Text style={styles.warnText}>{this.state.warnText}</Text>
                            </View>
                        ) : null
                    }
                    <TouchableHighlight style={[styles.btn, styles.btnBlue]}
                                        underlayColor= '#3356C0'
                                        onPress={ this.startLogin.bind(this) }>
                        <Text style={styles.btnBlue_Text}>{I18n.t('Login')}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={[styles.btn, styles.btnBlack]}
                                        underlayColor= '#313131'
                                        onPress={this.goToSignup.bind(this)}>
                        <Text style={styles.btnBlack_Text}>{I18n.t('Signup')}</Text>
                    </TouchableHighlight>
                    <Text style={styles.findPasswordBtn} onPress={this.openFindPassword.bind(this)}>{I18n.t('FindPassword')}</Text>

                    <TouchableOpacity
                        style={styles.back}
                        onPress={ this.close.bind( this ) } >
                        <Image style={styles.backImg} source={{uri: 'icon_back_large'}} />
                    </TouchableOpacity>
                </Image>
                <Toast ref="toast"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#F0F0F0',
    },
    contentContainer: {
        flexDirection: 'column',
        flex: 1,
        paddingLeft: 30,
        paddingRight: 30,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoImg: {
        width: 200,
        height: 100,
    },
    logoText: {
        marginTop: 5,
        fontSize: 13,
        color: '#000000'
    },
    loginBox: {
        marginTop: 30,
        marginBottom: 20,
        width: '100%',
        height: 101,
        borderRadius: 5,
        backgroundColor: "#ffffff"
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: "#f2f2f2"
    },
    loginInput: {
        width: '100%',
        height: 50,
        paddingLeft:10,
        fontSize: 14,
    },
    //////////////
    warnBox: {
        marginBottom: 10,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    warnText: {
        textAlign: 'center',
        fontSize: 14,
        color: "#8A8A8A"
    },
    ////// Buttons
    btn: {
        marginTop: 15,
        width: '100%',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnBlue: {
        backgroundColor: '#4467D1'
    },
    btnBlue_Text: {
        color: '#FFFFFF'
    },
    btnBlack: {
        backgroundColor: '#424242'
    },
    btnBlack_Text: {
        color: '#FFFFFF'
    },
    findPasswordBtn: {
        marginTop: 10,
        padding: 15,
        backgroundColor: '#F0F0F0',
        color: "#4467D1",
    },


    //////
    back: {
        position: 'absolute',
        ...Platform.select({
            ios: {
                top: 30,
            },
            android: {
                top: 5,
            }
        }),
        left: 5,
        width: 40,
        height: 40,
        alignItems: "center",
    },
    backImg: {
        marginTop: 7,
        width: 26,
        height: 26
    },
})
export default connect()(LoginView);

