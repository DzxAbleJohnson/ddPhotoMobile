package org.lovebing.reactnative.baidumap;

import android.content.Context;

import com.baidu.mapapi.utils.CoordinateConverter;
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
import com.squareup.picasso.Picasso;
import com.squareup.picasso.Target;

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
        System.out.println(option);
        if (option.getString("locationText") == null ) return null;
        if (option.hasKey("uri@marker")){
            Uri uri = Uri.parse(option.getString("uri@marker"));
            LatLng position = LocationUtil.getLatLngFromOption(option);
            System.out.println(position);
            OverlayOptions overlayOptions = new MarkerOptions()
                    .icon(BitmapDescriptorFactory.fromPath(uri.getPath()))
                    .anchor(0.5f, 0.5f)
                    .position(position);
            Marker marker = (Marker)mapView.getMap().addOverlay(overlayOptions);
            marker.setTitle(Integer.toString(index));
            mMarkersMap.get(mapViewId).add(marker);
            return marker;
        } else if (option.hasKey("url@marker")) {
            Target target = new Target() {
                @Override
                public void onBitmapLoaded(Bitmap markerBitm, Picasso.LoadedFrom from) {
                    LatLng position = LocationUtil.getLatLngFromOption(option);
                    System.out.println(position);
                    OverlayOptions overlayOptions = new MarkerOptions()
                            .icon(BitmapDescriptorFactory.fromBitmap(markerBitm))
                            .anchor(0.5f, 0.5f)
                            .position(position);
                    Marker marker = (Marker)mapView.getMap().addOverlay(overlayOptions);
                    marker.setTitle(Integer.toString(index));
                    mMarkersMap.get(mapViewId).add(marker);
                }

                @Override
                public void onBitmapFailed(Drawable errorDrawable) {

                }

                @Override
                public void onPrepareLoad(Drawable placeHolderDrawable) {

                }
            };
            Picasso.with(context).load(option.getString("url@marker")).into(target);
            return null;

        } else {
            return null;
        }
    }


}
