//
//  RCTBaiduMap.m
//  RCTBaiduMap
//
//  Created by lovebing on 4/17/2016.
//  Copyright © 2016 lovebing.org. All rights reserved.
//

#import "RCTBaiduMapView.h"
#import "CustomPointAnnotation.h"
#import "RCTBaiduMapViewManager.h"
#import <BaiduMapAPI_Map/BMKPolyline.h>
#import <BaiduMapAPI_Utils/BMKUtilsComponent.h>
#include "math.h"

@implementation RCTBaiduMapView {
    CustomPointAnnotation* _annotation;
    BMKPolyline *_polyline;
    NSMutableArray* _annotations;
    
}


-(void)setMarker:(NSDictionary *)option {
    NSLog(@"RCTBaiduMapView setMarker");
    if(option != nil) {
        if(_annotation == nil) {
            _annotation = [[CustomPointAnnotation alloc]init];
            [self addMarker:_annotation option:option];
        }
        else {
            [self updateMarker:_annotation option:option];
        }
    }
}

-(void)setMarkers:(NSArray *)markers {
    NSLog(@"RCTBaiduMapView setMarkers");
    int markersCount = (int)[markers count];
    if(_annotations == nil) {
        _annotations = [[NSMutableArray alloc] init];
    }
    if(markers != nil) {
        for (int i = 0; i < markersCount; i++)  {
            NSDictionary *option = [markers objectAtIndex:i];
            
            // Initializing
            CustomPointAnnotation *annotation = nil;
            if(i < [_annotations count]) {
                annotation = [_annotations objectAtIndex:i];
            }
            // Add
            if(annotation == nil) {
                annotation = [[CustomPointAnnotation alloc]init];
                [self addMarker:annotation option:option];
                [_annotations addObject:annotation];
            }
            // Update
            if(annotation != nil) {
                [self removeAnnotation:annotation];
                annotation = [[CustomPointAnnotation alloc]init];
                [self addMarker:annotation option:option];
                [_annotations replaceObjectAtIndex:i withObject:annotation];
            }
            
        }
        
        int _annotationsCount = (int)[_annotations count];

        if(markersCount < _annotationsCount) {
            int start = _annotationsCount - 1;
            for(int i = start; i >= markersCount; i--) {
                CustomPointAnnotation *annotation = [_annotations objectAtIndex:i];
                [self removeAnnotation:annotation];
                [_annotations removeObject:annotation];
            }
        }
    }
}


-(void)setPolylines:(NSArray *)polylines {
    int polylinesCount = (int)[polylines count];
    if (_polyline) {
        [self removeOverlay:_polyline];
        _polyline = nil;
    }
    if (polylinesCount < 2) {
        return;
    }
    else {
        CLLocationCoordinate2D *coords = (CLLocationCoordinate2D *)malloc(sizeof(CLLocationCoordinate2D)*polylinesCount);
        for (int i = 0; i < polylinesCount; i++) {
            NSDictionary *dic = [polylines objectAtIndex:i];
            coords[i].latitude = [RCTConvert CLLocationDegrees:[dic valueForKey:@"latitude"]];
            coords[i].longitude = [RCTConvert CLLocationDegrees:[dic valueForKey:@"longitude"]];
            
            NSDictionary* testdic = BMKConvertBaiduCoorFrom(coords[i], BMK_COORDTYPE_GPS);
            NSLog(@"x=%@,y=%@",[testdic objectForKey:@"x"],[testdic objectForKey:@"y"]);
            CLLocationCoordinate2D baiduCoor = BMKCoorDictionaryDecode(testdic);
            coords[i] = baiduCoor;
        }
        _polyline =  [BMKPolyline polylineWithCoordinates:coords count:polylinesCount];
        [self addOverlay:_polyline];
    }
}

-(void)setPolylineConfig:(NSDictionary *)polilinesDic {
    NSLog(@"======RCTBaiduMapView setPolylineConfig Old: %@", self.polilinesConfig);
    NSLog(@"======RCTBaiduMapView setPolylineConfig New : %@", polilinesDic);
    if(self.polilinesConfig == nil) {
        self.polilinesConfig = [NSMutableDictionary new];
    }
    [self.polilinesConfig removeAllObjects];
    [self.polilinesConfig setDictionary:polilinesDic];
    
    if (_polyline != nil) {
        [self removeOverlay:_polyline];
        [self addOverlay:_polyline];
    }
    
}

-(CLLocationCoordinate2D)getCoorFromMarkerOption:(NSDictionary *)option {
    NSLog(@"RCTBaiduMapView getCoorFromMarkerOption");
    double lat = [RCTConvert double:option[@"latitude"]];
    double lng = [RCTConvert double:option[@"longitude"]];
    CLLocationCoordinate2D coor;
    coor.latitude = lat;
    coor.longitude = lng;
    NSDictionary* testdic = BMKConvertBaiduCoorFrom(coor, BMK_COORDTYPE_GPS);
    NSLog(@"x=%@,y=%@",[testdic objectForKey:@"x"],[testdic objectForKey:@"y"]);
    CLLocationCoordinate2D baiduCoor = BMKCoorDictionaryDecode(testdic);
    //return [self wgs84togcj02:lng lat:lat];
    return baiduCoor;
    //return coor;
}

-(void)addMarker:(CustomPointAnnotation *)annotation option:(NSDictionary *)option {
    NSLog(@"RCTBaiduMapView addMarker");
    [self updateMarker:annotation option:option];
    [self addAnnotation:annotation];
}


-(void)updateMarker:(CustomPointAnnotation *)annotation option:(NSDictionary *)option {
    NSLog(@"RCTBaiduMapView updateMarker");
    CLLocationCoordinate2D coor = [self getCoorFromMarkerOption:option];
    NSString *title = [RCTConvert NSString:option[@"title"]];
    if(title.length == 0) {
        title = @"";
    }
    annotation.coordinate = coor;
    annotation.title = title;
    annotation.photo = option;
}

-(CLLocationCoordinate2D)wgs84togcj02:(double)lng lat:(double)lat {
    CLLocationCoordinate2D coor;
    if ([self outOfChina:lng lat:lat]) {
        coor.latitude = lat;
        coor.longitude = lng;
        return coor;
    }
    double pi = 3.1415926535897932384626;
    double a = 6378245.0;
    double ee = 0.00669342162296594323;
    
    double dlat = [self transformlat:lng - 105.0 lat:lat - 35.0];
    double dlng = [self transformlng:lng - 105.0 lat:lat - 35.0];
    double radlat = lat / 180.0 * pi;
    double magic = sin(radlat);
    magic = 1 - ee * magic * magic;
    double sqrtmagic = sqrt(magic);
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * pi);
    dlng = (dlng * 180.0) / (a / sqrtmagic * cos(radlat) * pi);
    double mglat = lat + dlat;
    double mglng = lng + dlng;
    coor.latitude = mglat;
    coor.longitude = mglng;
    return coor;
    
}
-(BOOL)outOfChina:(double)lng lat:(double)lat {
    NSLog(@"--------------------------------lng: %f, lat: %f ", lng, lat);
    if (lng < 72.004 || lng > 137.8347){
        return true;
    }
    if (lat < 0.8293 || lat > 55.8271){
        return true;
    }
    return false;
}
-(double)transformlng:(double)lng lat:(double)lat {
    double pi = 3.1415926535897932384626;
    double a = 6378245.0;
    double ee = 0.00669342162296594323;
    double ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * sqrt(fabs(lng));
    ret += (20.0 * sin(6.0 * lng * pi) + 20.0 * sin(2.0 * lng * pi)) * 2.0 / 3.0;
    ret += (20.0 * sin(lng * pi) + 40.0 * sin(lng / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * sin(lng / 12.0 * pi) + 300.0 * sin(lng / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}

-(double)transformlat:(double)lng lat:(double)lat {
    double pi = 3.1415926535897932384626;
    double a = 6378245.0;
    double ee = 0.00669342162296594323;
    double ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * sqrt(fabs(lng));
    ret += (20.0 * sin(6.0 * lng * pi) + 20.0 * sin(2.0 * lng * pi)) * 2.0 / 3.0;
    ret += (20.0 * sin(lat * pi) + 40.0 * sin(lat / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * sin(lat / 12.0 * pi) + 320 * sin(lat * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}


@end
