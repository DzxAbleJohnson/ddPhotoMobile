#import "RCTUmengShare.h"
#import <React/RCTBridgeModule.h>
#import <UMSocialCore/UMSocialCore.h>
#import <UMSocialCore/UMSocialManager.h>
#import <UShareUI/UShareUI.h>

@implementation RCTUmengShare
RCT_EXPORT_MODULE(RCTUmengShare)
RCT_EXPORT_METHOD(share:(NSDictionary*)dic callback:(RCTResponseSenderBlock)callback)
{
  dispatch_async(dispatch_get_main_queue(), ^
    //分享消息对象设置分享内容对象
    if ([dic objectForKey:@"url"]) {
      [UMSocialUIManager setPreDefinePlatforms:@[@(UMSocialPlatformType_WechatTimeLine), @(UMSocialPlatformType_WechatSession), @(UMSocialPlatformType_QQ), @(UMSocialPlatformType_Sina),@(UMSocialPlatformType_Sms),@(UMSocialPlatformType_DingDing), @(1001/*UMSocialPlatformType_Link*/), @(UMSocialPlatformType_Facebook)/*,@(UMSocialPlatformType_Line)*/]];
    } else {
      [UMSocialUIManager setPreDefinePlatforms:@[@(UMSocialPlatformType_WechatTimeLine), @(UMSocialPlatformType_WechatSession), @(UMSocialPlatformType_QQ), @(UMSocialPlatformType_Sina),@(UMSocialPlatformType_Sms),@(UMSocialPlatformType_DingDing), @(UMSocialPlatformType_Facebook)/*,@(UMSocialPlatformType_Line)*/]];
    }
    [UMSocialUIManager showShareMenuViewInWindowWithPlatformSelectionBlock:^(UMSocialPlatformType platformType, NSDictionary *userInfo) {
      //创建分享消息对象
      UMSocialMessageObject *messageObject = [UMSocialMessageObject messageObject];
      //创建网页内容对象
      NSString* title = [dic objectForKey:@"title"];
      NSString* description = [dic objectForKey:@"description"];
      NSString* thumbnailURL =  [dic objectForKey:@"thumbnail"];
      UIImage* thumbnail;
      if ([thumbnailURL rangeOfString:@"http"].location == NSNotFound) {
        // Local
        thumbnail = [UIImage imageWithContentsOfFile:thumbnailURL];
      } else {
        // URL
        thumbnail = [UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:thumbnailURL]]];
      }
      if ([dic objectForKey:@"url"]) {
        UMShareWebpageObject *shareObject = [UMShareWebpageObject shareObjectWithTitle:title descr:description thumImage:thumbnail];
        shareObject.webpageUrl = [dic objectForKey:@"url"];
        messageObject.shareObject = shareObject;
      } else {
        UMShareImageObject *shareObject = [[UMShareImageObject alloc]init];
        shareObject.shareImage = thumbnail;
        messageObject.shareObject = shareObject;
      }
      //调用分享接口
      [[UMSocialManager defaultManager] shareToPlatform:platformType messageObject:messageObject currentViewController:nil completion:^(id data, NSError *error) {
        
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
        callback( [[NSArray alloc] initWithObjects:code,message, nil]);
      }];
      
    }];
  });
}

@end
