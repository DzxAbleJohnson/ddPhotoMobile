//
//  ImageResize.m
//  ChoozItApp
//
//  Created by Florian Rival on 19/11/15.
//

#include "RCTImageResizer.h"
#include "ImageHelpers.h"
#import <React/RCTImageLoader.h>

@implementation ImageResizer

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

bool saveImage(NSString * fullPath, UIImage * image, NSString * format, float quality)
{
    NSData* data = nil;
    if ([format isEqualToString:@"JPEG"]) {
        data = UIImageJPEGRepresentation(image, quality / 100.0);
    } else if ([format isEqualToString:@"PNG"]) {
        data = UIImagePNGRepresentation(image);
    }
    
    if (data == nil) {
        return NO;
    }
    
    NSFileManager* fileManager = [NSFileManager defaultManager];
    return [fileManager createFileAtPath:fullPath contents:data attributes:nil];
}

// resize file path
NSString * generateFilePath(NSString * ext, NSString * outputPath)
{
    NSString* directory;

    if ([outputPath length] == 0) {
        NSArray* paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
        directory = [paths firstObject];
    } else {
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *documentsDirectory = [paths objectAtIndex:0];
        directory = [documentsDirectory stringByAppendingPathComponent:outputPath];
        NSError *error;
        [[NSFileManager defaultManager] createDirectoryAtPath:directory withIntermediateDirectories:YES attributes:nil error:&error];
        if (error) {
            NSLog(@"Error creating documents subdirectory: %@", error);
            @throw [NSException exceptionWithName:@"InvalidPathException" reason:[NSString stringWithFormat:@"Error creating documents subdirectory: %@", error] userInfo:nil];
        }
    }

    NSString* name = [[NSUUID UUID] UUIDString];
    NSString* fullName = [NSString stringWithFormat:@"%@.%@", name, ext];
    NSString* fullPath = [directory stringByAppendingPathComponent:fullName];

    return fullPath;
}

UIImage * rotateImage(UIImage *inputImage, float rotationDegrees)
{

    // We want only fixed 0, 90, 180, 270 degree rotations.
    const int rotDiv90 = (int)round(rotationDegrees / 90);
    const int rotQuadrant = rotDiv90 % 4;
    const int rotQuadrantAbs = (rotQuadrant < 0) ? rotQuadrant + 4 : rotQuadrant;
    
    // Return the input image if no rotation specified.
    if (0 == rotQuadrantAbs) {
        return inputImage;
    } else {
        // Rotate the image by 80, 180, 270.
        UIImageOrientation orientation = UIImageOrientationUp;
        
        switch(rotQuadrantAbs) {
            case 1:
                orientation = UIImageOrientationRight; // 90 deg CW
                break;
            case 2:
                orientation = UIImageOrientationDown; // 180 deg rotation
                break;
            default:
                orientation = UIImageOrientationLeft; // 90 deg CCW
                break;
        }
        
        return [[UIImage alloc] initWithCGImage: inputImage.CGImage
                                                  scale: 1.0
                                                  orientation: orientation];
    }
}

- (CGFloat)pixelToPoints:(CGFloat)px {
    CGFloat pointsPerInch = 72.0;
    CGFloat scale = 1;
    float pixelPerInch; // DPI
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
        pixelPerInch = 132 * scale;
    } else if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone) {
        pixelPerInch = 163 * scale;
    } else {
        pixelPerInch = 160 * scale;
    }
    CGFloat points = px * pointsPerInch / pixelPerInch;
    return points;
}

- (CGFloat)pointsToPixels:(CGFloat)points {
    CGFloat pointsPerInch = 72.0;
    CGFloat scale = 1;
    float pixelPerInch; // DPI
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
        pixelPerInch = 132 * scale;
    } else if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone) {
        pixelPerInch = 163 * scale;
    } else {
        pixelPerInch = 160 * scale;
    }
    CGFloat px = points / (pointsPerInch * pixelPerInch);
    return px;
}

RCT_EXPORT_METHOD(createResizedImage:(NSString *)path
                  width:(float)width
                  height:(float)height
                  format:(NSString *)format
                  quality:(float)quality
                  rotation:(float)rotation
                  outputPath:(NSString *)outputPath
                  callback:(RCTResponseSenderBlock)callback)
{
    CGSize newSize = CGSizeMake(width, height);
    NSLog(@"createResizedImage newSize : %f, %f", newSize.width, newSize.height);
    
    //Set image extension
    NSString *extension = @"jpg";
    if ([format isEqualToString:@"PNG"]) {
        extension = @"png";
    }

    NSString* fullPath;
    @try {
        fullPath = generateFilePath(extension, outputPath);
    } @catch (NSException *exception) {
        callback(@[@"Invalid output path.", @""]);
        return;
    }

    [_bridge.imageLoader loadImageWithURLRequest:[RCTConvert NSURLRequest:path] callback:^(NSError *error, UIImage *image) {
        if (error || image == nil) {
            if ([path hasPrefix:@"data:"] || [path hasPrefix:@"file:"]) {
                NSURL *imageUrl = [[NSURL alloc] initWithString:path];
                image = [UIImage imageWithData:[NSData dataWithContentsOfURL:imageUrl]];
            } else {
                image = [[UIImage alloc] initWithContentsOfFile:path];
            }
            if (image == nil) {
                callback(@[@"Can't retrieve the file from the path.", @""]);
                return;
            }
        }

        // Rotate image if rotation is specified.
        if (0 != (int)rotation) {
            image = rotateImage(image, rotation);
            if (image == nil) {
                callback(@[@"Can't rotate the image.", @""]);
                return;
            }
        }

        // Do the resizing
//        UIImage * resizingImage = [image scaleToSize:newSize];
//        NSLog(@"ImageResizer resizingImage : %f, %f : ", resizingImage.size.width, resizingImage.size.height);
//        UIImage * scaledImage = [self imageByCroppingImage:resizingImage toSize:resizingImage.size];
//        NSLog(@"ImageResizer scaledImage : %f, %f : ", scaledImage.size.width, scaledImage.size.height);
        
        UIImage * scaledImage = [image imageByScalingAndCroppingForSize:newSize];
        NSLog(@"ImageResizer scaledImage : %f, %f : ", scaledImage.size.width, scaledImage.size.height);
        
        if (scaledImage == nil) {
            callback(@[@"Can't resize the image.", @""]);
            return;
        }

        // Compress and save the image
        if (!saveImage(fullPath, scaledImage, format, quality)) {
            callback(@[@"Can't save the image. Check  your compression format and your output path", @""]);
            return;
        }
        NSURL *fileUrl = [[NSURL alloc] initFileURLWithPath:fullPath];
        NSString *fileName = fileUrl.lastPathComponent;
        NSError *attributesError = nil;
        NSDictionary *fileAttributes = [[NSFileManager defaultManager] attributesOfItemAtPath:fullPath error:&attributesError];
        NSNumber *fileSize = fileAttributes == nil ? 0 : [fileAttributes objectForKey:NSFileSize];
        NSLog(@"createMarkerImage fileSize : %@ ",fileSize);
        NSDictionary *response = @{@"path": fullPath,
                                   @"uri": fileUrl.absoluteString,
                                   @"name": fileName,
                                   @"size": fileSize == nil ? @(0) : fileSize
                                   };
        
        callback(@[[NSNull null], response]);
    }];
}

RCT_EXPORT_METHOD(createMarkerImage:(NSString *)path
                        format:(NSString *)format
                        index:(NSInteger *)index
                    lineColor:(NSString *)lineColor
                        shape:(NSString *)shape
                    lineWidth:(NSInteger *)lineWidth
                    outputPath:(NSString *)outputPath
                  callback:(RCTResponseSenderBlock)callback)
{
    NSLog(@"createMarkerImage path : %@", path);
    NSLog(@"createMarkerImage %@ %@", lineColor, shape);
    CGSize newSize = CGSizeMake([self pixelToPoints:160.0], [self pixelToPoints:160.0]);
    
    //Set image extension
    NSString *extension = @"jpg";
    if ([format isEqualToString:@"PNG"]) {
        extension = @"png";
    }

    NSString* fullPath;
    
    @try {
        fullPath = generateFilePath(extension, outputPath);
    } @catch (NSException *exception) {
        callback(@[@"createMarkerImage Invalid output path.", @""]);
        return;
    }
    
    [_bridge.imageLoader loadImageWithURLRequest:[RCTConvert NSURLRequest:path] callback:^(NSError *error, UIImage *image) {
        if (error || image == nil) {
            if ([path hasPrefix:@"data:"] || [path hasPrefix:@"file:"]) {
                NSURL *imageUrl = [[NSURL alloc] initWithString:path];
                image = [UIImage imageWithData:[NSData dataWithContentsOfURL:imageUrl]];
            } else {
                image = [[UIImage alloc] initWithContentsOfFile:path];
            }
            if (image == nil) {
                callback(@[@"createMarkerImage Can't retrieve the file from the path.", @""]);
                return;
            }
        }
        
        // Do the resizing
        UIImage * scaledImage = [self createMaskImage:image index:index lineColor:lineColor shape:shape lineWidth:lineWidth newSize:newSize];
        NSLog(@"createMarkerImage scaledImage : %f, %f : ", scaledImage.size.width, scaledImage.size.height);

        if (scaledImage == nil) {
            callback(@[@"Can't resize the image.", @""]);
            return;
        }
        
        if (!saveImage(fullPath, scaledImage, format, 100)) {
            callback(@[@"Can't save the image. Check  your compression format and your output path", @""]);
            return;
        }
        
        NSURL *fileUrl = [[NSURL alloc] initFileURLWithPath:fullPath];
        NSString *fileName = fileUrl.lastPathComponent;
        NSError *attributesError = nil;
        NSDictionary *fileAttributes = [[NSFileManager defaultManager] attributesOfItemAtPath:fullPath error:&attributesError];
        NSNumber *fileSize = fileAttributes == nil ? 0 : [fileAttributes objectForKey:NSFileSize];
        NSLog(@"createMarkerImage fileSize : %@ ",fileSize);
        NSDictionary *response = @{@"path": fullPath,
                                   @"uri": fileUrl.absoluteString,
                                   @"name": fileName,
                                   @"size": fileSize == nil ? @(0) : fileSize
                                   };
        
        callback(@[[NSNull null], response]);
    }];
}

// Create MaskImage, set border and crop shape
- (UIImage *)createMaskImage :(UIImage *)image
                    index:(NSInteger *)index
                    lineColor:(NSString *)lineColor
                        shape:(NSString *)shape
                    lineWidth:(NSInteger *)lineWidth
                            newSize:(CGSize)newSize{
    CGRect rect = CGRectMake(0.0f, 0.0f, (newSize.height)-18.0, (newSize.height)-18.0);
    UIImageView *imageView = [[UIImageView alloc] initWithFrame:rect];
    imageView.image = image;
    NSLog(@"createMaskImage imageView size : %f %f", imageView.bounds.size.width, imageView.bounds.size.height);
    NSLog(@"createMaskImage image size : %f %f", image.size.width, image.size.height);
    
    NSLog(@"shape : %@", shape);
    NSInteger sides = 0;
    NSInteger cornerRadious = 0;
    
    if ([shape isEqualToString:@"square"]) {
        sides = 4;
    } else if ([shape isEqualToString:@"rounded_square"]) {
        sides = 4;
        cornerRadious = 10;
    } else if ([shape isEqualToString:@"pentagon"]) {
        sides = 5;
    } else if ([shape isEqualToString:@"hexagon"]) {
        sides = 6;
    } else if  ([shape isEqualToString:@"empty"]) {
        UIImage *chageImage = [self ChangeImageViewToImage:imageView];
        UIImage *finalImage = [self addIndex:chageImage index:index lineColor:lineColor];
        return finalImage;
    } else {
        sides = 0;
    }

    if (sides == 0) {
        imageView.layer.masksToBounds = true;
        imageView.layer.cornerRadius = imageView.frame.size.width / 2;
        imageView.layer.borderWidth = (CGFloat)(int)lineWidth;
        imageView.layer.borderColor =  [[UIColor colorWithHexString:lineColor] CGColor];
    } else {
        UIBezierPath *path   = [UIBezierPath polygonInRect:imageView.bounds
                                                     sides:sides
                                                 lineWidth:(int)lineWidth
                                              cornerRadius:cornerRadious];
        
        CAShapeLayer *mask   = [CAShapeLayer layer];
        mask.path            = path.CGPath;
        mask.lineWidth       = ((int)lineWidth)*2;
        mask.strokeColor     = [UIColor clearColor].CGColor;
        mask.fillColor       = [UIColor whiteColor].CGColor;
        imageView.layer.mask = mask;
        
        // if you also want a border, add that as a separate layer
    
        CAShapeLayer *border = [CAShapeLayer layer];
        border.path          = path.CGPath;
        border.fillRule      = kCAFillRuleEvenOdd;
        border.lineWidth     = ((int)lineWidth)*2;
        border.strokeColor   = [UIColor colorWithHexString:lineColor].CGColor;
        border.fillColor     = [UIColor clearColor].CGColor;
        imageView.layer.masksToBounds = true;
        [imageView.layer addSublayer:border];
    }
    
    
    
    UIImage *chageImage = [self ChangeImageViewToImage:imageView];
    UIImage *finalImage = [self addIndex:chageImage index:index lineColor:lineColor];
    
    return finalImage;
}

-(UIImage *) addIndex:(UIImage *)image
                index:(NSInteger *)index
            lineColor:(NSString *)lineColor
{
    CGSize newSize = CGSizeMake([self pixelToPoints:160.0], [self pixelToPoints:160.0]);
    CGRect rect = CGRectMake(0.0f, 0.0f, newSize.width, newSize.height);
    UIImageView *imageView = [[UIImageView alloc] initWithFrame:rect];
    imageView.contentMode = UIViewContentModeCenter;
    imageView.image = image;
    
    NSLog(@"addIndex imageView size : %f %f", imageView.bounds.size.width, imageView.bounds.size.height);
    NSLog(@"addIndex image size : %f %f", image.size.width, image.size.height);
    
    UILabel *indexLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, 18, 18)];
    indexLabel.backgroundColor = [UIColor colorWithHexString:lineColor];
    if ([lineColor isEqualToString:@"#FFFFFF"] || [lineColor isEqualToString:@"#ffffff"]) {
        indexLabel.textColor = [UIColor blackColor];
    } else {
        indexLabel.textColor = [UIColor whiteColor];
    }
    indexLabel.textAlignment = NSTextAlignmentCenter;
    indexLabel.font = [UIFont fontWithName:@"HelveticaNeue-Bold" size:15];
    indexLabel.text = [NSString stringWithFormat: @"%ld", (long)index];
    
    CALayer * ul = [indexLabel layer];
    [ul setMasksToBounds:YES];
    [ul setCornerRadius:9];
    
    [imageView addSubview:indexLabel];
    
    imageView.layer.shadowColor = [UIColor blackColor].CGColor;
    imageView.layer.shadowOffset = CGSizeMake(0, 1);
    imageView.layer.shadowOpacity = 0.5;
    imageView.layer.shadowRadius = 1.0;
    imageView.clipsToBounds = NO;
    
    UIImage *chageImage = [self ChangeImageViewToImage:imageView];
    return chageImage;
}

-(UIImage *) ChangeImageViewToImage : (UIImageView *) view{
    NSLog(@"ChangeImageViewToImage viewsize : %f %f", view.bounds.size.width, view.bounds.size.height);
    UIGraphicsBeginImageContextWithOptions(view.bounds.size, NO, 0.0);
    [view.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage * img = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return img;
}

@end


