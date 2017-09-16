//
//  RCTBaiduMapViewManager.m
//  RCTBaiduMap
//
//  Created by lovebing on Aug 6, 2016.
//  Copyright © 2016 lovebing.org. All rights reserved.
//

#import "RCTBaiduMapViewManager.h"
#import "UIColor+HexString.h"
#import "CustomAnnotationView.h"
#import "CustomPointAnnotation.h"
#import <BaiduMapAPI_Map/BMKPolylineView.h>
#import <BaiduMapAPI_Utils/BMKUtilsComponent.h>
#import <BaiduMapAPI_Map/BMKTileLayer.h>

@implementation RCTBaiduMapViewManager {
   NSString *_mapStyle;
   NSString *_zoom;
}

RCT_EXPORT_MODULE(RCTBaiduMapView)

RCT_EXPORT_VIEW_PROPERTY(mapType, int)
RCT_EXPORT_VIEW_PROPERTY(trafficEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(baiduHeatMapEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(marker, NSDictionary*)
RCT_EXPORT_VIEW_PROPERTY(markers, NSArray*)

RCT_EXPORT_VIEW_PROPERTY(polylines, NSArray*)
RCT_EXPORT_VIEW_PROPERTY(polylineConfig, NSDictionary*)
RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(center, CLLocationCoordinate2D, RCTBaiduMapView) {
   NSDictionary *centerDic = [[NSDictionary alloc] init];
   centerDic = json;
   NSLog(@"RCTBaiduMapViewManager centerJson: %@", json);
   
   float zoomLevel = [RCTConvert float:[centerDic valueForKey:@"zoom"]];
   NSDictionary* testdic = BMKConvertBaiduCoorFrom(json ? [RCTConvert CLLocationCoordinate2D:json] : defaultView.centerCoordinate, BMK_COORDTYPE_GPS);
   NSLog(@"x=%@,y=%@",[testdic objectForKey:@"x"],[testdic objectForKey:@"y"]);
   CLLocationCoordinate2D baiduCoor = BMKCoorDictionaryDecode(testdic);
   
   if ([view zoomLevel] == zoomLevel) {
      [view setCenterCoordinate:baiduCoor animated:YES];
   } else {
      [view setZoomLevel:[RCTConvert float:[centerDic valueForKey:@"zoom"]]];
      dispatch_time_t delay = dispatch_time(DISPATCH_TIME_NOW, NSEC_PER_SEC * 0.27);
      dispatch_after(delay, dispatch_get_main_queue(), ^(void){
         [view setCenterCoordinate:baiduCoor animated:YES];
      });
   }
   
   if (![_mapStyle isEqualToString:[centerDic valueForKey:@"mapStyle"]]){
      _mapStyle = [centerDic valueForKey:@"mapStyle"];
      NSString *path = @"";
      if ([_mapStyle isEqualToString:@"light"]) {
         [self view];
         [RCTBaiduMapView enableCustomMapStyle:YES];
         path = [[NSBundle mainBundle] pathForResource:@"light" ofType:@""] ;
         [RCTBaiduMapView customMapStyle:path];
         [self view];
      } else if ([_mapStyle isEqualToString:@"midnight"]) {
         [self view];
         [RCTBaiduMapView enableCustomMapStyle:YES];
         path = [[NSBundle mainBundle] pathForResource:@"midnight" ofType:@""] ;
         [RCTBaiduMapView customMapStyle:path];
         [self view];
         [RCTBaiduMapView enableCustomMapStyle:YES];
      } else if ([_mapStyle isEqualToString:@"dark"]) {
         [RCTBaiduMapView enableCustomMapStyle:YES];
         [self view];
         path = [[NSBundle mainBundle] pathForResource:@"dark" ofType:@""] ;
         [RCTBaiduMapView customMapStyle:path];
         [self view];
         [RCTBaiduMapView enableCustomMapStyle:YES];
      } else {
         NSLog(@"RCTBaiduMapViewManager no style");
         [RCTBaiduMapView enableCustomMapStyle:NO];
         [self view];
      }
   }
}

- (UIView *)view {
   NSLog(@"RCTBaiduMapViewManager newView");
   RCTBaiduMapView* mapView = [[RCTBaiduMapView alloc] init];
   mapView.delegate = self;
   mapView.rotateEnabled = NO;
   mapView.overlookEnabled = NO;
   //mapView.showMapPoi = NO;
   //BMKURLTileLayer* urlTileLayer = [[BMKURLTileLayer alloc] initWithURLTemplate:@""];
   return mapView;
}

+(void)initSDK {
   NSLog(@"RCTBaiduMapViewManager initSDK");
   BMKMapManager* _mapManager = [[BMKMapManager alloc]init];
   BOOL ret = [_mapManager start:@"X2CuoSKXGIp3ROZX9d6TOy6TCdYqygfr"  generalDelegate:nil];
   if (!ret) {
      NSLog(@"manager start failed!");
   }
}

-(void)mapview:(RCTBaiduMapView *)mapView
 onDoubleClick:(CLLocationCoordinate2D)coordinate {
   NSLog(@"onDoubleClick");
   NSDictionary* event = @{
                           @"type": @"onMapDoubleClick",
                           @"params": @{
                                 @"latitude": @(coordinate.latitude),
                                 @"longitude": @(coordinate.longitude)
                                 }
                           };
   [self sendEvent:mapView params:event];
}
- (void) mapView:(RCTBaiduMapView *)mapView
 onClickedMapPoi:(BMKMapPoi *)mapPoi {
   NSLog(@"onClickedMapPoi");
   NSDictionary* event = @{
                           @"type": @"onMapPoiClick",
                           @"params": @{
                                 @"name": mapPoi.text,
                                 @"uid": mapPoi.uid,
                                 @"latitude": @(mapPoi.pt.latitude),
                                 @"longitude": @(mapPoi.pt.longitude)
                                 }
                           };
   [self sendEvent:mapView params:event];
}
-(void)mapView:(RCTBaiduMapView *)mapView
onClickedMapBlank:(CLLocationCoordinate2D)coordinate {
   NSLog(@"onClickedMapBlank");
   NSDictionary* event = @{
                           @"type": @"onMapClick",
                           @"params": @{
                                 @"latitude": @(coordinate.latitude),
                                 @"longitude": @(coordinate.longitude)
                                 }
                           };
   [self sendEvent:mapView params:event];
}
-(void)mapView:(RCTBaiduMapView *)mapView
didSelectAnnotationView:(BMKAnnotationView *)annotationView {
   NSLog(@"RCTBaiduMapViewManager didSelectAnnotationView");
   [annotationView setEnabled:YES];
   [annotationView setSelected:NO];
   NSUInteger index = [mapView.annotations indexOfObject:annotationView.annotation];
   NSDictionary* event = @{
                           @"type": @"onMarkerClick",
                           @"params": @{
                                 @"position": @{
                                       @"latitude": @([[annotationView annotation] coordinate].latitude),
                                       @"longitude": @([[annotationView annotation] coordinate].longitude)
                                       },
                                 @"index": @(index)
                                 }
                           
                           };
   NSLog(@"didSelectAnnotationView event : %@", event);
   [self sendEvent:mapView params:event];
}

-(void)mapViewDidFinishLoading:(RCTBaiduMapView *)mapView {
   NSLog(@"RCTBaiduMapViewManager mapViewDidFinishLoading");
   NSDictionary* event = @{
                           @"type": @"onMapLoaded",
                           @"params": @{}
                           };
   [self sendEvent:mapView params:event];
}
-(void)mapViewDidFinishRendering:(RCTBaiduMapView *)mapView {
   NSLog(@"RCTBaiduMapViewManager mapViewDidFinishRendering");
   NSDictionary* event = @{
                           @"type": @"onMapRendered",
                           @"params": @{}
                           };
   [self sendEvent:mapView params:event];
}

-(void)mapStatusDidChanged:(RCTBaiduMapView *)mapView{
   CLLocationCoordinate2D targetGeoPt = [mapView getMapStatus].targetGeoPt;
   NSDictionary* event = @{
                           @"type": @"onMapStatusChange",
                           @" params": @{
                                 @"target": @{
                                       @"latitude": @(targetGeoPt.latitude),
                                       @"longitude": @(targetGeoPt.longitude)
                                       },
                                 @"zoom": @"",
                                 @"overlook": @""
                                 }
                           };
   [self sendEvent:mapView params:event];
}


- (BMKAnnotationView *)mapView:(BMKMapView *)mapView viewForAnnotation:(id <BMKAnnotation>)annotation {
   if ([annotation isKindOfClass:[CustomPointAnnotation class]]) {
      CustomAnnotationView *newAnnotationView = [[CustomAnnotationView alloc] initWithAnnotation:annotation reuseIdentifier:@"myAnnotation"];
      [newAnnotationView setCanShowCallout:NO];
      return newAnnotationView;
   }
   return nil;
}

- (BMKOverlayView *)mapView:(RCTBaiduMapView *)mapView viewForOverlay:(id <BMKOverlay>)overlay; {
   NSLog(@"=++========== Color : %@, Width: %@", [mapView.polilinesConfig valueForKey:@"color"], [mapView.polilinesConfig valueForKey:@"width"]);
   if ([overlay isKindOfClass:[BMKPolyline class]]){
      BMKPolylineView* polylineView = [[BMKPolylineView alloc] initWithOverlay:overlay];
      if ([mapView.polilinesConfig valueForKey:@"color"] != nil) {
         polylineView.strokeColor = [UIColor colorWithHexString:[mapView.polilinesConfig valueForKey:@"color"]];
      } else {
         polylineView.strokeColor = [UIColor blackColor];
      }
      polylineView.lineWidth = [[mapView.polilinesConfig valueForKey:@"width"] doubleValue];
      return polylineView;
   }
   
   return nil;
}




-(void)sendEvent:(RCTBaiduMapView *) mapView params:(NSDictionary *) params {
   if (!mapView.onChange) {
      return;
   }
   mapView.onChange(params);
}




@end
