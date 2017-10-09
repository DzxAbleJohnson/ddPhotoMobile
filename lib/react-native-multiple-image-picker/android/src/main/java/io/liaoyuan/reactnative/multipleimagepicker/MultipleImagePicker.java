package io.liaoyuan.reactnative.multipleimagepicker;

import android.util.Log;
import android.support.media.ExifInterface;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import cn.finalteam.rxgalleryfinal.RxGalleryFinal;
import cn.finalteam.rxgalleryfinal.imageloader.ImageLoaderType;
import cn.finalteam.rxgalleryfinal.rxbus.RxBusResultSubscriber;
import cn.finalteam.rxgalleryfinal.rxbus.event.ImageMultipleResultEvent;
import cn.finalteam.rxgalleryfinal.rxbus.event.ImageRadioResultEvent;
import cn.finalteam.rxgalleryfinal.bean.MediaBean;
import cn.finalteam.rxgalleryfinal.utils.FilenameUtils;

public class MultipleImagePicker extends ReactContextBaseJavaModule {

    private Map<String, MediaBean> assetsFromPath = new HashMap<String, MediaBean>();

    public MultipleImagePicker(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "MultipleImagePicker";
    }

    private List<MediaBean> getMediaBeanListFromPathList(ReadableArray selectedPaths) {
        List<MediaBean> result = new ArrayList<MediaBean>();
        for (int i = 0; i < selectedPaths.size(); i++) {
            String currentPath = selectedPaths.getString(i);
            if (currentPath != null && this.assetsFromPath.containsKey(currentPath)) {
                MediaBean bean = this.assetsFromPath.get(currentPath);
                if (bean != null) {
                    result.add(bean);
                }
            }
        }
        return result;
    }
    @ReactMethod
    public void launchImageGallery(ReadableMap options, final Promise promise) {
        boolean single;
        int maxImagesCount;

        if (options.hasKey("maxImagesCount")) {
            maxImagesCount = options.getInt("maxImagesCount");
        } else {
            maxImagesCount = 9;
        }

        RxGalleryFinal rxGalleryFinal = RxGalleryFinal.with(getCurrentActivity()).image();
        if (options.hasKey("selectedPaths")) {
            ReadableArray selectedPaths = options.getArray("selectedPaths");
            if (selectedPaths != null) {
                rxGalleryFinal.selected(this.getMediaBeanListFromPathList(selectedPaths));
            }
        }
        rxGalleryFinal
                .multiple()
                .maxSize(maxImagesCount)
                .imageLoader(ImageLoaderType.PICASSO)
                .subscribe(new RxBusResultSubscriber<ImageMultipleResultEvent>() {
                    @Override
                    protected void onEvent(ImageMultipleResultEvent imageMultipleResultEvent) throws Exception {
                        List<MediaBean> list = imageMultipleResultEvent.getResult();
                        WritableArray photos = new WritableNativeArray();
                        for (MediaBean bean : list) {
                            String path = bean.getOriginalPath();
                            WritableMap photo = new WritableNativeMap();
                            photo.putString("uri", path);
                            photo.putString("fileName", FilenameUtils.getName(path));
                            Date date = new Date(bean.getCreateDate() * 1000);
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
                            sdf.setTimeZone(TimeZone.getTimeZone("GMT"));
                            photo.putString("timestamp", sdf.format(date));
                            photo.putDouble("longitude", bean.getLongitude());
                            photo.putDouble("latitude", bean.getLatitude());
                            photos.pushMap(photo);
                            MultipleImagePicker.this.assetsFromPath.put(path, bean);
                        }
                        promise.resolve(photos);
                    }

                    @Override
                    public void onCompleted() {
                        super.onCompleted();
                    }
                }).openGallery();
    }


    public void getConfig() {

    }

}
