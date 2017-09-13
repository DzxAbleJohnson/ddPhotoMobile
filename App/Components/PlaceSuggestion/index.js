/**
 * @providesModule PlaceSuggestion
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
    ScrollView,
    TouchableHighlight,
    Text,
    TextInput,
    Button
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';

// Actions
import { deletePhotoWithNoGPS, updateCenter } from 'ActionMapEditor2';
import { setScreen, SCREENS } from 'ActionNavigation';

// Services
import * as MapEditorService from 'MapEditorService';
import * as BaiduMapService from 'BaiduMapService';

// i18n
import I18n from 'I18n'

/**
 * props.index
 * props.navigator
 **/
class PlaceSuggestion extends Component {
    static navigatorStyle = {
        navBarHidden: true
    };
    constructor(props) {
        super(props);
        this.state = {
            currentQuery: "天安门"
        }
        this.updatePlaces("天安门");
        this.photo = this.props.photosWithNoGPS[ this.props.index ];
    }
    onChangeQuery = ( query:string ) => {
        this.setState( { currentQuery : query } );
        setTimeout( () => {
            if (this.state.currentQuery == query){
                this.updatePlaces( query );
            }
        }, 300);
    }
    updatePlaces = ( query:string ) => {
        BaiduMapService.placeSuggestion ( query );
    }
    onPlaceSelect = ( place:Place ) => {
        if ( this.photo != this.props.photosWithNoGPS[ this.props.index ])
            return;
        // 사진에 정보 넣기
        this.photo.longitude = place.longitude;
        this.photo.latitude = place.latitude;
        this.photo.locationText = place.district + " " + place.city + " " + place.name;
        // 정규 사진목록에 추가
        MapEditorService.addPhotos([ this.photo ]);
        // GPS없는 사진 목록에서 제거하기
        this.props.dispatch( deletePhotoWithNoGPS( this.props.index ) );
        // 홈으로 가기
        this.goBack();
    }
    goBack = () => {
        this.props.navigator.popToRoot({
            animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
            animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
        });
        this.props.dispatch(setScreen(SCREENS.MAP_EDITOR));
    }
    render() {
        let places = this.props.places.map((place, index) => {
            return (
                <TouchableHighlight
                    key={index}
                    style={{ width: '100%' }}
                    underlayColor= '#EAEAEA'
                    onPress={this.onPlaceSelect.bind( this, place )} >
                    <View style={styles.listItem}>
                        <Text style={styles.listTitle}>{place.name}</Text>
                        <Text style={styles.listDesc}>{place.district}, {place.city}</Text>
                    </View>
                </TouchableHighlight>
            )
        })
        return (
            <View style={styles.container}>
                <Grid>
                    <Row style={{ height: 100, backgroundColor: '#2C2E38' }}>
                        <Col style={{ width: 100 }}>
                            {  this.photo == null
                                ? null
                                : <Image style={styles.image} source={{ uri: this.photo["uri@800"] }} />
                            }
                        </Col>
                        <Col style={{ paddingLeft: 4, paddingTop: 20 }}>
                            <Text style={styles.desc}>{I18n.t('PlaceSuggestionDesc1')}</Text>
                            <Text style={styles.desc}>{I18n.t('PlaceSuggestionDesc2')}</Text>
                            <Text style={styles.desc}>{I18n.t('PlaceSuggestionDesc3')}</Text>
                        </Col>
                    </Row>
                    <Row style={{ height: 50, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#D5D5D5' }}>
                        <Col style={{ paddingLeft: 10, height: 50 }}>
                            <TextInput
                                style={styles.textInput}
                                placeholder={I18n.t('Search')}
                                underlineColorAndroid={"rgba(0, 0, 0, 0)"}
                                onChangeText={ this.onChangeQuery }/>
                        </Col>
                        <Col style={{ width: 60, height: 50 }}>
                            <TouchableHighlight
                                style={styles.cancelBtn}
                                underlayColor= 'rgba(0, 0, 0, 0.1)'
                                onPress={this.goBack.bind( this )} >
                                <Text style={styles.cancelBtn_Text}>{I18n.t('Cancel')}</Text>
                            </TouchableHighlight>
                        </Col>
                    </Row>
                    <Row>
                        <ScrollView
                            style= {styles.listContainer}
                            horizontal= {false}>
                            { places }
                        </ScrollView>
                    </Row>
                </Grid>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    textInput: {
        marginTop: 10,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 10,
        height: 30,
        backgroundColor: "#DEDEDE",
        borderRadius: 4
    },
    cancelBtn: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancelBtn_Text: {
        fontSize: 14,
        color: "#3A5FCF",
        alignSelf: 'center'
    },
    image: {
        marginTop: 10,
        marginLeft: 10,
        width: 80,
        height: 80
    },
    desc: {
        marginBottom: 3,
        fontSize: 13,
        color: '#E0E0E1'
    },
    listContainer: {
        backgroundColor: '#F2F2F2'
    },
    listItem: {
        marginLeft: 10,
        marginRight: 10,
        width: '100%',
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#D5D5D5'
    },
    listTitle: {
        marginTop: 7,
        width: '100%',
        fontSize: 15,
        color: '#000000'
    },
    listDesc: {
        marginTop: 5,
        width: '100%',
        fontSize: 13,
        color: '#888888'
    }
});


export default connect((state) => {
  return {
    photos: state.services.mapEditor.photos,
    photosWithNoGPS: state.services.mapEditor.photosWithNoGPS,
    places: state.services.placeSuggestion.places
  };
})(PlaceSuggestion);
