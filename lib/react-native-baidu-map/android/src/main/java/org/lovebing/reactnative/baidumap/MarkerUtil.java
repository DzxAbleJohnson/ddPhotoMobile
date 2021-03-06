package org.lovebing.reactnative.baidumap;

import android.content.Context;

import com.baidu.mapapi.utils.CoordinateConverter;
import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.SimpleTarget;
import com.bumptech.glide.request.transition.Transition;
import com.facebook.react.uimanager.ThemedReactContext;

import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.Button;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.graphics.Color;
import android.graphics.PorterDuffXfermode;
import android.graphics.PorterDuff;
import android.provider.MediaStore;
import android.net.Uri;

import com.baidu.mapapi.map.BitmapDescriptor;
import com.baidu.mapapi.map.BitmapDescriptorFactory;
import com.baidu.mapapi.map.InfoWindow;
import com.baidu.mapapi.map.MapView;
import com.baidu.mapapi.map.Marker;
import com.baidu.mapapi.map.MarkerOptions;
import com.baidu.mapapi.map.OverlayOptions;
import com.baidu.mapapi.model.LatLng;
import com.facebook.react.bridge.ReadableMap;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class MarkerUtil {

    public static HashMap<String, List<Marker>> mMarkersMap = new HashMap<>();

    public static void updateMaker(Marker maker, ReadableMap option, Context context) {
        if (option.getString("locationText") == null ) return;
        Uri uri = Uri.parse(option.getString("uri@marker"));
        LatLng position = LocationUtil.getLatLngFromOption(option);
        maker.setIcon(BitmapDescriptorFactory.fromPath(uri.getPath()));
        maker.setPosition(position);
    }

    public static Marker addMarker(final MapView mapView, final String mapViewId, final int index, final ReadableMap option, Context context) {
        if (!mMarkersMap.containsKey(mapViewId)) mMarkersMap.put(mapViewId, new ArrayList<Marker>() );
        if (option.getString("locationText") == null ) return null;
        if (option.hasKey("uri@marker")){
            Uri uri = Uri.parse(option.getString("uri@marker"));
            LatLng position = LocationUtil.getLatLngFromOption(option);
            OverlayOptions overlayOptions = new MarkerOptions()
                    .icon(BitmapDescriptorFactory.fromPath(uri.getPath()))
                    .anchor(0.5f, 0.5f)
                    .position(position);
            Marker marker = (Marker)mapView.getMap().addOverlay(overlayOptions);
            marker.setTitle(Integer.toString(index));
            mMarkersMap.get(mapViewId).add(marker);
            return marker;
        } else if (option.hasKey("url@marker")) {
            SimpleTarget<Bitmap> target = new SimpleTarget<Bitmap>() {
                @Override
                public void onResourceReady(Bitmap bitmap, Transition<? super Bitmap> transition) {
                    LatLng position = LocationUtil.getLatLngFromOption(option);
                    OverlayOptions overlayOptions = new MarkerOptions()
                            .icon(BitmapDescriptorFactory.fromBitmap(bitmap))
                            .anchor(0.5f, 0.5f)
                            .position(position);
                    Marker marker = (Marker)mapView.getMap().addOverlay(overlayOptions);
                    marker.setTitle(Integer.toString(index));
                    mMarkersMap.get(mapViewId).add(marker);
                }
            };
            Glide.with(context).asBitmap().load(option.getString("url@marker")).into(target);
            return null;

        } else {
            return null;
        }
    }


}
