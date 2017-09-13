import { StyleSheet, Dimensions } from 'react-native';
const {height, width} = Dimensions.get('window');
const SCREEN_WIDTH = width
export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
    //borderWidth:1,
  },
  basicContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  buttonView: {
    width: SCREEN_WIDTH,
    padding: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'lightgrey',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  bottomPicker: {
    width: SCREEN_WIDTH,
  },
  box:{
    flexDirection: 'row',
  },
  flag: {
    marginTop: 15,
    marginLeft: 15,
    height: 20,
    width: 30,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#cecece',
    backgroundColor: '#FFFFFF'
  },
  text:{
    width: 80,
    height: 26,
    marginTop: 12,
    marginBottom: 12,
    fontSize: 20,
    textAlign: 'center',
  }
})