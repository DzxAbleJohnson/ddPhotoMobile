/**
 * @providesModule SaveMetaModal
 */

'use strict';
import React, {
    Component,
    PropTypes
} from 'react';

import {
    View,
    StyleSheet,
    Platform,
    Button,
    Text,
    Image,
    ScrollView,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    Alert
} from 'react-native';

import { connect } from 'react-redux';
import Dimensions from 'Dimensions';
import Spinner from 'react-native-spinkit';

// Actions
import * as ActionNavigation from 'ActionNavigation';

// Services
import * as TravelsService from 'TravelsService';
import * as MapEditorService from 'MapEditorService';

// i18n
import I18n from 'I18n';

/**
 * props.navigator
 **/
class SaveMetaModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: null,
            isUploading: false
        };
    }
    save = () => {
        Keyboard.dismiss();
        if (this.state.isUploading)
            return;
        this.setState({isUploading:true});
        MapEditorService.saveTravel( this.state.description ).then((travel)=>{
            this.closeModal();
            this.props.dispatch( ActionNavigation.changeTab( ActionNavigation.TABS.TRAVEL ) );
            this.props.dispatch( ActionNavigation.setScreen( ActionNavigation.SCREENS.TRAVEL ) );
            this.props.navigator.push({
                screen: 'app.Travel', // unique ID registered with Navigation.registerScreen
                animated: true, // does the push have transition animation or does it happen immediately (optional)
                animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                passProps: { index: 0, travel: travel }
            });
            // Open ShareBox
            if (this.props.uId) {
                TravelsService.share(travel);
            }
        }).catch((err)=>{
            Alert.alert(
                I18n.t('DDPhoto'), // title
                "Failed! Try Again!", // description
                [
                    {text: I18n.t('Ok'), onPress: () => this.closeModal()}
                ]
            );
        });
    }
    closeModal = () => {
        this.props.navigator.dismissLightBox();
    }
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.skip} onPress={this.save.bind(this)}>
                    <Text style={styles.skipText}>{I18n.t('Skip')}</Text>
                    <Image style={styles.skipImg} source={{uri: 'icon_create_save_skip'}} />
                </TouchableOpacity>
                <View style={ styles.modalBox }>
                    { this.props.imageUploadProgress != 0
                        ? (
                            <View style={styles.modalContainer}>
                                <Image style={styles.modalIcon} source={{uri: 'icon_modal_save_memo'}} />
                                <Spinner style={styles.modalSpinner} isVisible={true} size={70} type={'ThreeBounce'} color={'rgba(58, 95, 207, 1.0)'}/>
                                <Text style={styles.modalDescription}>{I18n.t('UploadingPhotos')}</Text>
                                <Text style={[styles.modalDescription, {fontWeight: 'bold'}]}>{(this.props.imageUploadProgress / this.props.imageUploadTotal * 100).toFixed(0)}%</Text>
                            </View>
                        ) : (
                            <View style={styles.modalContainer}>
                                <Image style={styles.modalIcon} source={{uri: 'icon_modal_save_memo'}} />
                                <Text style={styles.modalDescription}>{I18n.t('WriteDescription')}</Text>
                                <View style={styles.modalInputHeader}>
                                    <Text style={styles.modalInputHeader_Title}>{I18n.t('TravelDescription')}</Text>
                                    <Text style={styles.modalInputHeader_Count}>{ 140 - (this.state.description != null ? this.state.description.length : 0) }</Text>
                                </View>
                                <TextInput
                                    style={styles.modalInputBox}
                                    underlineColorAndroid={"#F2F2F2"}
                                    onChangeText={(text) => this.setState({ description : text })}
                                    maxLength={140}
                                    autoFocus={true}
                                    multiline={true} />
                                <View style={styles.modalRowBtns}>
                                    <TouchableHighlight style={[styles.modalBtn, styles.modalBtnBlue]}
                                                        underlayColor= '#3356C0'
                                                        onPress={this.save.bind(this)}>
                                        <Text style={styles.modalBtnBlue_Text}>{I18n.t('SaveLong')}</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        )
                    }
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    modalBox: { // 전체 Container
        position: 'absolute',
        top: (Dimensions.get('window').height / 2) - 260,
        left: (Dimensions.get('window').width / 2) - 130,
        width: 260,
        height: 520,
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
    },
    /////////////////
    skip: {
        position: 'absolute',
        flexDirection: 'row',
        ...Platform.select({
            ios: {
                top: 30,
            },
            android: {
                top: 10,
            },
        }),
        right: 10,
    },
    skipText: {
        fontSize: 14,
        color: "#3a5fcf",
        textAlign: 'center'
    },
    skipImg: {
        marginTop: 1,
        marginLeft: 5,
        width: 8,
        height: 12,
    },
    /////////////////
    modalContainer: {
        flexDirection: 'column',
        alignItems:'center',
        justifyContent:'center',
        width: 260,
        paddingTop: 20,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 1.0)',
        borderRadius: 10,
    },
    modalIcon: {
        marginBottom: 10,
        width: 60,
        height: 60
    },
    modalSpinner: {
        marginTop: -30,
        width: 70,
        height: 70,
    },
    modalDescription: {
        marginBottom: 10,
        fontSize: 14,
        color: '#565656'
    },
    ////////////
    modalInputHeader: {
        marginBottom: 5,
        height: 15,
        flexDirection: 'row',
    },
    modalInputHeader_Title: {
        flex: 8.5,
        fontSize: 12,
        color: "#000000"
    },
    modalInputHeader_Count: {
        flex: 1.5,
        fontSize: 12,
        color: "#AAAAAA"
    },
    modalInputBox: {
        width: '100%',
        height: 80,
        backgroundColor: "#F2F2F2",
        fontSize: 14,
        textAlignVertical: "top"
    },


    ////////////
    modalRowBtns: {
        marginTop: 10,
        flexDirection: 'row',
    },
    modalBtn: {
        flex: 4,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    //
    modalBtnBlue: {
        backgroundColor: '#4467D1'
    },
    modalBtnBlue_Text: {
        color: '#FFFFFF'
    },
    modalBtnWhite: {
        backgroundColor: '#FFFFFF',
        borderColor: '#4467D1',
        borderWidth: 1
    },
    modalBtnWhite_Text: {
        color: '#4467D1'
    }
})

export default connect((state) => {
    return {
        uId: state.data.auth.id,
        imageUploadProgress: state.services.mapEditor.imageUploadProgress,
        imageUploadTotal: state.services.mapEditor.imageUploadTotal
    };
})(SaveMetaModal);
