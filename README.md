[![Android License](https://img.shields.io/github/license/BACtrack/breathalyzer-sdk-android)](https://github.com/BACtrack/breathalyzer-sdk-android/blob/main/LICENSE.md)
[![Android](https://jitpack.io/v/BACtrack/breathalyzer-sdk.svg)](https://jitpack.io/#BACtrack/breathalyzer-sdk)
[![iOS](https://img.shields.io/cocoapods/v/BreathalyzerSDK.svg?style=flat)](https://cocoapods.org/pods/BreathalyzerSDK)
[![iOS License](https://img.shields.io/cocoapods/l/BreathalyzerSDK.svg?style=flat)](http://cocoapods.org/pods/BreathalyzerSDK)
![iOS Minimum deployment version](https://img.shields.io/badge/minimum_iOS_deployment_target-iOS13-brightgreen)


## BACtrack React Native Demo
This demo demonstrates the BACtrack SDK bridge for iOS, Android and React Native.
For SDK documentation, visit https://developer.bactrack.com/

## How to use the Demo
In order to start testing, you need to add your API key to `BactrackModule.h` for iOS or `BactrackModule.java` for Android.
After that, you can follow the next steps:

1) Tap on `Request permissions` in order to request Location and Bluetooth permissions
2) Tap on `Initialize` in order to begin scanning for nearby devices.
3) Turn on your breathalyzer.
4) Once the nearby device is discovered, tap on `Connect Breathalyzer` to establish a connection.
5) You can now fetch information such as the serial number or battery status.
6) Additionally, you can also tap on `Start Test Countdown` to start taking a test

## Adding the Breathalyzer SDK
This project serves as reference on how add the SDK to a React Native project.
Here are some steps that needs to be followed to do perform the integration

### **Android**
For reference on how to install the Android SDK, visit the native Github page of the SDK:
https://github.com/BACtrack/breathalyzer-sdk-android

- Run `yarn start`
- Once the server starts run `yarn android`

### **iOS**
For reference on how to install the iOS SDK, visit the native Github page of the SDK:
https://github.com/BACtrack/breathalyzer-sdk-ios

- Open the project file with the extension .xcworkspace
- Add your signing configs to Xcode
- cd to `ios` folder run `pod install`
- Run `yarn start`
- Once the server starts run `yarn ios`
