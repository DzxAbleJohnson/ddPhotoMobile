/**
 * @providesModule TimelineView
 */

import React, {
  Component,
} from 'react';

import {
  View,
  Text,
  WebView,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
    Image
} from 'react-native';

import Dimensions from 'Dimensions';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { CachedImage } from "react-native-img-cache";

// Actions
import { wideScreen } from 'ActionNavigation';

// Services
import * as DateUtil from 'DateUtilService';

/*
* props.navigator
* props.travel
*/
class TimelineView extends Component {
    constructor(props) {
        super(props);
        this.state = {
          decoBgHeight: 10
        }
    }
    componentDidMount() {
        /*Image.getSize('icon_timeline_bgicon', (width, height) => {
            height = ( Dimensions.get('window').width / width ) * height;
            this.setState({decoBgHeight: height});
        });*/
    }
    onScroll = ( e ) => {
        if (e.nativeEvent.contentOffset.y <= 0){
            this.props.dispatch( wideScreen( false ) );
        }else{
            this.props.dispatch( wideScreen( true ) );
        }
    }

    render() {
        var photos = this.props.travel.photos.map(( photo, index ) => {
            return (
                <Grid key={ index } style={{height: 105}}>
                    <Col style={{width: 44}}>
                        <View style={styles.photoIndexContainer}>
                            <View style={[styles.photoIndexTopBorder, index == 0 ? null : styles.photoIndexBorder]}></View>
                            <View style={ index == 0 || index == (this.props.travel.photos.length - 1) ? styles.photoIndexEdge : styles.photoIndex }>
                                <Text style={ index == 0 || index == (this.props.travel.photos.length - 1) ? styles.photoIndexEdge_Txt : styles.photoIndex_Txt }>
                                    { index == 0 ? "IN" : null }
                                    { index != 0 && index != (this.props.travel.photos.length - 1) ? index + 1 : null }
                                    { index == (this.props.travel.photos.length - 1) && index != 0 ? "OUT" : null }
                                </Text>
                            </View>
                            <View style={[styles.photoIndexBottomBorder, index == (this.props.travel.photos.length - 1) ? null : styles.photoIndexBorder]}></View>
                        </View>
                    </Col>
                    <Col style={{width: 80, borderRadius: 5}}>
                        <CachedImage style={styles.photo} source={{uri: photo["url@800"]}} mutable />
                    </Col>
                    <Col>
                        <View style={styles.photoDesc}>
                            <Text numberOfLines={1} style={styles.photoDesc_Date}>{ DateUtil.format('llll', photo.date) }</Text>
                            <Text numberOfLines={2} style={styles.photoDesc_Address}>{ photo.locationText }</Text>
                        </View>
                    </Col>
                </Grid>
            )
        });
        return (
            <View style={styles.container}>
              <ScrollView
                  contentContainerStyle={styles.timelineContainer}
                  onScroll={ this.onScroll }>
                <View style={[{backgroundColor: this.props.travel.titleBg}, styles.timelineTitle]}>
                  <Text numberOfLines={1} style={[{color: this.props.travel.titleColor, fontFamily: this.props.travel.titleFont }, styles.timelineTitle_Txt ]}>{ this.props.travel.titleText != null && this.props.travel.titleText != "" ? this.props.travel.titleText : DateUtil.format('llll', this.props.travel.date) }</Text>
                </View>
                <Text numberOfLines={1} style={styles.timelineDate}>{ DateUtil.format('ll', this.props.travel.photos[0].date) } ~ { DateUtil.format('ll', this.props.travel.photos[this.props.travel.photos.length - 1].date) }</Text>
                  { photos }
              </ScrollView>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#E5E5E5'
    },
    timelineContainer: {
        flexDirection: "column",
        alignItems: "center",
    },
    timelineTitle: {
        marginTop: 73,
        marginLeft: 10,
        marginRight: 10,
        paddingLeft: 15,
        paddingRight: 15,
        height: 30,
        borderRadius: 20,
    },
    timelineTitle_Txt: {
        marginTop: 7,
        textAlignVertical: 'center',
        fontSize: 15,
    },
    timelineDate: {
        marginTop: 5,
        marginBottom: 15,
        fontSize: 10
    },
    photoIndexContainer: {
        flexDirection: "column",
        width: 24,
        marginLeft: 10,
        marginRight: 10,
    },
    photoIndexTopBorder: {
        marginLeft: 11.5,
        width: 0,
        height: 28,
    },
    photoIndexBottomBorder: {
        marginLeft: 11.5,
        width: 0,
        height: 63,
    },
    photoIndexBorder: {
        borderStyle: 'dotted',
        borderWidth: 0.5,
        borderColor: "#AAAAAA",
    },
    photoIndex: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#3A5FCF"
    },
    photoIndex_Txt: {
        marginTop: 6,
        color: "#FFFFFF",
        fontSize: 11,
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: "rgba(0, 0, 0, 0)",
    },
    photoIndexEdge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#122A74",
    },
    photoIndexEdge_Txt: {
        marginTop: 6,
        color: "#FFFFFF",
        fontSize: 9,
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: "rgba(0, 0, 0, 0)",
    },
    photo: {
        width: 80,
        height: 80,
        borderRadius: 4
    },
    photoDesc: {
        flexDirection: "column",
        height: 80,
        marginLeft: 10,
        marginRight: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
    },
    photoDesc_Date: {
        marginTop: 10,
        color: "#777777",
        fontSize: 12
    },
    photoDesc_Address: {
        marginTop: 7,
        fontSize: 13,
        color: "#000000"
    },
});

export default connect((state) => {
    return {
        wideScreen: state.services.navigation.wideScreen
    };
})(TimelineView);

