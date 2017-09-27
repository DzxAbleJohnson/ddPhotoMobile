package com.codecrain.reactnative.umengshare;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.widget.Toast;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.ViewManager;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.ShareAction;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.media.UMImage;
import com.umeng.socialize.media.UMWeb;
import com.umeng.socialize.shareboard.SnsPlatform;
import com.umeng.socialize.utils.ShareBoardlistener;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static android.content.Context.CLIPBOARD_SERVICE;

class UmengshareModule extends ReactContextBaseJavaModule {
    private Context context;

    public UmengshareModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
    }

    /**
     * @return the name of this module. This will be the name used to {@code require()} this module
     * from javascript.
     */
    @Override
    public String getName() {
        return "UmengShare";
    }

    @ReactMethod
    public void shareTravel(final String title, final String description, final String thumbnail, final String url) {
        ShareAction sharePanel = new ShareAction(getCurrentActivity());

        sharePanel.setDisplayList(SHARE_MEDIA.WEIXIN_CIRCLE, SHARE_MEDIA.WEIXIN, SHARE_MEDIA.QQ, SHARE_MEDIA.SINA, SHARE_MEDIA.SMS, SHARE_MEDIA.DINGTALK/*,SHARE_MEDIA.FACEBOOK*/);
        if (url != null) { // URL이 있어야 copyurl 넣어줌
            sharePanel.addButton("umeng_sharebutton_copyurl", "umeng_sharebutton_copyurl", "umeng_socialize_copyurl", "umeng_socialize_copyurl");
        }
        sharePanel.setShareboardclickCallback(new ShareBoardlistener() {
                    @Override
                    public void onclick(SnsPlatform snsPlatform, SHARE_MEDIA share_media) {
                        if (snsPlatform.mShowWord.equals("umeng_sharebutton_copyurl")) {
                            Toast.makeText(getCurrentActivity(), url, Toast.LENGTH_LONG).show();
                            ClipboardManager clipboard = (ClipboardManager) context.getSystemService(CLIPBOARD_SERVICE);
                            ClipData clip = ClipData.newPlainText("label", url);
                            clipboard.setPrimaryClip(clip);
                        } else {
                            UMShareAPI mShareAPI = UMShareAPI.get( getCurrentActivity() );
                            if (!mShareAPI.isInstall(getCurrentActivity(), share_media) && share_media != SHARE_MEDIA.SMS && share_media != SHARE_MEDIA.DINGTALK && share_media != SHARE_MEDIA.SINA) {
                                System.out.println("== is not installed");
                                Toast.makeText(getCurrentActivity(), "保存没有成功，请重新保存！", Toast.LENGTH_LONG).show();
                            }

                            ShareAction shareAction = new ShareAction(getCurrentActivity());
                            if (url == null) {
                                UMImage image = new UMImage(getCurrentActivity(), thumbnail);//本地文件
                                shareAction.withMedia(image);
                            } else { // has URL
                                UMWeb web = new UMWeb(url);
                                web.setTitle(title);//标题
                                UMImage image = new UMImage(getCurrentActivity(), thumbnail);//本地文件
                                web.setThumb(image);  //缩略图
                                web.setDescription(description);//描述
                                shareAction.withMedia(web);
                            }
                            shareAction.setPlatform(share_media);
                            shareAction.setCallback(new UMShareListener() {
                                        @Override
                                        public void onStart(SHARE_MEDIA share_media) {
                                            System.out.println("UmengShare Start! ");
                                        }

                                        @Override
                                        public void onResult(SHARE_MEDIA share_media) {
                                            System.out.println("UmengShare Result! ");
                                        }

                                        @Override
                                        public void onError(SHARE_MEDIA share_media, Throwable throwable) {
                                            System.out.println("UmengShare Error! ");
                                        }

                                        @Override
                                        public void onCancel(SHARE_MEDIA share_media) {
                                            System.out.println("UmengShare Cancel! ");
                                        }
                                    });
                            shareAction.share();
                        }
                    }
                });
        sharePanel.open();
    }

    private void addCopyUrlPlatform () {
    }
}