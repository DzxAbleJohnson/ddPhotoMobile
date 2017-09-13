import {
    StyleSheet,
    Platform
} from 'react-native';

import Dimensions from 'Dimensions';
export const styles = StyleSheet.create({
    container: { // 전체 Container
        position: 'absolute',
        flexDirection: 'column',
        left: 0,
        right: 0,
        bottom: 45,
        height: 120,
        //zIndex: 8,
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    headerDeleteBtn: {  // 상단삭제 버튼
        position: 'absolute',
        bottom: 85,
        right: 0,
        width: 65,
        height: 35,
        backgroundColor: 'rgba(44, 46, 55, 0.8)',
        borderTopLeftRadius: 8,
        //zIndex: 1
    },
    headerDeleteBtnInside: {
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
        height: 35
    },
    headerBtnImg: {
        marginRight: 3,
        width: 15,
        height: 15,
        alignSelf: 'center'
    },
    headerBtnText: {
        color: '#F1F2Fb',
        fontSize: 14
    },

    /////////////////////////
    bodyContainer: {  // 이미지 스크롤 부분
        flexDirection: 'row',
        marginTop: 35,
        height: 85,
        backgroundColor: 'rgba(44, 46, 55, 0.8)',
        //zIndex: 1
    },
    imgScroll: {
    },
    imgItem: {
        position: 'relative',
        marginTop: 8,
        marginLeft: 8,
        width: 69,
        height: 69
    },
    imgItemActive: {
        borderWidth: 2,
        borderColor: '#7EACFF',
    },
    imgAddBtn: {
        backgroundColor: 'rgba(48, 50, 59, 0.9)',
        borderRadius: 5
    },
    imgAddBtnIcon: {
        marginTop: 19,
        width: 30,
        height: 30,
        alignSelf: 'center'
    },
    imgGuideBox: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgGuide: {
        position: 'relative',
        overflow: 'visible',
        marginLeft: 8,
        width: 200,
        height: 30,
        backgroundColor: '#3a5fcf',
        borderRadius:20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgGuideText: {
        fontSize: 15,
        color: '#F1F2Fb',
        alignSelf: 'center'
    },
    imgGuideSpeechBubble: {
        position: 'absolute',
        left: 5,
        bottom: 17,
        width: 20,
        height: 20,
    },
    imgNoGPS: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        borderStyle: 'dotted',
        borderWidth: 2,
        borderColor: '#CCCCCC',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    imgContent: {
        width: '100%',
        height: '100%'
    },
    imgDelete: {
        position: 'absolute',
        right: 1,
        top: 1,
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.7)',
        alignItems:'center',
        justifyContent:'center',
    },
    imgDeleteClick: {
        backgroundColor: '#E32020',
    },
    imgDelete_Icon: {
        width: 13,
        height: 13
    }
})