//
//  RCTBaiduMap.h
//  RCTBaiduMap
//
//  Created by lovebing on 4/17/2016.
//  Copyright © 2016 lovebing.org. All rights reserved.
//

#ifndef RCTBaiduMapView_h
#define RCTBaiduMapView_h

#import <React/RCTViewManager.h>
#import <React/RCTConvert+CoreLocation.h>
#import <BaiduMapAPI_Map/BMKMapView.h>
#import <BaiduMapAPI_Map/BMKPinAnnotationView.h>
#import <BaiduMapAPI_Map/BMKPointAnnotation.h>
#import <UIKit/UIKit.h>

@interface RCTBaiduMapView : BMKMapView <BMKMapViewDelegate>

@property (nonatomic, copy) RCTBubblingEventBlock onChange;
@property (nonatomic, strong) NSMutableDictionary *polilinesConfig;

-(void)setMarker:(NSDictionary *)option;
-(void)setPolylines:(NSArray *)polilines;
-(void)setPolylineConfig:(NSDictionary *)polilinesDic;
-(CLLocationCoordinate2D)wgs84togcj02:(double)lng lat:(double)lat;
-(BOOL)outOfChina:(double)lng lat:(double)lat;
-(double)transformlat:(double)lng lat:(double)lat;
-(double)transformlng:(double)lng lat:(double)lat;
@end

#endif
