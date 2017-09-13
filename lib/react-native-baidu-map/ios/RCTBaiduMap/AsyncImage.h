//
//  AsyncImage.h
//  RCTBaiduMap
//
//  Created by 아이맥 on 2017. 8. 10..
//  Copyright © 2017년 lovebing.org. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface AsyncImage : UIImageView {
    NSURLConnection * connection;
    NSMutableData * data;
}

- (void) loadImageFromURLString:(NSString *)theUrlString;

@end
