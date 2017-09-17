package cn.com.ddphoto;

import android.app.Application;
import android.app.Activity;
import android.content.Intent;
import android.view.View;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.controllers.ActivityCallbacks;
import com.facebook.react.ReactApplication;
import com.jamesisaac.rnbackgroundtask.BackgroundTaskPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;


import java.util.Arrays;
import java.util.List;

import org.lovebing.reactnative.baidumap.BaiduMapPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import io.liaoyuan.reactnative.multipleimagepicker.MultipleImagePickerPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
public class MainApplication extends NavigationApplication {

    @Override
    public boolean isDebug() {
        // Make sure you are using BuildConfig from your own application
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {

        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
                new MultipleImagePickerPackage(),
                new ImageResizerPackage(),
                new BaiduMapPackage(getApplicationContext()),
                new RNViewShotPackage(),
                new RNI18nPackage(),
                new RNFetchBlobPackage(),
                new BackgroundTaskPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }


    @Override
    public void onCreate() {
        super.onCreate();
        /*setActivityCallbacks(new ActivityCallbacks() {
            @Override
            public void onActivityStarted(Activity activity) {
                activity.getWindow().getDecorView().setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY );
            }
            @Override
            public void onActivityResumed(Activity activity) {
                activity.getWindow().getDecorView().setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY );
            }
            @Override
            public void onActivityPaused(Activity activity) {
                activity.getWindow().getDecorView().setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY );
            }

            @Override
            public void onActivityStopped(Activity activity) {
                activity.getWindow().getDecorView().setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY );
            }

            @Override
            public void onActivityDestroyed(Activity activity) {
                activity.getWindow().getDecorView().setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY );
            }
        });*/
    }
}

