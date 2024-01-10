//
//  BatteryTest.h
//  BACtrackReactNativeDemo
//
//  Created by BACtrack
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
@interface BactrackModule : RCTEventEmitter <RCTBridgeModule>
{
  NSTimer*                                    mStopScanTimer;
  int                                         mBatteryLevel;
}

@end
