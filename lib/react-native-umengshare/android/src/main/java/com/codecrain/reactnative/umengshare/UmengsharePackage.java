package com.codecrain.reactnative.umengshare;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.UMShareAPI;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class UmengsharePackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        PlatformConfig.setWeixin("wx214b007031b9617f", "124809901f4d83c99333a80b53d08663");
        PlatformConfig.setQQZone("1106182374", "lICxvhiEIs8qzl2p");
        PlatformConfig.setSinaWeibo("1424462774", "215bc0bee1eda4243790628a7776de8f", "http://sns.whalecloud.com");
        PlatformConfig.setDing("dingoabcrgiqig0yhvboo3");

        modules.add(new UmengshareModule(reactContext));
        return modules;
    }

    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
