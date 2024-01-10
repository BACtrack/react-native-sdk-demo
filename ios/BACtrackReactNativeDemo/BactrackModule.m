//
//  BatteryTest.m
//  BACtrackReactNativeDemo
//
//  Created by BACtrack
//

#import <Foundation/Foundation.h>
#import "BactrackModule.h"
#import "BACTrack.h"
#import <UIKit/UIKit.h>


@interface BactrackModule () <BacTrackAPIDelegate>
{
  BacTrackAPI * mBacTrack;
}
@end

@implementation BactrackModule
{
  bool hasListeners;
}
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL) requiresMainQueueSetup
{
  return YES;
}
// Will be called when this module's first listener is added.
-(void)startObserving {
  hasListeners = YES;
  // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
  hasListeners = NO;
  // Remove upstream listeners, stop unnecessary background tasks
}

RCT_EXPORT_MODULE();


- (NSArray<NSString *> *)supportedEvents
{
  return @[@"onKeyDeclined", @"onKeyAuthorized", @"onSerialDetected", @"onUuid",  @"onUseCount", @"onBacTrackCountdown", @"onBacResult", @"onDeviceConnected", @"onBacDisconnected",@"OnBatteryVoltage", @"onBatteryLevel", @"onBacTrackStart", @"onBacTrackBlow", @"onBacTrackAnalyzing", @"onError" ];
}


- (id) init
{
  return [super init];
}

-(void)BacTrackAPIKeyAuthorized
{
  NSLog(@"BACtrack: API Key Authorized");
  if(hasListeners) {
    [self sendEventWithName:@"onKeyAuthorized" body: @"true"];
  }
}

//API Key declined for some reason
-(void)BacTrackAPIKeyDeclined:(NSString *)errorMessage
{
  NSLog(@"BACtrack: API Key Declined");
  if(hasListeners) {
    [self sendEventWithName:@"onKeyDeclined" body: errorMessage];
  }
}


-(void)BacTrackSerial:(NSString *)serial_hex
{
  NSLog(@"BACtrack: Serial Number %@", serial_hex);
  if(hasListeners) {
    [self sendEventWithName:@"onSerialDetected" body: serial_hex];
  }
}

-(void)BacTrackUseCount:(NSNumber*)number
{
  NSLog(@"BACtrack: Device Use Count: %d", number.intValue);
  if(hasListeners) {
    [self sendEventWithName:@"onUseCount" body: number.stringValue];
  }
}


-(void)BacTrackError:(NSError*)error
{
  NSLog(@"BACtrack: Error %@", error.localizedDescription);
  if(hasListeners) {
    [self sendEventWithName:@"onError" body: @(error.code).stringValue];
  }
}

-(void)BacTrackCountdown:(NSNumber *)seconds executionFailure:(BOOL)failure
{
  NSLog(@"BACtrack: Countdown: %d", seconds.intValue);

  if(hasListeners) {
    [self sendEventWithName:@"onBacTrackCountdown" body: seconds.stringValue];
  }
}


-(void)BacTrackResults:(CGFloat)bac
{
  NSLog(@"BACtrack: BacTrackResults result %f", bac);
  if(hasListeners) {
    [self sendEventWithName:@"onBacResult" body: [NSString stringWithFormat:@"%f", bac]];
  }
}

-(void)BacTrackConnected:(BACtrackDeviceType)device
{
  if (device == BACtrackDeviceType_Mobile ) {
    NSLog(@"BACtrack: Connected to device: bactrack-mobile");
  } else if (device == BACtrackDeviceType_MobileV2 ) {
    NSLog(@"BACtrack: Connected to device: bactrack-mobile-v2");
  } else if(device == BACtrackDeviceType_C6){
    NSLog(@"BACtrack: Connected to device: bactrack-c6");
  } else if(device == BACtrackDeviceType_C8){
    NSLog(@"BACtrack: Connected to device: bactrack-c8");
  } else {
    NSLog(@"BACtrack: Connected to device: unknown :%d", (int)device);
  }

  if(hasListeners) {
    [self sendEventWithName:@"onDeviceConnected" body: [NSString stringWithFormat:@"%d", ((int)device)]];
  }
}

-(void)BacTrackDisconnected
{
  NSLog(@"BACtrack: Disconnected");
  if(hasListeners) {
    [self sendEventWithName:@"onBacDisconnected" body:@"true"];
  }
}

-(void)BacTrackConnectTimeout
{
  NSLog(@"BACtrack: Connection Timeout");
}

-(NSTimeInterval)BacTrackGetTimeout
{
  return 10;
}


-(void)BacTrackFoundBreathalyzer:(Breathalyzer*)breathalyzer
{
  NSLog(@"BACtrack: FoundBreathalyzer: %@", breathalyzer.peripheral.name.description);
  if(hasListeners) {
    [self sendEventWithName:@"onUuid" body:breathalyzer.uuid];
  }
}

- (void) BacTrackBatteryVoltage:(NSNumber *)number
{
  NSLog(@"BACtrack: Battery Voltage: %@", number.stringValue);

  if(hasListeners) {
    [self sendEventWithName:@"OnBatteryVoltage" body: number.stringValue];
  }
}

- (void) BacTrackBatteryLevel:(NSNumber *)number
{
  NSLog(@"BACtrack: Battery Level: %@",  number.stringValue);

  if(hasListeners) {
    [self sendEventWithName:@"onBatteryLevel" body:number.stringValue];
  }
}


- (void) BacTrackStart {
  NSLog(@"BACtrack: Start");
  if(hasListeners) {
    [self sendEventWithName:@"onBacTrackStart" body:@"true"];
  }
}


- (void)BacTrackBlow:(NSNumber*)breathFractionRemaining {
  NSLog(@"BACtrack: BacTrackBlow breath fraction remaining %@", breathFractionRemaining.stringValue);
  if(hasListeners) {
    [self sendEventWithName:@"onBacTrackBlow" body: breathFractionRemaining.stringValue];
  }
}


- (void) BacTrackAnalyzing {
    NSLog(@"BACtrack: Analyzing results");
    if(hasListeners) {
      [self sendEventWithName:@"onBacTrackAnalyzing" body:@"true"];
    }
}

-(void)dealloc
{
  if (mStopScanTimer)
  {
    [mStopScanTimer invalidate];
    mStopScanTimer = nil;
  }
}

// ACTION METHODS

RCT_EXPORT_METHOD(initBACtrack) {
    NSLog(@"BACtrack: Init BACtrack");
    mBacTrack = [[BacTrackAPI alloc] initWithDelegate:self AndAPIKey:@"You API Key goes here"];
    [mBacTrack startScan];

}

RCT_EXPORT_METHOD(connectToNearestBreathalyzer) {
    NSLog(@"BACtrack: Connect To Nearest Breathalyzer");
    [mBacTrack connectToNearestBreathalyzer];

}


RCT_EXPORT_METHOD(getBatteryLevel){
  NSLog(@"BACtrack: Getting battery level and voltage");
  [mBacTrack getBreathalyzerBatteryLevel];
}

RCT_EXPORT_METHOD(getSerialNumber){
  NSLog(@"BACtrack: Getting serial number");
  [mBacTrack getBreathalyzerSerialNumber];
}


RCT_EXPORT_METHOD(startTestCountdown){
  NSLog(@"BACtrack: Starting Test Countdown");
  [mBacTrack startCountdown];
}


RCT_EXPORT_METHOD(disconnect) {
  NSLog(@"BACtrack: Disconnecting");
  [mBacTrack disconnect];
}

@end
