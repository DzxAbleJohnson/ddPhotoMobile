//
//  CustomAnnotationView.h
//  RCTBaiduMap
//
//  Created by 아이맥 on 2017. 7. 27..
//  Copyright © 2017년 lovebing.org. All rights reserved.
//

#import <MapKit/MapKit.h>
#import <BaiduMapAPI_Map/BMKMapView.h>

@interface CustomAnnotationView : BMKAnnotationView

@property (nonatomic, weak) UILabel *label;

@end

@interface UIBezierPath (Polygon)

/** Create UIBezierPath for regular polygon with rounded corners
 *
 * @param rect          The CGRect of the square in which the path should be created.
 * @param sides         How many sides to the polygon (e.g. 6=hexagon; 8=octagon, etc.).
 * @param lineWidth     The width of the stroke around the polygon. The polygon will be inset such that the stroke stays within the above square.
 * @param cornerRadius  The radius to be applied when rounding the corners.
 *
 * @return              UIBezierPath of the resulting rounded polygon path.
 */

+ (instancetype)polygonInRect:(CGRect)rect sides:(NSInteger)sides lineWidth:(CGFloat)lineWidth cornerRadius:(CGFloat)cornerRadius;

@end
