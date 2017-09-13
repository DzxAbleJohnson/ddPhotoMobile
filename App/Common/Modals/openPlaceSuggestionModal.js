/**
 * @providesModule OpenPlaceSuggestionModal
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
    ScrollView,
    TouchableHighlight
} from 'react-native';

import { connect } from 'react-redux';

// Action
import { setScreen, SCREENS } from 'ActionNavigation';


// i18n
import I18n from 'I18n'

/**
 * props.navigator
 * props.index
 **/
class OpenGPSEditerModal extends Component {
    constructor(props) {
        super(props);
    }

    openPlaceSuggestion = () => {
        this.props.dispatch(setScreen(SCREENS.PLACE_SUGGESTION));
        this.props.navigator.push({
            screen: 'app.PlaceSuggestion', // unique ID registered with Navigation.registerScreen
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
            passProps: { index: this.props.index, navigator: this.props.navigator }
        });
        this.props.navigator.dismissLightBox();
    }

    closeModal = () => {
        this.props.navigator.dismissLightBox();
    }
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.modalIcon} source={{uri: 'icon_modal_add_gps_search'}} />
                <Text style={styles.modalDescription}>{I18n.t('NoGpsInfo')}</Text>
                <Text style={styles.modalDescription}>{I18n.t('PleaseAddGpsInfo')}</Text>
                <TouchableHighlight style={[styles.modalBtn, styles.modalBtnBlue]}
                                    underlayColor= '#3356C0'
                                    onPress={this.openPlaceSuggestion.bind(this)}>
                    <Text style={styles.modalBtnBlue_Text}>{I18n.t('AddGpsInfo')}</Text>
                </TouchableHighlight>
                <TouchableHighlight style={[styles.modalBtn, styles.modalBtnWhite]}
                                    underlayColor= '#F5F5F5'
                                    onPress={this.closeModal.bind(this)}>
                    <Text style={styles.modalBtnWhite_Text}>{I18n.t('Cancel')}</Text>
                </TouchableHighlight>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: { // 전체 Container
        flexDirection: 'column',
        alignItems:'center',
        justifyContent:'center',
        width: 260,
        padding: 30,
        backgroundColor: 'rgba(255, 255, 255, 1.0)',
        borderRadius: 10
    },
    modalIcon: {
        marginTop: 15,
        marginBottom: 20,
        width: 60,
        height: 60
    },
    modalDescription: {
        marginBottom: 7,
        fontSize: 14,
        color: '#565656'
    },

    ////////////
    modalBtn: {
        marginTop: 15,
        width: 200,
        height: 50,
        borderRadius: 25,
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

export default connect()(OpenGPSEditerModal);
