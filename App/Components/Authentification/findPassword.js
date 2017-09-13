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
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
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
class SignupView extends Component {
    static navigatorStyle = {
        navBarHidden: true
    };
    constructor(props) {
        super(props);
        this.state = {
            pickerData: null,
            countryDialCode: null,
            phoneNumber: null,
            isSmsSended: false,
            isSmsVerified: false,
            isAgreeTerms: false,
            smsVerificationCode: null,
            smsVerificationCodeByUser: null,
            password: null,
            rePassword: null,
        }
    };
    /// For coutnry phone picker
    componentDidMount = () => {
        this.setState({
            pickerData: this.refs["phoneInput"].getPickerData()
        });
    };
    onPressFlag = () => {
        this.refs["countryPhonePicker"].open()
    };
    selectCountry = (country) => {
        this.refs["phoneInput"].selectCountry(country.iso2)
    };
    //////////////////////////

    sendSmsVerificationCode = () => {
        Keyboard.dismiss();
        if (!this.state.phoneNumber || this.state.phoneNumber.length < 4 || !this.refs["phoneInput"].getValue().replace("+", "")){
            this.refs["toast"].show(I18n.t('InputYourPhoneNumber'), 2000);
            return;
        }
        if (this.state.isSmsSended)
            return; // 이미 SMS 전송 중임
        this.setState({
            isSmsSended: true,
            countryDialCode: this.refs["phoneInput"].getValue().replace("+", ""),
        });
        //////////////
        AuthService.getVerificationCode({
            countryDialCode: this.refs["phoneInput"].getValue().replace("+", ""),
            phoneNumber: this.state.phoneNumber,
            force: true
        }).then((verificationCode) => {
            this.setState({
                smsVerificationCode: verificationCode,
            });
        }).catch((e) => {
            this.setState({
                isSmsSended: false,
            });
            if (e.message && e.message == "EmailAlreadyExists"){
                this.refs["toast"].show(I18n.t('PhoneNumberAlreadyExists'), 2000);
            }
        });
    };
    smsVerificationCodeCheck = () => {
        Keyboard.dismiss();
        if ( !this.state.smsVerificationCodeByUser ){
            this.refs["toast"].show(I18n.t('6DigitCertWrong'), 2000);
            return;
        }
        if ( this.state.smsVerificationCode.toString() != this.state.smsVerificationCodeByUser.toString()){
            this.refs["toast"].show(I18n.t('6DigitCertWrong'), 2000);
            return;
        }
        this.setState({
            smsVerificationCode: null,
            isSmsSended: false,
            isSmsVerified: true,
        })
    };
    /////////////
    startChangePassword = () => {
        Keyboard.dismiss();
        // 휴대폰 인증완료되었는가?
        if (!this.state.isSmsVerified){
            this.refs["toast"].show(I18n.t('VerifyYourPhone'), 2000);
            return;
        }
        // 비밀번호 포맷이 맞는가?
        if (this.state.password.length < 6){
            this.refs["toast"].show(I18n.t('PasswordShouldBeMoreThenSixCharacter'), 2000);
            return;
        }
        // 비밀번호 재입력했는가?
        if (this.state.rePassword != this.state.password){
            this.refs["toast"].show(I18n.t('PasswordRetypeWrong'), 2000);
            return;
        }

        // 비밀번호 변경 시작
        AuthService.changePassword({
            countryDialCode: this.state.countryDialCode,
            phoneNumber: this.state.phoneNumber,
            password: this.state.password
        }).then(( ) => {
            this.back();
        }).catch((e) => {
            if (e.message == "InvalidAuthenticationEmail" || e.message == "InvalidAuthenticationPassword"){
                console.log(e);
            }
        });
    };
    back = () => {
        this.props.dispatch(setScreen(SCREENS.LOGIN));
        this.props.navigator.pop({
            animated: true, // does the pop have transition animation or does it happen immediately (optional)
            animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
        });
    };
    close = () => {
        this.props.dispatch(setScreen(SCREENS.MAP_EDITOR));
        this.props.navigator.popToRoot({
            animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
            animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
        });
    };


    render() {
        let smsCertificationView = () => {
            if (this.state.isSmsVerified){
                return (
                    <View style={[styles.signupSection, {height: 20}]}>
                        <Text style={{fontSize: 14, textAlign:'center'}}>{I18n.t('6DigitCertComplete')}</Text>
                    </View>
                );
            }else if (this.state.smsVerificationCode ){
                return (
                    <View style={[styles.signupSection, {height: 75}]}>
                        <Text style={styles.signupSectionTitle}>{I18n.t('PleaseWrite6DigitCert')}</Text>
                        <Grid style={{height: 50}}>
                            <Col>
                                <TextInput
                                    style={[styles.signupInput, {backgroundColor: "#FFFFFF", borderRadius: 4}]}
                                    underlineColorAndroid={'#ffffff'}
                                    placeholder = {I18n.t('6DigitCert')}
                                    placeholderTextColor = "#AAAAAA"
                                    clearTextOnFocus={true}
                                    keyboardType={"phone-pad"}
                                    onChangeText={ (text) => { this.setState({ smsVerificationCodeByUser: text }) } }
                                    maxLength={30}/>
                            </Col>
                            <Col style={{width: 80}}>
                                <TouchableHighlight style={[styles.btnCert, styles.btnBlue]}
                                                    underlayColor= '#3356C0'
                                                    onPress={ this.smsVerificationCodeCheck.bind(this) }>
                                    <Text style={styles.btnBlue_Text}>{I18n.t('Certificate')}</Text>
                                </TouchableHighlight>
                            </Col>
                        </Grid>
                    </View>
                )
            }else{
                return (
                    <View style={styles.signupSection}>
                        <Text style={styles.signupSectionTitle}>{I18n.t('PhoneNumber')}</Text>
                        <View style={{height: 50}}>
                            <Grid>
                                <Col>
                                    <View style={[styles.signupBox, {height: 50}]}>
                                        <Grid style={{width: '100%', height: 50}}>
                                            <Col style={{width: 80, height: 50}}>
                                                <CountryPhoneInput ref='phoneInput'
                                                                   initialCountry={"cn"}
                                                                   showFlag={false}
                                                                   onPressFlag={this.onPressFlag} />
                                            </Col>
                                            <Col style={{height: 50}}>
                                                <TextInput
                                                    style={styles.signupInput}
                                                    underlineColorAndroid={'#ffffff'}
                                                    placeholder = {I18n.t('PhoneNumber')}
                                                    placeholderTextColor = "#AAAAAA"
                                                    clearTextOnFocus={true}
                                                    keyboardType={"phone-pad"}
                                                    onChangeText={ (text) => { this.setState({ phoneNumber: text }) } }
                                                    maxLength={30}/>
                                            </Col>
                                        </Grid>
                                    </View>
                                </Col>
                                <Col style={{width: 80}}>
                                    <TouchableHighlight style={[styles.btnCert, styles.btnBlue]}
                                                        underlayColor= '#3356C0'
                                                        onPress={ this.sendSmsVerificationCode.bind(this) }>
                                        <Text style={styles.btnBlue_Text}>{I18n.t('Certificate')}</Text>
                                    </TouchableHighlight>
                                </Col>
                            </Grid>
                        </View>
                    </View>
                );
            }
        }
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={styles.headerContainer}>
                    <TouchableHighlight
                        style={styles.headerBtn}
                        underlayColor={'rgba(255, 255, 255, 0)'}
                        onPress={ this.back.bind( this ) } >
                        <Image style={styles.headerBtnImg} source={{uri: 'icon_back_large'}} />
                    </TouchableHighlight>
                    <Text style={styles.headerTitle}>{I18n.t('FindPassword')}</Text>
                    <TouchableHighlight
                        style={styles.headerBtn}
                        underlayColor={'rgba(255, 255, 255, 0)'}
                        onPress={ this.close.bind( this ) } >
                        <Image style={styles.headerBtnImg} source={{uri: 'icon_close'}} />
                    </TouchableHighlight>
                </View>

                <View style={styles.signupContainer} >
                    { smsCertificationView() }
                    <View style={styles.signupSection}>
                        <Text style={styles.signupSectionTitle}>{I18n.t('ChangePassword')}</Text>
                        <View style={styles.signupBox}>
                            <TextInput
                                style={styles.signupInput}
                                underlineColorAndroid={'#FFFFFF'}
                                placeholder = {I18n.t('PasswordValid')}
                                placeholderTextColor = "#AAAAAA"
                                clearTextOnFocus={true}
                                secureTextEntry={true}
                                onChangeText={ (text) => { this.setState({ password: text }) } }
                                maxLength={30} />
                            <View style={styles.divider}></View>
                            <TextInput
                                style={styles.signupInput}
                                underlineColorAndroid={'#FFFFFF'}
                                placeholder = {I18n.t('RetypePassword')}
                                placeholderTextColor = "#AAAAAA"
                                clearTextOnFocus={true}
                                secureTextEntry={true}
                                onChangeText={ (text) => { this.setState({ rePassword: text }) } }
                                maxLength={30} />
                        </View>
                    </View>

                    <TouchableHighlight style={[styles.btn, styles.btnBlue]}
                                        underlayColor= '#3356C0'
                                        onPress={ this.startChangePassword.bind(this) }>
                        <Text style={styles.btnBlue_Text}>{I18n.t('ChangePassword')}</Text>
                    </TouchableHighlight>

                    <CountryPhonePicker ref='countryPhonePicker'
                                        data={this.state.pickerData}
                                        onChange={(country)=>{ this.selectCountry(country) }}
                                        cancelText='Cancel' />
                    <Toast ref="toast"/>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#F0F0F0'
    },
    ////////////
    headerContainer: {
        position: 'absolute',
        flexDirection: 'row',
        top: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                paddingTop: 25,
                height: 75,
            },
            android: {
                height: 50,
            }
        }),
        backgroundColor: "#FFFFFF",
        //zIndex: 5,
    },
    headerTitle: {
        flex: 8,
        textAlign: 'center',
        paddingTop: 15,
        fontSize: 17,
        fontWeight: 'bold'
    },
    headerBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBtnImg: {
        width: 26,
        height: 26
    },

    ////////////
    signupContainer: {
        flex: 1,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 80,
        width: '100%',
        height: '100%',
    },
    signupSection: {
        marginTop: 30,
        width: '100%',
    },
    signupSectionTitle:{
        paddingBottom: 10,
        fontSize: 15,
        fontWeight: 'bold'
    },
    signupBox: {
        width: '100%',
        borderRadius: 5,
        backgroundColor: "#ffffff",
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: "#f2f2f2"
    },
    signupInput: {
        height: 50,
        paddingLeft:10,
        fontSize: 14,
    },
    ////// Terms and privacy
    checkBox: {
        flexDirection: 'row',
        marginTop: 10,
        width: '100%',
        height: 30
    },
    checkBoxIcon: {
        marginRight: 10,
        width: 20,
        height: 20
    },
    checkBoxLink: {
        marginTop: 1.5,
        color: "#4467D1",
        fontSize: 15
    },
    checkBoxText: {
        marginTop: 1.5,
        fontSize: 15
    },
    ////// Buttons
    btn: {
        marginTop: 30,
        width: '100%',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnCert: {
        marginLeft: 10,
        width: 70,
        height: 50,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnBlue: {
        backgroundColor: '#4467D1'
    },
    btnBlue_Text: {
        color: '#FFFFFF'
    },


    //////
    back: {
        position: 'absolute',
        top: 35,
        left: 10,
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: '#C4C4C4',
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        alignItems: "center",
        //zIndex: 5
    },
})
export default connect()(SignupView);
