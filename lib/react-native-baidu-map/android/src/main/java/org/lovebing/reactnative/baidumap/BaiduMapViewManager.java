package org.lovebing.reactnative.baidumap;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Point;
import android.net.Uri;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.graphics.Color;

import java.io.ByteArrayOutputStream;
import java.io.File;
import android.content.res.AssetManager;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.FileOutputStream;


import com.baidu.mapapi.CoordType;
import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.map.InfoWindow;
import com.baidu.mapapi.map.LogoPosition;
import com.baidu.mapapi.map.MapPoi;
import com.baidu.mapapi.map.MapStatus;
import com.baidu.mapapi.map.MapStatusUpdate;
import com.baidu.mapapi.map.MapStatusUpdateFactory;
import com.baidu.mapapi.map.MapView;
import com.baidu.mapapi.SDKInitializer;
import com.baidu.mapapi.map.MapViewLayoutParams;
import com.baidu.mapapi.map.Marker;
import com.baidu.mapapi.map.Polyline;
import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.utils.CoordinateConverter;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BaiduMapViewManager extends ViewGroupManager<MapView> {

    private static final String REACT_CLASS = "RCTBaiduMapView";
    private static String MAP_STYLE = "normal";

    private Context mContext;
    private ThemedReactContext mReactContext;

    private ReadableArray childrenPoints;
    private HashMap<String, Polyline> mPolylinesMap = new HashMap<>();
    private HashMap<String, ReadableArray> mPhotosMap = new HashMap<>();
    private HashMap<String, Integer> mPolylineWidth = new HashMap<>();
    private HashMap<String, Integer> mPolylineColor = new HashMap<>();
    private TextView mMarkerText;

    public String getName() {
        return REACT_CLASS;
    }


    public void initSDK(Context context) {
        System.out.println("====== :: initSDK");
        SDKInitializer.initialize(context);
        mContext = context;
    }

    public MapView createViewInstance(ThemedReactContext context) {
        LocationUtil.hasForeignCountry = false;
        mReactContext = context;
        /*if (MAP_STYLE.equals("normal")) {
            System.out.println("====== :: createViewInstance :: setMapCustomEnable:false");
            MapView.setMapCustomEnable( false );
        } else {
            System.out.println("====== :: createViewInstance :: setMapCustomEnable:true");
            File file = new File(mContext.getCacheDir() + "/" + MAP_STYLE + ".json");
            if(!file.exists()) {
                try{
                    AssetManager assetManager = mContext.getAssets();
                    InputStream inputStream = assetManager.open(MAP_STYLE + ".json");
                    byte[] buffer = new byte[6000];
                    inputStream.read(buffer);
                    inputStream.close();
                    FileOutputStream fos = new FileOutputStream(file);
                    fos.write(buffer);
                    fos.close();
                    System.out.println(file.getAbsolutePath());
                }catch(Exception e){
                    System.out.println(e);
                }
            }
            MapView.setMapCustomEnable( false );
            MapView.setCustomMapStylePath(mContext.getCacheDir() + "/" + MAP_STYLE + ".json");
        }*/

        /////////////// 임시코드
        File file = new File(mContext.getCacheDir() + "/midnight.json");
        if(!file.exists()) {
            try{
                AssetManager assetManager = mContext.getAssets();
                InputStream inputStream = assetManager.open("midnight.json");
                byte[] buffer = new byte[6000];
                inputStream.read(buffer);
                inputStream.close();
                FileOutputStream fos = new FileOutputStream(file);
                fos.write(buffer);
                fos.close();
            }catch(Exception e){
                System.out.println(e);
            }
        }
        MapView.setCustomMapStylePath(mContext.getCacheDir() + "/midnight.json");
        //////////

        MapView mapView =  new MapView(context);
        mapView.getMap().setBuildingsEnabled(false);
        mapView.getMap().setCompassEnable(false);
        mapView.getMap().setIndoorEnable(false);
        mapView.getMap().setTrafficEnabled(false);
        mapView.getMap().getUiSettings().setOverlookingGesturesEnabled(false);
        mapView.getMap().getUiSettings().setRotateGesturesEnabled(false);
        mapView.getMap().getUiSettings().setCompassEnabled(false);
        setListeners(mapView);
        if (!MAP_STYLE.equals("normal")) {
            MapView.setMapCustomEnable(true);
        }
        return mapView;
    }

    @Override
    public void addView(MapView parent, View child, int index) {
        if(childrenPoints != null) {
            Point point = new Point();
            ReadableArray item = childrenPoints.getArray(index);
            if(item != null) {
                point.set(item.getInt(0), item.getInt(1));
                MapViewLayoutParams mapViewLayoutParams = new MapViewLayoutParams
                        .Builder()
                        .layoutMode(MapViewLayoutParams.ELayoutMode.absoluteMode)
                        .point(point)
                        .build();
                parent.addView(child, mapViewLayoutParams);
            }
        }
    }

    @ReactProp(name="center")
    public void setCenter(MapView mapView, ReadableMap option) {
        if(option != null) {
            LatLng position = LocationUtil.getLatLngFromOption(option);
            int zoom = option.getInt("zoom");
            MapStatusUpdate mapStatusUpdate = MapStatusUpdateFactory.newLatLngZoom(position, zoom);
            mapView.getMap().animateMapStatus(mapStatusUpdate);
        }
    }

    @ReactProp(name = "zoomControlsVisible")
    public void setZoomControlsVisible(MapView mapView, boolean zoomControlsVisible) {
        mapView.showZoomControls(zoomControlsVisible);
    }

    @ReactProp(name="trafficEnabled")
    public void setTrafficEnabled(MapView mapView, boolean trafficEnabled) {
        mapView.getMap().setTrafficEnabled(trafficEnabled);
    }

    @ReactProp(name="baiduHeatMapEnabled")
    public void setBaiduHeatMapEnabled(MapView mapView, boolean baiduHeatMapEnabled) {
        mapView.getMap().setBaiduHeatMapEnabled(baiduHeatMapEnabled);
    }

    @ReactProp(name = "mapType")
    public void setMapType(MapView mapView, int mapType) {
        //mapView.getMap().setMapType(mapType);
    }

    @ReactProp(name="mapStyle")
    public void setMapStyle(MapView mapView, String mapStyle) {
        MAP_STYLE = mapStyle; // normal, light, dark, googlelite, grassgreen, midnight, pink, grayscale, hardedge
        if (!MAP_STYLE.equals("normal")) {
            MapView.setMapCustomEnable(true);
        } else {
            MapView.setMapCustomEnable(false);
        }
    }

    @ReactProp(name="marker")
    public void setMarker(MapView mapView, ReadableMap option) {
    }

    @ReactProp(name="markers")
    public void setMarkers(MapView mapView, ReadableArray options) {
        String key = Integer.toString(mapView.getId());
        mPhotosMap.put(key, options);
        if (MarkerUtil.mMarkersMap.containsKey(key)) {
            for (int i = 0; i < MarkerUtil.mMarkersMap.get(key).size(); i++) {
                MarkerUtil.mMarkersMap.get(key).get(i).remove();
            }
        }
        for (int i = 0; i < options.size(); i++) {
            ReadableMap option = options.getMap(i);
            MarkerUtil.addMarker(mapView, key, i, option, mReactContext);
        }
    }

    @ReactProp(name="polylines")
    public void setPolylines(MapView mapView, ReadableArray options) {
        String key = Integer.toString(mapView.getId());
        mPhotosMap.put(key, options);
        Polyline polylines = mPolylinesMap.get(key);
        // 기존 폴리라인 삭제
        if (polylines != null)
            polylines.remove();
        if (options.size() < 2)
            return;
        // width가 0이면 만들지 않음
        if (mPolylineWidth.get(key) == 0)
            return;

        // 폴리라인 만들기
        if (mPolylineWidth.get(key) == null)
            mPolylineWidth.put(key, 2);
        if (mPolylineColor.get(key) == null)
            mPolylineColor.put(key, Color.parseColor("#0c0c0c"));
        mPolylinesMap.put(key, PolylineUtil.addPolylines(mapView, options, mPolylineWidth.get(key), mPolylineColor.get(key)));
    }

    @ReactProp(name="polylineConfig")
    public void setPolylineConfig(MapView mapView, ReadableMap option) {
        if(option == null)
            return;
        String key = Integer.toString(mapView.getId());
        int width = option.getInt("width");
        int color = Color.parseColor(option.getString("color"));
        mPolylineWidth.put(key, width );
        mPolylineColor.put(key, color );
        if (mPhotosMap.get(key) != null)
            setPolylines( mapView, mPhotosMap.get(key));
    }

    @ReactProp(name = "childrenPoints")
    public void setChildrenPoints(MapView mapView, ReadableArray childrenPoints) {
        this.childrenPoints = childrenPoints;
    }


    @ReactProp(name = "takeSnapshot")
    public void setTakeSnapshot(final MapView mapView, ReadableMap option) {
        if (option.hasKey("run") && option.getBoolean("run")){
            mapView.getMap().snapshot(new BaiduMap.SnapshotReadyCallback(){
                @Override
                public void onSnapshotReady(Bitmap bmSnapshot) {
                    // Add Logo
                    int id = mContext.getResources().getIdentifier("logo_large", "drawable", mContext.getPackageName());
                    Bitmap bmLogo = BitmapFactory.decodeResource(mContext.getResources(), id);
                    bmLogo = Bitmap.createScaledBitmap(bmLogo, 205, 102, true);
                    Bitmap bmResult = Bitmap.createBitmap(bmSnapshot.getWidth(), bmSnapshot.getHeight(), Bitmap.Config.ARGB_8888);
                    Canvas canvasResult = new Canvas(bmResult);
                    canvasResult.drawBitmap(bmSnapshot, 0, 0, null);
                    canvasResult.drawBitmap(bmLogo, bmSnapshot.getWidth() - 240, bmSnapshot.getHeight() - 120, null);

                    // Save the resulting image
                    File path = mContext.getCacheDir();
                    File snapshotFile = new File(path, Long.toString(new Date().getTime()) + ".jpg");
                    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                    bmResult.compress(Bitmap.CompressFormat.JPEG, 90, outputStream);
                    byte[] bitmapData = outputStream.toByteArray();
                    try {
                        outputStream.flush();
                        outputStream.close();

                        FileOutputStream fos = new FileOutputStream(snapshotFile);
                        fos.write(bitmapData);
                        fos.flush();
                        fos.close();
                    } catch (Exception e){
                        e.printStackTrace();
                    } finally {
                        // If resizedImagePath is empty and this wasn't caught earlier, throw.
                        if (snapshotFile.isFile()) {
                            WritableMap response = Arguments.createMap();
                            response.putString("path", snapshotFile.getAbsolutePath());
                            response.putString("uri", Uri.fromFile(snapshotFile).toString());
                            response.putString("name", snapshotFile.getName());
                            response.putDouble("size", snapshotFile.length());
                            sendEvent(mapView, "onTakeSnapshot", response);
                        } else {
                            WritableMap response = Arguments.createMap();
                            sendEvent(mapView, "onTakeSnapshot", response);
                        }
                    }
                }
            });
        }
    }

    /**
     *
     * @param mapView
     */
    private void setListeners(final MapView mapView) {
        BaiduMap map = mapView.getMap();

        if(mMarkerText == null) {
            mMarkerText = new TextView(mapView.getContext());
            mMarkerText.setBackgroundResource(R.drawable.popup);
            mMarkerText.setPadding(32, 32, 32, 32);
        }
        map.setOnMapStatusChangeListener(new BaiduMap.OnMapStatusChangeListener() {

            private WritableMap getEventParams(MapStatus mapStatus) {
                WritableMap writableMap = Arguments.createMap();
                WritableMap target = Arguments.createMap();
                target.putDouble("latitude", mapStatus.target.latitude);
                target.putDouble("longitude", mapStatus.target.longitude);
                writableMap.putMap("target", target);
                writableMap.putDouble("zoom", mapStatus.zoom);
                writableMap.putDouble("overlook", mapStatus.overlook);
                return writableMap;
            }

            @Override
            public void onMapStatusChangeStart(MapStatus mapStatus) {
                sendEvent(mapView, "onMapStatusChangeStart", getEventParams(mapStatus));
            }

            @Override
            public void onMapStatusChangeStart(MapStatus mapStatus, int i) {

            }
            @Override
            public void onMapStatusChange(MapStatus mapStatus) {
                sendEvent(mapView, "onMapStatusChange", getEventParams(mapStatus));
            }

            @Override
            public void onMapStatusChangeFinish(MapStatus mapStatus) {
                if(mMarkerText.getVisibility() != View.GONE) {
                    mMarkerText.setVisibility(View.GONE);
                }
                sendEvent(mapView, "onMapStatusChangeFinish", getEventParams(mapStatus));
            }
        });

        map.setOnMapLoadedCallback(new BaiduMap.OnMapLoadedCallback() {
            @Override
            public void onMapLoaded() {
                sendEvent(mapView, "onMapLoaded", null);
            }
        });

        map.setOnMapClickListener(new BaiduMap.OnMapClickListener() {
            @Override
            public void onMapClick(LatLng latLng) {
                mapView.getMap().hideInfoWindow();
                WritableMap writableMap = Arguments.createMap();
                writableMap.putDouble("latitude", latLng.latitude);
                writableMap.putDouble("longitude", latLng.longitude);
                sendEvent(mapView, "onMapClick", writableMap);
            }

            @Override
            public boolean onMapPoiClick(MapPoi mapPoi) {
                WritableMap writableMap = Arguments.createMap();
                writableMap.putString("name", mapPoi.getName());
                writableMap.putString("uid", mapPoi.getUid());
                writableMap.putDouble("latitude", mapPoi.getPosition().latitude);
                writableMap.putDouble("longitude", mapPoi.getPosition().longitude);
                sendEvent(mapView, "onMapPoiClick", writableMap);
                return true;
            }
        });
        map.setOnMapDoubleClickListener(new BaiduMap.OnMapDoubleClickListener() {
            @Override
            public void onMapDoubleClick(LatLng latLng) {
                WritableMap writableMap = Arguments.createMap();
                writableMap.putDouble("latitude", latLng.latitude);
                writableMap.putDouble("longitude", latLng.longitude);
                sendEvent(mapView, "onMapDoubleClick", writableMap);
            }
        });

        map.setOnMarkerClickListener(new BaiduMap.OnMarkerClickListener() {
            @Override
            public boolean onMarkerClick(Marker marker) {
                String key = Integer.toString(mapView.getId());
                mapView.getMap().hideInfoWindow();
                WritableMap writableMap = Arguments.createMap();
                WritableMap position = Arguments.createMap();
                position.putDouble("latitude", marker.getPosition().latitude);
                position.putDouble("longitude", marker.getPosition().longitude);
                writableMap.putMap("position", position);
                writableMap.putString("title", marker.getTitle());
                writableMap.putInt("index", Integer.parseInt(marker.getTitle()));
                sendEvent(mapView, "onMarkerClick", writableMap);
                return true;
            }
        });

    }

    /**
     *
     * @param eventName
     * @param params
     */
    private void sendEvent(MapView mapView, String eventName, @Nullable WritableMap params) {
        WritableMap event = Arguments.createMap();
        event.putMap("params", params);
        event.putString("type", eventName);
        mReactContext
                .getJSModule(RCTEventEmitter.class)
                .receiveEvent(mapView.getId(),
                        "topChange",
                        event);
    }



    @ReactMethod
    public void takeSnapshot(MapView mapView, final Callback successCb, final Callback failureCb) {

    }
}
