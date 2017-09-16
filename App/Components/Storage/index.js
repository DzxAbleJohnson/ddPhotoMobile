/**
 * @providesModule Storage2
 */
import React, {
  Component,
} from 'react';

import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
    Platform
} from 'react-native';

import Dimensions from 'Dimensions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { MenuContext } from 'react-native-popup-menu';
import * as Animatable from 'react-native-animatable';

// Actions
import { isPhotoModalOn, setPhotoIndex } from 'ActionModals';

// Components
import TabBar from 'TabBar';
import Travel from './travel';

// Services
import * as TravelsService from 'TravelsService';

// i18n
import I18n from 'I18n'
/*
* props.navigator
*/
class Storage extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.props.dispatch( isPhotoModalOn( false ) );
        this.props.dispatch( setPhotoIndex( 0 ) );
    }
    componentDidMount = () => {
        this.refs["storageContainer"].bounceInUp(700);
    }
    render() {
        var travelsLeft = this.props.travels.map(( travel, index ) => {
            if ( index % 2 == 0 )
                return <Travel key={ index } navigator={ this.props.navigator } index={ index } travel={ travel } />;
            else
                return null;
        });
        var travelsRight = this.props.travels.map(( travel, index ) => {
            if ( index % 2 == 1 )
                return <Travel key={ index } navigator={ this.props.navigator } index={ index } travel={ travel } />;
            else
                return null;
        });
        return (
            <MenuContext style={styles.container}>
                <Animatable.View ref="storageContainer" style={styles.storageContainer}>
                    <ScrollView
                        style={styles.storageScroll}
                        horizontal= {false}>
                        <View style={styles.header}>
                            <View style={styles.headerTitle}>
                                <Text style={styles.headerTitle_Text}>{I18n.t('Travels')}</Text>
                                <Text style={styles.headerTitle_Count}>{ this.props.travels.length }</Text>
                            </View>
                            <View style={styles.headerSort}>
                            </View>
                        </View>
                        <View style={styles.body}>
                            { this.props.travels.length == 0
                                ? (
                                    <View style={styles.empty}>
                                        <Image style={styles.emptyIcon} source={{uri: 'icon_storage_empty'}} />
                                        <Text style={styles.emptyText}>{I18n.t('TravelsEmpty')}</Text>
                                    </View>
                                )
                                : (
                                    <Grid>
                                        <Col size={1}>
                                            <View style={styles.leftCol}>
                                                { travelsLeft }
                                            </View>
                                        </Col>
                                        <Col size={1}>
                                            <View style={styles.rightCol}>
                                                { travelsRight }
                                            </View>
                                        </Col>
                                    </Grid>
                                )
                            }
                        </View>
                    </ScrollView>
                </Animatable.View>
            </MenuContext>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    storageContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    storageScroll: {
        flexDirection: 'column',
        backgroundColor: '#E5E5E5'
    },
    // Header
    header: {
        ...Platform.select({
            ios: {
                height: 85,
            },
            android: {
                height: 60,
            },
        }),
        flexDirection: 'row'
    },
    headerTitle: {
        flex: 8,
        flexDirection: 'row',
        ...Platform.select({
            ios: {
                paddingTop: 40,
            },
            android: {
                paddingTop: 20,
            },
        }),
        paddingLeft: 10,
    },
    headerTitle_Text: {
        ...Platform.select({
            ios: {
                marginTop: 2,
            },
        }),
        color: '#222222',
        fontSize: 19
    },
    headerTitle_Count: {
        marginLeft: 5,
        color: '#4467D1',
        fontSize: 19
    },
    headerSort: {
        flex: 2
    },

    // Body
    body: {
        flexDirection: 'column',
        paddingBottom: 10
    },
    leftCol: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 5
    },
    rightCol: {
        flex: 1,
        paddingLeft: 5,
        paddingRight: 10
    },
    empty: {
        flexDirection: 'column',
        alignItems:'center',
        justifyContent:'center'
    },
    emptyIcon: {
        marginTop: 190,
        marginBottom: 5,
        width: 50,
        height: 50
    },
    emptyText: {
        marginTop: 5,
        fontSize: 15,
        color: '#565656'
    }
})
export default connect((state) => {
  return {
    travels: state.data.travels.travels
  };
})(Storage);