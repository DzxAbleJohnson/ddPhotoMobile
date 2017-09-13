package org.lovebing.reactnative.baidumap;

import android.util.Log;
import android.widget.Button;
import java.util.ArrayList;
import java.util.List;

import com.baidu.mapapi.map.InfoWindow;
import com.baidu.mapapi.map.MapView;
import com.baidu.mapapi.map.Polyline;
import com.baidu.mapapi.map.PolylineOptions;
import com.baidu.mapapi.map.OverlayOptions;
import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.utils.CoordinateConverter;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

/**
 * Created by Harrison Shin on Jul 22, 2017.
 */
public class PolylineUtil {
    public static Polyline addPolylines(MapView mapView, ReadableArray options, int width, int color) {
        List<LatLng> pts = new ArrayList<LatLng>();
        for (int i = 0; i < options.size(); i++){
            LatLng pt = LocationUtil.getLatLngFromOption(options.getMap(i));
            pts.add(pt);
        }
        OverlayOptions polylines = new PolylineOptions().width(width * 2)
                .color( color ).points(pts);
        Polyline mPolyline = (Polyline) mapView.getMap().addOverlay(polylines);
        return mPolyline;
    }
}
