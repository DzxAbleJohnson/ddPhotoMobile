/**
 * @providesModule ModalsService
 */

import store from 'Store';


// 위치정보 저장 팝업
export const openPlaceSuggestionModal = ( navigator, index ) => {
     navigator.dismissLightBox();
     navigator.showLightBox({
       screen: "app.Modals.OpenPlaceSuggestionModal",
       passProps: {navigator: navigator, index: index},
       style: {
          backgroundBlur: "light", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
          backgroundColor: "rgba(0, 0, 0, 0.3)", // tint color for the background, you can specify alpha here (optional)
          tapBackgroundToDismiss: true
       }
     });
}

// Travel 저장하기 팝업
export const openSaveModal = ( navigator ) => {
     navigator.dismissLightBox();
     navigator.showLightBox({
       screen: "app.Modals.Save",
       passProps: { navigator: navigator },
       style: {
        backgroundBlur: "light", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
        backgroundColor: "rgba(0, 0, 0, 0.3)", // tint color for the background, you can specify alpha here (optional)
        tapBackgroundToDismiss: true
       }
     });
}

// Travel 저장하기에서 설명입력 팝업
export const openSaveMetaModal = ( navigator  ) => {
     navigator.dismissLightBox();
     setTimeout(function(){
         navigator.showLightBox({
           screen: "app.Modals.SaveMeta",
           passProps: {navigator: navigator },
           style: {
              backgroundBlur: "light", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
              backgroundColor: "rgba(0, 0, 0, 0.3)", // tint color for the background, you can specify alpha here (optional)
              tapBackgroundToDismiss: false
           }
         });
     }, 700); // 이렇게 원래 처리하면 안됨. 시간 상 이렇게 처리.

}

// 알람창
export const openAlertModal = ( navigator, text ) => {
     navigator.dismissLightBox();
     navigator.showLightBox({
       screen: "app.Modals.Alert", // unique ID registered with Navigation.registerScreen
       passProps: { navigator: navigator, text: text }, // simple serializable object that will pass as props to the modal (optional)
       style: {
          backgroundBlur: "light", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
          backgroundColor: "rgba(0, 0, 0, 0.3)", // tint color for the background, you can specify alpha here (optional)
          tapBackgroundToDismiss: true
       }
     });
}

// 질문창
export const openAskModal = ( navigator, text, event ) => {
     navigator.dismissLightBox();
     navigator.showLightBox({
       screen: "app.Modals.Ask", // unique ID registered with Navigation.registerScreen
       passProps: { navigator: navigator, text: text, event: event }, // simple serializable object that will pass as props to the modal (optional)
       style: {
          backgroundBlur: "light", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
          backgroundColor: "rgba(0, 0, 0, 0.3)", // tint color for the background, you can specify alpha here (optional)
          tapBackgroundToDismiss: true
       }
     });
}

// 캡쳐 팝업
export const openCaptureModal = ( navigator, uri ) => {
     navigator.dismissLightBox();
     navigator.showLightBox({
       screen: "app.Modals.Capture", // unique ID registered with Navigation.registerScreen
       passProps: { navigator: navigator, uri: uri }, // simple serializable object that will pass as props to the modal (optional)
       style: {
          backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
          backgroundColor: "rgba(0, 0, 0, 0.3)", // tint color for the background, you can specify alpha here (optional)
          tapBackgroundToDismiss: true
       }
     });
}
