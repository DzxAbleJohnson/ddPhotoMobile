//
//  ZXCustomSharePlatform.m
//  photoApp
//
//  Created by mac on 2017. 8. 29..
//  Copyright © 2017년 Facebook. All rights reserved.
//

#import "ZXCustomSharePlatform.h"
@implementation ZXCustomSharePlatform

// UMSocialPlatformType_Link = 1001

+ (void)load {
  [super load];
}

+ (NSArray *) socialPlatformTypes {
  return @[@(1001)];
}

+ (instancetype)defaultManager {
  static ZXCustomSharePlatform *instance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    if (!instance) {
      instance = [[self alloc] init];
    }
  });
  return instance;
}

+ (NSString *)platformNameWithPlatformType:(UMSocialPlatformType)platformType {
  return @"复制链接";
}

-(void)umSocial_ShareWithObject:(UMSocialMessageObject *)object
          withCompletionHandler:(UMSocialRequestCompletionHandler)completionHandler {
  UMShareWebpageObject *webObjc = object.shareObject;
  UIPasteboard *pastboad = [UIPasteboard generalPasteboard];
  pastboad.string = webObjc.webpageUrl;
  UIAlertView *alert = [[UIAlertView alloc]initWithTitle:@"复制链接"
                                                 message:webObjc.webpageUrl
                                                delegate:self
                                       cancelButtonTitle:nil
                                       otherButtonTitles:@"Copy", nil];
  [alert show];
  
}

// 因为我分享的是网页类型，所以 object.shareObject 的类型是 UMShareWebpageObject
-(BOOL)umSocial_handleOpenURL:(NSURL *)url {
  return YES;
}

-(UMSocialPlatformFeature)umSocial_SupportedFeatures {
  return UMSocialPlatformFeature_None;
}

-(NSString *)umSocial_PlatformSDKVersion {
  return [UMSocialGlobal umSocialSDKVersion];
}

-(BOOL)checkUrlSchema {
  return YES;
}

-(BOOL)umSocial_isInstall {
  return YES;
}

-(BOOL)umSocial_isSupport {
  return YES;
}

@end
