import { Navigation } from 'react-native-navigation';

import MapEditor from 'MapEditor2';
import PlaceSuggestion from 'PlaceSuggestion';
import TravelView from 'TravelView';
import LoginView from './Components/Authentification/login';
import SignupView from './Components/Authentification/signup';
import TermsNPrivacyView from './Components/Authentification/termnprivacy';
import FindPasswordView from './Components/Authentification/findPassword';

import SaveModal from 'SaveModal';
import SaveMetaModal from 'SaveMetaModal';
import AlertModal from 'AlertModal';
import AskModal from 'AskModal';
import CaptureModal from 'captureModal';
import OpenPlaceSuggestionModal from 'OpenPlaceSuggestionModal';
import Drawer from 'Drawer';

import { Provider } from "react-redux";
import { persistStore } from 'redux-persist'

import { changeTab, changeEditTitleTab, wideScreen, TABS, TAB_TITLES } from 'ActionNavigation';
import { isPhotoModalOn, setPhotoIndex } from 'ActionModals';

// redux related book keeping
import store from 'Store';

function registerScreens(store, Provider) {
    Navigation.registerComponent('app.MapEditor', () => MapEditor, store, Provider);
    Navigation.registerComponent('app.PlaceSuggestion', () => PlaceSuggestion, store, Provider);
    Navigation.registerComponent('app.Travel', () => TravelView, store, Provider);
    Navigation.registerComponent('app.Login', () => LoginView, store, Provider);
    Navigation.registerComponent('app.Signup', () => SignupView, store, Provider);
    Navigation.registerComponent('app.TermsNPrivacy', () => TermsNPrivacyView, store, Provider);
    Navigation.registerComponent('app.FindPassword', () => FindPasswordView, store, Provider);

    Navigation.registerComponent('app.Modals.Save', () => SaveModal, store, Provider);
    Navigation.registerComponent('app.Modals.SaveMeta', () => SaveMetaModal, store, Provider);
    Navigation.registerComponent('app.Modals.Alert', () => AlertModal, store, Provider);
    Navigation.registerComponent('app.Modals.Ask', () => AskModal, store, Provider);
    Navigation.registerComponent('app.Modals.Capture', () => CaptureModal, store, Provider);
    Navigation.registerComponent('app.Modals.OpenPlaceSuggestionModal', () => OpenPlaceSuggestionModal, store, Provider);

    Navigation.registerComponent('app.Types.Drawer', () => Drawer, store, Provider);
}
registerScreens(store, Provider); // this is where you register all of your app's screens

var startConfig = {
    screen: {
      screen: 'app.MapEditor',
      title: 'MapEditor'
    },
    appStyle: {
    },
    drawer: {
        right: {
            screen: 'app.Types.Drawer'
        },
        disableOpenGesture: true,
        style: {
            drawerShadow: false,
            contentOverlayColor: 'rgba(0, 0, 0, 0.33)'
        }
    },
    animationType: 'fade'
};
// start the app
Navigation.startSingleScreenApp(startConfig);