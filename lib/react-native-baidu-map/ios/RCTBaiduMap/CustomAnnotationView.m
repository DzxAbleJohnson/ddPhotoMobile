//
//  CustomAnnotationView.m
//  RCTBaiduMap
//
//  Created by 아이맥 on 2017. 7. 27..
//  Copyright © 2017년 lovebing.org. All rights reserved.
//

#import "CustomAnnotationView.h"
#import <BaiduMapAPI_Map/BMKMapView.h>
#import "CustomPointAnnotation.h"

@interface CustomAnnotationView ()
@property (nonatomic) CGFloat width;
@end

@implementation CustomAnnotationView

- (instancetype)initWithAnnotation:(id<BMKAnnotation>)annotation reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithAnnotation:annotation reuseIdentifier:reuseIdentifier];
    self.canShowCallout = NO;
    if (self) {
        CustomPointAnnotation *annotation_custom = annotation;
        NSMutableDictionary *photo = [NSMutableDictionary new];
        [photo setDictionary:annotation_custom.photo];
        if ([photo valueForKey:@"url@marker"] != nil && [photo valueForKey:@"url@marker"] != [NSNull null] && ![[photo valueForKey:@"url@marker"] isEqualToString:@""]) {
            NSLog(@"marker url set  %@", [photo valueForKey:@"url@marker"]);
            NSURL *imageUrl = [NSURL URLWithString:[photo valueForKey:@"url@marker"]];
            // lazy loading
            NSURLSessionTask *task = [[NSURLSession sharedSession] dataTaskWithURL:imageUrl completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
                if (data) {
                    UIImage *image = [UIImage imageWithData:data];
                    if (image) {
                        dispatch_async(dispatch_get_main_queue(), ^{
                            CGSize newSize = CGSizeMake(image.size.width/1.4, image.size.height/1.4);
                            self.image = [self imageByScalingAndCroppingForSize:newSize sourceImage:image];
                        });
                    }
                }
            }];
            [task resume];
        } else if ([photo valueForKey:@"uri@marker"] != nil && [photo valueForKey:@"uri@marker"] != [NSNull null] &&  ![[photo valueForKey:@"uri@marker"] isEqualToString:@""]) {
            NSLog(@"marker uri set  %@", [photo valueForKey:@"uri@marker"]);
            UIImage *basicImage = [[UIImage alloc] initWithContentsOfFile:[[photo valueForKey:@"uri@marker"] substringFromIndex:7]];
            CGSize newSize = CGSizeMake(basicImage.size.width/1.4, basicImage.size.height/1.4);
            self.image = [self imageByScalingAndCroppingForSize:newSize sourceImage:basicImage];
        } else {
            NSLog(@"url/uri not string");
        }
    }
    return self;
}

- (void)setAnnotation:(id<BMKAnnotation>)annotation {
    [super setAnnotation:annotation];
}

- (UIImage*)imageByScalingAndCroppingForSize:(CGSize)targetSize sourceImage:(UIImage*)sourceImage
{
    UIImage *newImage = nil;
    CGSize imageSize = sourceImage.size;
    CGFloat width = imageSize.width;
    CGFloat height = imageSize.height;
    CGFloat targetWidth = targetSize.width;
    CGFloat targetHeight = targetSize.height;
    CGFloat scaleFactor = 0.0;
    CGFloat scaledWidth = targetWidth;
    CGFloat scaledHeight = targetHeight;
    CGPoint thumbnailPoint = CGPointMake(0.0,0.0);
    
    if (CGSizeEqualToSize(imageSize, targetSize) == NO)
    {
        CGFloat widthFactor = targetWidth / width;
        CGFloat heightFactor = targetHeight / height;
        
        if (widthFactor > heightFactor)
        {
            scaleFactor = widthFactor; // scale to fit height
        }
        else
        {
            scaleFactor = heightFactor; // scale to fit width
        }
        
        scaledWidth  = width * scaleFactor;
        scaledHeight = height * scaleFactor;
        
        // center the image
        if (widthFactor > heightFactor)
        {
            thumbnailPoint.y = (targetHeight - scaledHeight) * 0.5;
        }
        else
        {
            if (widthFactor < heightFactor)
            {
                thumbnailPoint.x = (targetWidth - scaledWidth) * 0.5;
            }
        }
    }
    
    UIGraphicsBeginImageContext(targetSize); // this will crop
    
    CGRect thumbnailRect = CGRectZero;
    thumbnailRect.origin = thumbnailPoint;
    thumbnailRect.size.width  = scaledWidth;
    thumbnailRect.size.height = scaledHeight;
    
    [sourceImage drawInRect:thumbnailRect];
    
    newImage = UIGraphicsGetImageFromCurrentImageContext();
    
    if(newImage == nil)
    {
        NSLog(@"could not scale image");
    }
    
    //pop the context to get back to the default
    UIGraphicsEndImageContext();
    
    return newImage;
}


//- (UIImage *)createMaskImage :(UIImage *)image {
//    NSLog(@"ImageResizer createMaskImage : %f, %f : ", image.size.width, image.size.height);
//    CGRect rect = CGRectMake(0.0f, 0.0f, image.size.width, image.size.height);
//    UIImageView *imageView = [[UIImageView alloc] initWithFrame:rect];
//    imageView.image = image;
//    
//    //
//    CGFloat lineWidth    = 5.0;
//    UIBezierPath *path   = [UIBezierPath polygonInRect:imageView.bounds
//                                                 sides:5
//                                             lineWidth:lineWidth
//                                          cornerRadius:0];
//    
//    CAShapeLayer *mask   = [CAShapeLayer layer];
//    mask.path            = path.CGPath;
//    mask.lineWidth       = lineWidth;
//    mask.strokeColor     = [UIColor clearColor].CGColor;
//    mask.fillColor       = [UIColor whiteColor].CGColor;
//    imageView.layer.mask = mask;
//    
//    // if you also want a border, add that as a separate layer
//    
//    CAShapeLayer *border = [CAShapeLayer layer];
//    border.path          = path.CGPath;
//    border.lineWidth     = lineWidth;
//    border.strokeColor   = [UIColor redColor].CGColor;
//    border.fillColor     = [UIColor clearColor].CGColor;
//    [imageView.layer addSublayer:border];
//    
//    UIImage *chageImage = [self ChangeImageViewToImage:imageView];
//    UIImage *finalImage = [self addIndex:chageImage];
//    
//    return finalImage;
//}
//
//-(UIImage *) addIndex:(UIImage *)image{
//    NSLog(@"ImageResizer addIndex : %f, %f : ", image.size.width, image.size.height);
//    CGRect rect = CGRectMake(0.0f, 0.0f, image.size.width, image.size.height);
//    UIImageView *imageView = [[UIImageView alloc] initWithFrame:rect];
//    imageView.image = image;
//    
//    UILabel *indexLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, 14, 14)];
//    indexLabel.backgroundColor = [UIColor redColor];
//    indexLabel.textColor = [UIColor whiteColor];
//    indexLabel.textAlignment = NSTextAlignmentCenter;
//    indexLabel.font = [UIFont fontWithName:@"HelveticaNeue-Bold" size:8];
//    indexLabel.text = @"20";
//    
//    CALayer * ul = [indexLabel layer];
//    [ul setMasksToBounds:YES];
//    [ul setCornerRadius:7];
//    
//    [imageView addSubview:indexLabel];
//    
//    UIImage *chageImage = [self ChangeImageViewToImage:imageView];
//    return chageImage;
//}
//
//-(UIImage *) ChangeImageViewToImage : (UIImageView *) view{
//    UIGraphicsBeginImageContextWithOptions(view.bounds.size, NO, 0.0);
//    [view.layer renderInContext:UIGraphicsGetCurrentContext()];
//    UIImage * img = UIGraphicsGetImageFromCurrentImageContext();
//    UIGraphicsEndImageContext();
//    return img;
//}
//
//@end
//
//
//
//@implementation UIBezierPath (Polygon)
//
//+ (instancetype)polygonInRect:(CGRect)rect sides:(NSInteger)sides lineWidth:(CGFloat)lineWidth cornerRadius:(CGFloat)cornerRadius {
//    UIBezierPath *path  = [UIBezierPath bezierPath];
//    
//    CGFloat theta       = 2.0 * M_PI / sides;                           // how much to turn at every corner
//    CGFloat offset      = cornerRadius * tanf(theta / 2.0);             // offset from which to start rounding corners
//    CGFloat squareWidth = MIN(rect.size.width, rect.size.height);   // width of the square
//    
//    // calculate the length of the sides of the polygon
//    
//    CGFloat length      = squareWidth - lineWidth;
//    if (sides % 4 != 0) {                                               // if not dealing with polygon which will be square with all sides ...
//        length = length * cosf(theta / 2.0) + offset/2.0;               // ... offset it inside a circle inside the square
//    }
//    CGFloat sideLength = length * tanf(theta / 2.0);
//    
//    // start drawing at `point` in lower right corner
//    
//    CGPoint point = CGPointMake(rect.origin.x + rect.size.width / 2.0 + sideLength / 2.0 - offset, rect.origin.y + rect.size.height / 2.0 + length / 2.0);
//    CGFloat angle = M_PI;
//    [path moveToPoint:point];
//    
//    // draw the sides and rounded corners of the polygon
//    
//    for (NSInteger side = 0; side < sides; side++) {
//        point = CGPointMake(point.x + (sideLength - offset * 2.0) * cosf(angle), point.y + (sideLength - offset * 2.0) * sinf(angle));
//        [path addLineToPoint:point];
//        
//        CGPoint center = CGPointMake(point.x + cornerRadius * cosf(angle + M_PI_2), point.y + cornerRadius * sinf(angle + M_PI_2));
//        [path addArcWithCenter:center radius:cornerRadius startAngle:angle - M_PI_2 endAngle:angle + theta - M_PI_2 clockwise:YES];
//        
//        point = path.currentPoint; // we don't have to calculate where the arc ended ... UIBezierPath did that for us
//        angle += theta;
//    }
//    
//    [path closePath];
//    
//    path.lineWidth = lineWidth;           // in case we're going to use CoreGraphics to stroke path, rather than CAShapeLayer
//    path.lineJoinStyle = kCGLineJoinRound;
//    
//    return path;
//}
@end
