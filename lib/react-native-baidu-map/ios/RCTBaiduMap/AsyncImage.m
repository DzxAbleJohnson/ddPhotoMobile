//
//  AsyncImage.m
//  RCTBaiduMap
//
//  Created by 아이맥 on 2017. 8. 10..
//  Copyright © 2017년 lovebing.org. All rights reserved.
//

#import "AsyncImage.h"


@implementation AsyncImage

- (void)loadImageFromURLString:(NSString *)theUrlString {
    self.image = nil;
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:theUrlString]
                                             cachePolicy:NSURLRequestReturnCacheDataElseLoad
                                         timeoutInterval:30.0];
    
    connection = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    if (![NSThread isMainThread])
    {
        [self performSelectorOnMainThread:@selector(loadImageFromURLString:) withObject:nil waitUntilDone:NO];
        return;
    }
}

- (void)connection:(NSURLConnection *)theConnection
    didReceiveData:(NSData *)incrementalData
{
    if (data == nil)
        data = [[NSMutableData alloc] initWithCapacity:2048];
    
    [data appendData:incrementalData];
}

- (void)connectionDidFinishLoading:(NSURLConnection *)theConnection
{
    self.image = [UIImage imageWithData:data];
    data = nil;
    connection = nil;
}

- (void)dealloc {

}


@end
