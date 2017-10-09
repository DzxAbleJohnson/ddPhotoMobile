package org.lovebing.reactnative.baidumap;


import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.utils.CoordinateConverter;
import com.facebook.react.bridge.ReadableMap;

import java.util.HashMap;

public class LocationUtil {
    public static boolean hasForeignCountry = false;
    public static LatLng getLatLngFromOption(ReadableMap option) {
        double latitude = option.getDouble("latitude");
        double longitude = option.getDouble("longitude");
        LatLng position = new LatLng(latitude, longitude);
        if (option.getString("locationText") == null) {
            return position;
        }
        HashMap countryName = new HashMap<String, Boolean>();
        countryName.put("Japan", true);
        countryName.put("Korea", true);
        countryName.put("Mongolia", true);
        countryName.put("Vietnam", true);
        countryName.put("Philippines", true);
        countryName.put("Cambodia", true);
        countryName.put("Laos", true);
        countryName.put("Thailand", true);
        countryName.put("Myanmar", true);
        countryName.put("Indonesia", true);
        countryName.put("Malaysia", true);
        countryName.put("Russia", true);
        if (isCJK(option.getString("locationText")) && !countryName.containsKey(option.getString("locationText"))){
            CoordinateConverter converter  = new CoordinateConverter();
            converter.from(CoordinateConverter.CoordType.GPS);
            converter.coord(position);
            position = converter.convert();
        } else {
            hasForeignCountry = true;
        }
        //if (!isCJK(option.getString("locationText"))) System.out.println("no Chinese3");

        return position;
    }
    public static boolean isCJK(String str){
        int length = str.length();
        for (int i = 0; i < length; i++){
            char ch = str.charAt(i);
            Character.UnicodeBlock block = Character.UnicodeBlock.of(ch);
            if (Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS.equals(block)||
                    Character.UnicodeBlock.CJK_COMPATIBILITY_IDEOGRAPHS.equals(block)||
                    Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A.equals(block)){
                return true;
            }
        }
        return false;
    }
}
