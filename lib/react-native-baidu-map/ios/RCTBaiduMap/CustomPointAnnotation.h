//
//  CustomPointAnnotation.h
//  RCTBaiduMap
//
//  Created by 아이맥 on 2017. 7. 27..
//  Copyright © 2017년 lovebing.org. All rights reserved.
//

#import <MapKit/MapKit.h>
#import <BaiduMapAPI_Map/BMKPointAnnotation.h>

@interface CustomPointAnnotation : BMKPointAnnotation

@property (nonatomic, weak) NSDictionary *photo;

@end
