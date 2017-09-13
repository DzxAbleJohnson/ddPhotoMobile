/*
 File: ImageHelpers.m

 Disclaimer: IMPORTANT:  This Apple software is supplied to you by Apple
 Inc. ("Apple") in consideration of your agreement to the following
 terms, and your use, installation, modification or redistribution of
 this Apple software constitutes acceptance of these terms.  If you do
 not agree with these terms, please do not use, install, modify or
 redistribute this Apple software.

 In consideration of your agreement to abide by the following terms, and
 subject to these terms, Apple grants you a personal, non-exclusive
 license, under Apple's copyrights in this original Apple software (the
 "Apple Software"), to use, reproduce, modify and redistribute the Apple
 Software, with or without modifications, in source and/or binary forms;
 provided that if you redistribute the Apple Software in its entirety and
 without modifications, you must retain this notice and the following
 text and disclaimers in all such redistributions of the Apple Software.
 Neither the name, trademarks, service marks or logos of Apple Inc. may
 be used to endorse or promote products derived from the Apple Software
 without specific prior written permission from Apple.  Except as
 expressly stated in this notice, no other rights or licenses, express or
 implied, are granted by Apple herein, including but not limited to any
 patent rights that may be infringed by your derivative works or by other
 works in which the Apple Software may be incorporated.

 The Apple Software is provided by Apple on an "AS IS" basis.  APPLE
 MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION
 THE IMPLIED WARRANTIES OF NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS
 FOR A PARTICULAR PURPOSE, REGARDING THE APPLE SOFTWARE OR ITS USE AND
 OPERATION ALONE OR IN COMBINATION WITH YOUR PRODUCTS.

 IN NO EVENT SHALL APPLE BE LIABLE FOR ANY SPECIAL, INDIRECT, INCIDENTAL
 OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 INTERRUPTION) ARISING IN ANY WAY OUT OF THE USE, REPRODUCTION,
 MODIFICATION AND/OR DISTRIBUTION OF THE APPLE SOFTWARE, HOWEVER CAUSED
 AND WHETHER UNDER THEORY OF CONTRACT, TORT (INCLUDING NEGLIGENCE),
 STRICT LIABILITY OR OTHERWISE, EVEN IF APPLE HAS BEEN ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.

 Copyright (C) 2009 Apple Inc. All Rights Reserved.
 */

#include "ImageHelpers.h"

const CGBitmapInfo kDefaultCGBitmapInfo	= (kCGImageAlphaPremultipliedFirst | kCGBitmapByteOrder32Host);
const CGBitmapInfo kDefaultCGBitmapInfoNoAlpha	= (kCGImageAlphaNoneSkipFirst | kCGBitmapByteOrder32Host);

CGColorSpaceRef	GetDeviceRGBColorSpace() {
    static CGColorSpaceRef	deviceRGBSpace	= NULL;
    if( deviceRGBSpace == NULL )
        deviceRGBSpace	= CGColorSpaceCreateDeviceRGB();
    return deviceRGBSpace;
}

float GetScaleForProportionalResize( CGSize theSize, CGSize intoSize, bool onlyScaleDown, bool maximize )
{
//    GSize theSize = 기본이미지
//    CGSize intoSize = 새로운 사이즈
    float	sx = theSize.width;
    float	sy = theSize.height;
    float	dx = intoSize.width;
    float	dy = intoSize.height;
    float	scale	= 1;

    if( sx != 0 && sy != 0 )
    {
        dx	= dx / sx;
        dy	= dy / sy;

        // if maximize is true, take LARGER of the scales, else smaller
        if( maximize )		scale	= (dx > dy)	? dx : dy;
        else				scale	= (dx < dy)	? dx : dy;

        if( scale > 1 && onlyScaleDown )	// reset scale
            scale	= 1;
    }
    else
    {
        scale	 = 0;
    }
    return scale;
}

CGContextRef CreateCGBitmapContextForWidthAndHeight( unsigned int width, unsigned int height,
                                                    CGColorSpaceRef optionalColorSpace, CGBitmapInfo optionalInfo )
{
    CGColorSpaceRef	colorSpace	= (optionalColorSpace == NULL) ? GetDeviceRGBColorSpace() : optionalColorSpace;
    CGBitmapInfo	alphaInfo	= ( (int32_t)optionalInfo < 0 ) ? kDefaultCGBitmapInfo : optionalInfo;
    return CGBitmapContextCreate( NULL, width, height, 8, 0, colorSpace, alphaInfo );
}

CGImageRef CreateCGImageFromUIImageScaled( UIImage* image, float scaleFactor )
{
    CGImageRef			newImage		= NULL;
    CGContextRef		bmContext		= NULL;
    BOOL				mustTransform	= YES;
    CGAffineTransform	transform		= CGAffineTransformIdentity;
    UIImageOrientation	orientation		= image.imageOrientation;

    CGImageRef			srcCGImage		= CGImageRetain( image.CGImage );

    size_t width	= CGImageGetWidth(srcCGImage) * scaleFactor;
    size_t height	= CGImageGetHeight(srcCGImage) * scaleFactor;

    // These Orientations are rotated 0 or 180 degrees, so they retain the width/height of the image
    if( (orientation == UIImageOrientationUp) || (orientation == UIImageOrientationDown) || (orientation == UIImageOrientationUpMirrored) || (orientation == UIImageOrientationDownMirrored)  )
    {
        bmContext	= CreateCGBitmapContextForWidthAndHeight( width, height, NULL, kDefaultCGBitmapInfo );
    }
    else	// The other Orientations are rotated ±90 degrees, so they swap width & height.
    {
        bmContext	= CreateCGBitmapContextForWidthAndHeight( height, width, NULL, kDefaultCGBitmapInfo );
    }

    //CGContextSetInterpolationQuality( bmContext, kCGInterpolationLow );
    CGContextSetBlendMode( bmContext, kCGBlendModeCopy );	// we just want to copy the data

    switch(orientation)
    {
        case UIImageOrientationDown:		// 0th row is at the bottom, and 0th column is on the right - Rotate 180 degrees
            transform	= CGAffineTransformMake(-1.0, 0.0, 0.0, -1.0, width, height);
            break;

        case UIImageOrientationLeft:		// 0th row is on the left, and 0th column is the bottom - Rotate -90 degrees
            transform	= CGAffineTransformMake(0.0, 1.0, -1.0, 0.0, height, 0.0);
            break;

        case UIImageOrientationRight:		// 0th row is on the right, and 0th column is the top - Rotate 90 degrees
            transform	= CGAffineTransformMake(0.0, -1.0, 1.0, 0.0, 0.0, width);
            break;

        case UIImageOrientationUpMirrored:	// 0th row is at the top, and 0th column is on the right - Flip Horizontal
            transform	= CGAffineTransformMake(-1.0, 0.0, 0.0, 1.0, width, 0.0);
            break;

        case UIImageOrientationDownMirrored:	// 0th row is at the bottom, and 0th column is on the left - Flip Vertical
            transform	= CGAffineTransformMake(1.0, 0.0, 0, -1.0, 0.0, height);
            break;

        case UIImageOrientationLeftMirrored:	// 0th row is on the left, and 0th column is the top - Rotate -90 degrees and Flip Vertical
            transform	= CGAffineTransformMake(0.0, -1.0, -1.0, 0.0, height, width);
            break;

        case UIImageOrientationRightMirrored:	// 0th row is on the right, and 0th column is the bottom - Rotate 90 degrees and Flip Vertical
            transform	= CGAffineTransformMake(0.0, 1.0, 1.0, 0.0, 0.0, 0.0);
            break;

        default:
            mustTransform	= NO;
            break;
    }

    if( mustTransform )	CGContextConcatCTM( bmContext, transform );

    CGContextDrawImage( bmContext, CGRectMake(0.0, 0.0, width, height), srcCGImage );
    CGImageRelease( srcCGImage );
    newImage = CGBitmapContextCreateImage( bmContext );
    CFRelease( bmContext );

    return newImage;
}

@implementation UIImage (scale)

-(UIImage*) scaleToSize:(CGSize)toSize
{
    UIImage	*scaledImg	= nil;
    float	scale		= GetScaleForProportionalResize( self.size, toSize, false, false );
    NSLog(@"imageResize scaleToSize scale : %f", scale);
    CGImageRef cgImage	= CreateCGImageFromUIImageScaled( self, scale );

    if( cgImage )
    {
        scaledImg	= [UIImage imageWithCGImage:cgImage];	// autoreleased
         NSLog(@"imageResize scaleToSize cgImage : %f, %f", scaledImg.size.width, scaledImg.size.height);
        CGImageRelease( cgImage );
    }
    return scaledImg;
}

- (UIImage*)imageByScalingAndCroppingForSize:(CGSize)targetSize
{
    UIImage *sourceImage = self;
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

@end

@implementation UIBezierPath (Polygon)

+ (instancetype)polygonInRect:(CGRect)rect sides:(NSInteger)sides lineWidth:(CGFloat)lineWidth cornerRadius:(CGFloat)cornerRadius {
    UIBezierPath *path  = [UIBezierPath bezierPath];
    
    CGFloat theta       = 2.0 * M_PI / sides;                           // how much to turn at every corner
    CGFloat offset      = cornerRadius * tanf(theta / 2.0);             // offset from which to start rounding corners
    CGFloat squareWidth = MIN(rect.size.width, rect.size.height);   // width of the square
    
    // calculate the length of the sides of the polygon
    
    CGFloat length      = squareWidth;
    if (sides % 4 != 0) {                                               // if not dealing with polygon which will be square with all sides ...
        length = length * cosf(theta / 2.0) + offset/2.0;               // ... offset it inside a circle inside the square
    }
    CGFloat sideLength = length * tanf(theta / 2.0);
    
    // start drawing at `point` in lower right corner
    
    CGPoint point = CGPointMake(rect.origin.x + rect.size.width / 2.0 + sideLength / 2.0 - offset, rect.origin.y + rect.size.height / 2.0 + length / 2.0);
    CGFloat angle = M_PI;
    [path moveToPoint:point];
    
    // draw the sides and rounded corners of the polygon
    
    for (NSInteger side = 0; side < sides; side++) {
        point = CGPointMake(point.x + (sideLength - offset * 2.0) * cosf(angle), point.y + (sideLength - offset * 2.0) * sinf(angle));
        [path addLineToPoint:point];
        
        CGPoint center = CGPointMake(point.x + cornerRadius * cosf(angle + M_PI_2), point.y + cornerRadius * sinf(angle + M_PI_2));
        [path addArcWithCenter:center radius:cornerRadius startAngle:angle - M_PI_2 endAngle:angle + theta - M_PI_2 clockwise:YES];
        
        point = path.currentPoint; // we don't have to calculate where the arc ended ... UIBezierPath did that for us
        angle += theta;
    }
    
    [path closePath];
    
    path.lineWidth = lineWidth;           // in case we're going to use CoreGraphics to stroke path, rather than CAShapeLayer
    path.lineJoinStyle = kCGLineJoinRound;
    
    return path;
}
@end
