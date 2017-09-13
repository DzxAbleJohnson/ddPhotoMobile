/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "RCTBaiduMapViewManager.h"
#import <React/RCTBundleURLProvider.h>
#import <UMSocialCore/UMSocialCore.h>
#import <UShareUI/UShareUI.h>
#import "ZXCustomSharePlatform.h"

// **********************************************
// *** DON'T MISS: THE NEXT LINE IS IMPORTANT ***
// **********************************************
#import "RCCManager.h"

// IMPORTANT: if you're getting an Xcode error that RCCManager.h isn't found, you've probably ran "npm install"
// with npm ver 2. You'll need to "npm install" with npm 3 (see https://github.com/wix/react-native-navigation/issues/1)

#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  [RCTBaiduMapViewManager initSDK];
  
  // UM
  [[UMSocialManager defaultManager] openLog:YES];
  [[UMSocialManager defaultManager] setUmSocialAppkey:@"599c5778ae1bf81e3700051a"];
  [self configUSharePlatforms];
  [self confitUShareSettings];
  
  ZXCustomSharePlatform *cusPlatform = [[ZXCustomSharePlatform alloc] init];
  [[UMSocialManager defaultManager] addAddUserDefinePlatformProvider:cusPlatform withUserDefinePlatformType:1001];
  
  ////////////
  
  
  NSURL *jsCodeLocation;
  
#ifdef DEBUG
//    jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
#else
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
  
  
  // **********************************************
  // *** DON'T MISS: THIS IS HOW WE BOOTSTRAP *****
  // **********************************************
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [UIColor whiteColor];
  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];

  // original RN bootstrap - remove this part
  //   RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
  //   moduleName:@"photoApp"
  //   initialProperties:nil
  //   launchOptions:launchOptions];
  //   self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  //   UIViewController *rootViewController = [UIViewController new];
  //   rootViewController.view = rootView;
  //   self.window.rootViewController = rootViewController;
  //   [self.window makeKeyAndVisible];
  /*dispatch_async(dispatch_get_main_queue(), ^{
    [UMSocialUIManager setPreDefinePlatforms:@[@(UMSocialPlatformType_Sina),@(UMSocialPlatformType_QQ),@(UMSocialPlatformType_WechatSession),@(UMSocialPlatformType_TencentWb),@(UMSocialPlatformType_Sms),@(UMSocialPlatformType_Facebook),@(UMSocialPlatformType_Line),@(UMSocialPlatformType_DingDing),@(UMSocialPlatformType_YouDaoNote)]];
    [UMSocialUIManager showShareMenuViewInWindowWithPlatformSelectionBlock:^(UMSocialPlatformType platformType, NSDictionary *userInfo) {
      NSLog(@"TEST========= 3");
      //创建分享消息对象
      UMSocialMessageObject *messageObject = [UMSocialMessageObject messageObject];
      //创建网页内容对象
      NSString* title = @"title";
      NSString* description = @"description";
      NSString* tumbnailURL =  @"https://mobile.umeng.com/images/pic/home/social/img-1.png";
      NSString* webpageUrl = @"http://naver.com";
      
      UMShareWebpageObject *shareObject = [UMShareWebpageObject shareObjectWithTitle:title descr:description thumImage:tumbnailURL];
      shareObject.webpageUrl = webpageUrl;
      
      //分享消息对象设置分享内容对象
      messageObject.shareObject = shareObject;
      
      NSLog(@"TEST========= 4");
      
      //调用分享接口
      [[UMSocialManager defaultManager] shareToPlatform:platformType messageObject:messageObject currentViewController:nil completion:^(id data, NSError *error) {
        
        NSLog(@"TEST========= 5");
        
        NSString * code = [NSString stringWithFormat:@"%ld",(long)error.code];
        NSString *message = data;
        
        if (error) {
          UMSocialLogInfo(@"************Share fail with error %@*********",error);
        }else{
          if ([data isKindOfClass:[UMSocialShareResponse class]]) {
            UMSocialShareResponse *resp = data;
            //分享结果消息
            UMSocialLogInfo(@"response message is %@",resp.message);
            //第三方原始返回的数据
            UMSocialLogInfo(@"response originalResponse data is %@",resp.originalResponse);
            code = @"200";
            message = resp.originalResponse;
          }else{
            UMSocialLogInfo(@"response data is %@",data);
          }
          
        }
      }];
      
    }];
    
  }); */
  
  return YES;
}
- (void) confitUShareSettings
{
  
}
- (void)configUSharePlatforms
{
  /*
   设置微信的appKey和appSecret
   [微信平台从U-Share 4/5升级说明]http://dev.umeng.com/social/ios/%E8%BF%9B%E9%98%B6%E6%96%87%E6%A1%A3#1_1
   */
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_WechatSession appKey:@"wx214b007031b9617f" appSecret:@"124809901f4d83c99333a80b53d08663" redirectURL:nil];
  
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_WechatTimeLine appKey:@"wx214b007031b9617f" appSecret:@"124809901f4d83c99333a80b53d08663" redirectURL:nil];
  /*
   * 移除相应平台的分享，如微信收藏
   */
  //[[UMSocialManager defaultManager] removePlatformProviderWithPlatformTypes:@[@(UMSocialPlatformType_WechatFavorite)]];
  
  /* 设置分享到QQ互联的appID
   * U-Share SDK为了兼容大部分平台命名，统一用appKey和appSecret进行参数设置，而QQ平台仅需将appID作为U-Share的appKey参数传进即可。
   100424468.no permission of union id
   [QQ/QZone平台集成说明]http://dev.umeng.com/social/ios/%E8%BF%9B%E9%98%B6%E6%96%87%E6%A1%A3#1_3
   */
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_QQ appKey:@"1106182374"/*设置QQ平台的appID*/  appSecret:@"lICxvhiEIs8qzl2p" redirectURL:@"http://mobile.umeng.com/social"];
  
  /*
   设置新浪的appKey和appSecret
   [新浪微博集成说明]http://dev.umeng.com/social/ios/%E8%BF%9B%E9%98%B6%E6%96%87%E6%A1%A3#1_2
   */
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_Sina appKey:@"1424462774"  appSecret:@"215bc0bee1eda4243790628a7776de8f" redirectURL:@"https://sns.whalecloud.com/sina2/callback"];
  
  /* 钉钉的appKey */
  [[UMSocialManager defaultManager] setPlaform: UMSocialPlatformType_DingDing appKey:@"dingoabcrgiqig0yhvboo3" appSecret:nil redirectURL:nil];
  
  /* 设置Twitter的appKey和appSecret */
  //[[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_Twitter appKey:@"fB5tvRpna1CKK97xZUslbxiet"  appSecret:@"YcbSvseLIwZ4hZg9YmgJPP5uWzd4zr6BpBKGZhf07zzh3oj62K" redirectURL:nil];
  
  /* 设置Facebook的appKey和UrlString */
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_Facebook appKey:@"315272312276955"  appSecret:nil redirectURL:nil];
}
@end

