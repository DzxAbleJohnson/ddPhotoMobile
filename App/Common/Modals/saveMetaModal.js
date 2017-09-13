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
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';

import { connect } from 'react-redux';
import Dimensions from 'Dimensions';

// Actions
import { changeTab, TABS } from 'ActionNavigation';

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
        MapEditorService.saveTravel( this.state.description ).then(()=>{
            this.props.dispatch( changeTab(TABS.STORAGE) );
            this.closeModal();
        }).catch((err)=>{});
    }
    closeModal = () => {
        this.props.navigator.dismissLightBox();
    }
    render() {
        return (
            <View style={ this.props.imageUploadProgress != 0 ? styles.container : styles.containerKeyboard }>
                { this.props.imageUploadProgress != 0
                    ? (
                        <View style={styles.modalContainer}>
                            <Image style={styles.modalIcon} source={{uri: 'icon_modal_save_memo'}} />
                            <Text style={styles.modalDescription}>{I18n.t('UploadingPhotos')}</Text>
                            <Text style={[styles.modalDescription, {fontWeight: 'bold'}]}>{this.props.imageUploadProgress} / {this.props.imageUploadTotal}</Text>
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
                <View style={{height: 240}}>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    containerKeyboard: { // 전체 Container
        width: 260,
        height: 520,
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
    },
    container: { // 전체 Container
        width: 260,
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
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
        imageUploadProgress: state.services.mapEditor.imageUploadProgress,
        imageUploadTotal: state.services.mapEditor.imageUploadTotal
    };
})(SaveMetaModal);
