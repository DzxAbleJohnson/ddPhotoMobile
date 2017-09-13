/**
 * @providesModule TitleBox2
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
  Keyboard,
  TouchableHighlight
} from 'react-native';
import { Provider } from 'react-redux';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';

// Actions
import { setTitleText, selectTitleX, selectTitleY } from 'ActionMapEditor2';
import { changeEditTitleTab, changeTab, TABS, EDIT_TITLE_TABS } from 'ActionNavigation';

// Services
import * as DateUtil from 'DateUtilService';

/*
* props.navigator
*/
class TitleBox extends Component {
  componentWillMount() {
	this.state.pan.addListener((c) => this.state._value = c);
    this.props.dispatch( selectTitleX( (( Dimensions.get('window').width / 2 ) - 70) / Dimensions.get('window').width ));
    this.props.dispatch( selectTitleY( (( Dimensions.get('window').height / 2 ) - 30 ) / Dimensions.get('window').height ));
  }
  componentWillUnmount() {
	this.state.pan.removeAllListeners();
  }
  constructor(props) {
    super(props);
    this.state = {
        pan: new Animated.ValueXY(),
        _value: {x: (Dimensions.get('window').width / 2) - 70, y: (Dimensions.get('window').height / 2) - 30}
    };
    this.state.pan.setOffset({x: (Dimensions.get('window').width / 2) - 70, y: (Dimensions.get('window').height / 2) - 30});
    this.panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderGrant: (e, gestureState) => {
		    this.state.pan.setOffset({x: this.state._value.x, y: this.state._value.y});
		    this.state.pan.setValue({x: 0, y: 0});
        },
        onPanResponderMove: Animated.event([null,{
        	dx:this.state.pan.x,
        	dy:this.state.pan.y
        }]),
        onPanResponderRelease: (e, gestureState) => {
            this.state.pan.flattenOffset();
            this.props.dispatch( selectTitleX( this.state._value.x / Dimensions.get('window').width ) );
            this.props.dispatch( selectTitleY( this.state._value.y / Dimensions.get('window').height ) );
        }
    });
  }

  focusTitleBox = ( ) => {
    this.props.dispatch( changeEditTitleTab( EDIT_TITLE_TABS.KEYBOARD ) );
    this.props.dispatch( changeTab( TABS.EDIT_TITLE_STYLE ) );
  }

  componentDidMount = () => {
      if ( this.props.tab == TABS.EDIT_TITLE_STYLE){
          const { TitleInput } = this.refs;
          TitleInput.focus();
      }

  }
  componentDidUpdate = ( prevProps ) => {
    // 타이틀 수정으로 들어가면 자동으로 포커싱
    if (this.props.tab != prevProps.tab){
        if ( this.props.tab == TABS.EDIT_TITLE_STYLE){
            const { TitleInput } = this.refs;
            TitleInput.focus();
        }
    }
    // 포커스 해제
    if (this.props.tab == TABS.EDIT_TITLE_STYLE && this.props.editTitleTab != prevProps.editTitleTab){
        if ( this.props.editTitleTab != EDIT_TITLE_TABS.KEYBOARD ){
            Keyboard.dismiss();
        }else {
            const { TitleInput } = this.refs;
            TitleInput.focus();
        }
    }
  }
  render() {
    return (
        <Animated.View
            {...this.panResponder.panHandlers}
            style={[this.props.tab == TABS.EDIT_TITLE_STYLE? styles.textBoxEditable : this.state.pan.getLayout(), styles.textBox]}>
            { this.props.tab == TABS.EDIT_TITLE_STYLE
                ? (
                    <View style={ [styles.textBoxTitle, {backgroundColor: this.props.titleBg}] }>
                        <TextInput
                            ref={"TitleInput"}
                            style={[styles.textBoxTitle_Input, {color: this.props.titleColor, textAlign: this.props.titleAlign, fontFamily: this.props.titleFont}]}
                            onChangeText={(text) => this.props.dispatch( setTitleText( text ))}
                            onFocus={ this.focusTitleBox.bind( this ) }
                            underlineColorAndroid={this.props.titleBg}
                            returnKeyType={"send"}
                            maxLength={30}
                            value={this.props.titleText} />
                    </View>
                ) : (
                    <TouchableHighlight
                        style={ [styles.textBoxTitle, {backgroundColor: this.props.titleBg}] }
                        underlayColor= {this.props.titleBg}
                        onPress={ this.focusTitleBox.bind( this ) } >
                        <Text numberOfLines={1} style={[styles.textBoxTitle_Txt, {color: this.props.titleColor, textAlign: this.props.titleAlign, fontFamily: this.props.titleFont}]}>
                            { this.props.titleText }
                        </Text>
                    </TouchableHighlight>
                )
            }
        </Animated.View>
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
    textBoxEditable: {
        top: (Dimensions.get('window').height / 2) - 140,
        left: (Dimensions.get('window').width / 2) - 70,
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
    textBoxTitle_Input: {
        width: '100%',
        height: 43,
        textAlignVertical: 'center',
        fontSize: 15
    },
});
export default connect((state) => {
  return {
    editTitleTab: state.services.navigation.editTitleTab,
    tab: state.services.navigation.tab,

    titleText: state.services.mapEditor.titleText,
    titleFont: state.services.mapEditor.titleFont,
    titleColor: state.services.mapEditor.titleColor,
    titleBg: state.services.mapEditor.titleBg,
    titleAlign: state.services.mapEditor.titleAlign,
    titleX: state.services.mapEditor.titleX,
    titleY: state.services.mapEditor.titleY
  };
})(TitleBox);