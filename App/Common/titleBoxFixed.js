/**
 * @providesModule TitleBoxFixed
 */
import React, {
  Component,
  PropTypes
} from 'react';

import {
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  Animated,
  PanResponder,
  Keyboard
} from 'react-native';
import { Provider } from 'react-redux';

import Dimensions from 'Dimensions';

import { connect } from 'react-redux';

// Services
import * as DateUtil from 'DateUtilService';

/*
* props.navigator
* props.travel
*/
class TitleBoxFixed extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={[{left: (this.props.travel.titleX * Dimensions.get('window').width), top: (this.props.travel.titleY * Dimensions.get('window').height)}, styles.textBox]}>
                <View style={ [styles.textBoxTitle, {backgroundColor: this.props.travel.titleBg}] }>
                    <Text numberOfLines={1} style={[styles.textBoxTitle_Txt, { color: this.props.travel.titleColor, textAlign: this.props.travel.titleAlign, fontFamily: this.props.travel.titleFont}]}>
                        {this.props.travel.titleText}
                    </Text>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    textBox: {
        flexDirection: 'column',
        position: 'absolute',
        width: 140,
        height: 63,
    },
    textBoxTitle: {
        paddingLeft: 5,
        paddingRight: 5,
        width: '100%',
        height: 43,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textBoxTitle_Txt: {
        width: '100%',
        fontSize: 15
    },
})
export default connect()(TitleBoxFixed);