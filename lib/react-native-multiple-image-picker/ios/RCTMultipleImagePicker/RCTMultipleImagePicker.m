//
//  RCTMultipleImagePicker.m
//  RCTMultipleImagePicker
//
//  Created by ShenTong on 16/6/20.
//
//

#import "RCTMultipleImagePicker.h"

#import <AssetsLibrary/AssetsLibrary.h>
#import <Photos/Photos.h>

@implementation RCTMultipleImagePicker

RCT_EXPORT_MODULE();

-(id)init {
    self = [super init];
    if(self) {
        self.assetsFromPath = [[NSMutableDictionary alloc] init];
        self.assetsToPath = [[NSMutableDictionary alloc] init];
    }
    return self;
}

RCT_EXPORT_METHOD(launchImageGallery:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    self.resolve = resolve;
    self.reject = reject;
    NSInteger maxImagesCount = [RCTConvert NSInteger:options[@"maxImagesCount"]];
    NSArray *selectedPaths = [RCTConvert NSArray:options[@"selectedPaths"]];
    NSMutableArray *selectedAssets = [[NSMutableArray alloc] init];
    [selectedPaths enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        NSString *path = [RCTConvert NSString:obj];
        [selectedAssets addObject:[self.assetsFromPath objectForKey:path]];
    }];
    
  
    NSError * error = nil;
    
    [self checkPhotosPermissions:^(BOOL granted) {
        if (!granted) {
          self.reject(@"camera_permission_not_granted", @"Camera permissions not granted", error);
          return;
        } else {
          [self showImagePickerController:maxImagesCount selectedAssets:selectedAssets];
        }
    }];
}

#pragma mark TZImagePickerControllerDelegate

- (void)showImagePickerController:(NSInteger)maxImagesCount selectedAssets:(NSMutableArray *)selectedAssets {
  TZImagePickerController *imagePickerController = [[TZImagePickerController alloc] initWithMaxImagesCount:maxImagesCount delegate:self];
  imagePickerController.allowPickingOriginalPhoto = NO;
  imagePickerController.allowPickingVideo = NO;
  imagePickerController.selectedAssets = selectedAssets;
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    [root presentViewController:imagePickerController
          animated:YES
          completion:NULL];
  });
}

- (void)imagePickerControllerDidCancel:(TZImagePickerController *)picker {
    self.reject(@"user_cancelled", @"User has cancelled.", nil);
}

- (NSString * _Nullable)originalFilenameForAsset:(PHAsset * _Nullable)asset assetType:(PHAssetResourceType)type {
    if (!asset) { return nil; }
    
    PHAssetResource *originalResource;
    // Get the underlying resources for the PHAsset (PhotoKit)
    NSArray<PHAssetResource *> *pickedAssetResources = [PHAssetResource assetResourcesForAsset:asset];
    
    // Find the original resource (underlying image) for the asset, which has the desired filename
    for (PHAssetResource *resource in pickedAssetResources) {
        if (resource.type == type) {
            originalResource = resource;
        }
    }
    
    return originalResource.originalFilename;
}

- (void)imagePickerController:(TZImagePickerController *)picker didFinishPickingPhotos:(NSArray<UIImage *> *)photos sourceAssets:(NSArray *)assets isSelectOriginalPhoto:(BOOL)isSelectOriginalPhoto
{
//    <UIImage: 0x608000698970>, {640, 1136}"
    NSLog(@"=========photos : %@", photos);
    NSLog(@"=========assets : %@", assets);

    NSMutableArray *result = [[NSMutableArray alloc] init];
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *filePathBase = [[paths objectAtIndex:0] stringByAppendingPathComponent:[[NSProcessInfo processInfo] globallyUniqueString]];
    NSError * error = nil;
    [[NSFileManager defaultManager] createDirectoryAtPath:filePathBase
                              withIntermediateDirectories:YES
                                               attributes:nil
                                                    error:&error];
    if (error != nil) {
        NSLog(@"error creating directory: %@", error);
        self.reject(@"create_directory_failed", @"Fail to create directory.", error);
    }
    
    for (int i = 0; i  < (int)[photos count]; i++) {
        NSMutableDictionary *response = [[NSMutableDictionary alloc] init];
        PHAsset *pickedAsset = [assets objectAtIndex:i];
        NSString *originalFilename = [self originalFilenameForAsset:pickedAsset assetType:PHAssetResourceTypePhoto];
        
        response[@"fileName"] = originalFilename ?: [NSNull null];
        if (pickedAsset.location) {
            response[@"latitude"] = @(pickedAsset.location.coordinate.latitude);
            response[@"longitude"] = @(pickedAsset.location.coordinate.longitude);
        }
        if (pickedAsset.creationDate) {
            response[@"timestamp"] = [[self ISO8601DateFormatter] stringFromDate:pickedAsset.creationDate];
        }
        NSLog(@"response: %@", response);
        
        NSString *tempFileName = [[NSUUID UUID] UUIDString];
        NSString *fileName = [tempFileName stringByAppendingString:@".jpg"]; //  파일 이름을 정적으로 설정
        NSString *path = [[NSTemporaryDirectory()stringByStandardizingPath] stringByAppendingPathComponent:fileName];
        NSString *documentsDirectory = [paths objectAtIndex:0];
        path = [documentsDirectory stringByAppendingPathComponent:fileName];
        
        UIImage *image = [photos objectAtIndex:i];
        image = [self fixOrientation:image];
        float maxWidth = image.size.width;
        float maxHeight = image.size.height;
        image = [self downscaleImageIfNecessary:image maxWidth:maxWidth maxHeight:maxHeight];
    
        NSData *data = UIImageJPEGRepresentation(image, 1.0); // 1.0 = quality
        [data writeToFile:path atomically:YES];
        NSURL *fileURL = [NSURL fileURLWithPath:path];
        NSString *filePath = [fileURL absoluteString];
        [response setObject:filePath forKey:@"uri"];
        
        [result addObject:response];
    }
    
    self.resolve(result);
}

- (void)getExifDataFromImage:(UIImage *)currentImage
{
    
    NSData* pngData =  UIImageJPEGRepresentation(currentImage, 1.0);
    
    CGImageSourceRef mySourceRef = CGImageSourceCreateWithData((CFDataRef)pngData, NULL);
    
    //CGImageSourceRef mySourceRef = CGImageSourceCreateWithURL((__bridge CFURLRef)myURL, NULL);
    if (mySourceRef != NULL)
    {
        NSDictionary *myMetadata = (__bridge NSDictionary *)CGImageSourceCopyPropertiesAtIndex(mySourceRef,0,NULL);
        NSDictionary *exifDic = [myMetadata objectForKey:(NSString *)kCGImagePropertyExifDictionary];
        NSDictionary *tiffDic = [myMetadata objectForKey:(NSString *)kCGImagePropertyTIFFDictionary];
        NSLog(@"exifDic properties: %@", myMetadata); //all data
        float rawShutterSpeed = [[exifDic objectForKey:(NSString *)kCGImagePropertyExifExposureTime] floatValue];
        int decShutterSpeed = (1 / rawShutterSpeed);
        NSLog(@"Camera %@",[tiffDic objectForKey:(NSString *)kCGImagePropertyTIFFModel]);
        NSLog(@"Focal Length %@mm",[exifDic objectForKey:(NSString *)kCGImagePropertyExifFocalLength]);
        NSLog(@"Shutter Speed %@", [NSString stringWithFormat:@"1/%d", decShutterSpeed]);
        NSLog(@"Aperture f/%@",[exifDic objectForKey:(NSString *)kCGImagePropertyExifFNumber]);
        
        
        NSNumber *ExifISOSpeed  = [[exifDic objectForKey:(NSString*)kCGImagePropertyExifISOSpeedRatings] objectAtIndex:0];
        NSLog(@"ISO %ld",[ExifISOSpeed integerValue]);
        NSLog(@"Taken %@",[exifDic objectForKey:(NSString*)kCGImagePropertyExifDateTimeDigitized]);
    }
    
}

- (UIImage*)downscaleImageIfNecessary:(UIImage*)image maxWidth:(float)maxWidth maxHeight:(float)maxHeight
{
    UIImage* newImage = image;
    
    // Nothing to do here
    if (image.size.width <= maxWidth && image.size.height <= maxHeight) {
        return newImage;
    }
    
    CGSize scaledSize = CGSizeMake(image.size.width, image.size.height);
    if (maxWidth < scaledSize.width) {
        scaledSize = CGSizeMake(maxWidth, (maxWidth / scaledSize.width) * scaledSize.height);
    }
    if (maxHeight < scaledSize.height) {
        scaledSize = CGSizeMake((maxHeight / scaledSize.height) * scaledSize.width, maxHeight);
    }
    
    // If the pixels are floats, it causes a white line in iOS8 and probably other versions too
    scaledSize.width = (int)scaledSize.width;
    scaledSize.height = (int)scaledSize.height;
    
    UIGraphicsBeginImageContext(scaledSize); // this will resize
    [image drawInRect:CGRectMake(0, 0, scaledSize.width, scaledSize.height)];
    newImage = UIGraphicsGetImageFromCurrentImageContext();
    if (newImage == nil) {
        NSLog(@"could not scale image");
    }
    UIGraphicsEndImageContext();
    
    return newImage;
}


- (UIImage *)fixOrientation:(UIImage *)srcImg {
    if (srcImg.imageOrientation == UIImageOrientationUp) {
        return srcImg;
    }
    
    CGAffineTransform transform = CGAffineTransformIdentity;
    switch (srcImg.imageOrientation) {
        case UIImageOrientationDown:
        case UIImageOrientationDownMirrored:
            transform = CGAffineTransformTranslate(transform, srcImg.size.width, srcImg.size.height);
            transform = CGAffineTransformRotate(transform, M_PI);
            break;
            
        case UIImageOrientationLeft:
        case UIImageOrientationLeftMirrored:
            transform = CGAffineTransformTranslate(transform, srcImg.size.width, 0);
            transform = CGAffineTransformRotate(transform, M_PI_2);
            break;
            
        case UIImageOrientationRight:
        case UIImageOrientationRightMirrored:
            transform = CGAffineTransformTranslate(transform, 0, srcImg.size.height);
            transform = CGAffineTransformRotate(transform, -M_PI_2);
            break;
        case UIImageOrientationUp:
        case UIImageOrientationUpMirrored:
            break;
    }
    
    switch (srcImg.imageOrientation) {
        case UIImageOrientationUpMirrored:
        case UIImageOrientationDownMirrored:
            transform = CGAffineTransformTranslate(transform, srcImg.size.width, 0);
            transform = CGAffineTransformScale(transform, -1, 1);
            break;
            
        case UIImageOrientationLeftMirrored:
        case UIImageOrientationRightMirrored:
            transform = CGAffineTransformTranslate(transform, srcImg.size.height, 0);
            transform = CGAffineTransformScale(transform, -1, 1);
            break;
        case UIImageOrientationUp:
        case UIImageOrientationDown:
        case UIImageOrientationLeft:
        case UIImageOrientationRight:
            break;
    }
    
    CGContextRef ctx = CGBitmapContextCreate(NULL, srcImg.size.width, srcImg.size.height, CGImageGetBitsPerComponent(srcImg.CGImage), 0, CGImageGetColorSpace(srcImg.CGImage), CGImageGetBitmapInfo(srcImg.CGImage));
    CGContextConcatCTM(ctx, transform);
    switch (srcImg.imageOrientation) {
        case UIImageOrientationLeft:
        case UIImageOrientationLeftMirrored:
        case UIImageOrientationRight:
        case UIImageOrientationRightMirrored:
            CGContextDrawImage(ctx, CGRectMake(0,0,srcImg.size.height,srcImg.size.width), srcImg.CGImage);
            break;
            
        default:
            CGContextDrawImage(ctx, CGRectMake(0,0,srcImg.size.width,srcImg.size.height), srcImg.CGImage);
            break;
    }
    
    CGImageRef cgimg = CGBitmapContextCreateImage(ctx);
    UIImage *img = [UIImage imageWithCGImage:cgimg];
    CGContextRelease(ctx);
    CGImageRelease(cgimg);
    return img;
}


- (void)checkPhotosPermissions:(void(^)(BOOL granted))callback
{
    PHAuthorizationStatus status = [PHPhotoLibrary authorizationStatus];
    if (status == PHAuthorizationStatusAuthorized) {
        callback(YES);
        return;
    } else if (status == PHAuthorizationStatusNotDetermined) {
        [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
            if (status == PHAuthorizationStatusAuthorized) {
                callback(YES);
                return;
            }
            else {
                callback(NO);
                return;
            }
        }];
    }
    else {
        callback(NO);
    }
}


- (NSDateFormatter * _Nonnull)ISO8601DateFormatter {
    static NSDateFormatter *ISO8601DateFormatter;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        ISO8601DateFormatter = [[NSDateFormatter alloc] init];
        NSLocale *enUSPOSIXLocale = [NSLocale localeWithLocaleIdentifier:@"en_US_POSIX"];
        ISO8601DateFormatter.locale = enUSPOSIXLocale;
        ISO8601DateFormatter.timeZone = [NSTimeZone timeZoneWithAbbreviation:@"GMT"];
        ISO8601DateFormatter.dateFormat = @"yyyy-MM-dd'T'HH:mm:ssZZZZZ";
    });
    return ISO8601DateFormatter;
}

@end
