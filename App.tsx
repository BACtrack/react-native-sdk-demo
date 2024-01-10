import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  Button,
  NativeEventEmitter,
  Image,
  Platform,
} from 'react-native';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
const App = () => {
  const [searchingDeviceState, setTextSearchingDeviceState] = React.useState(
    'Initialize to start',
  );
  const [deviceInformation, setDeviceInformationState] = React.useState('');
  const {BactrackModule} = NativeModules;
  const eventEmitter = new NativeEventEmitter(BactrackModule);

  useEffect(() => {
    const onKeyAuthorized = (event: string) => {
      console.log(`React Native: onKeyAuthorized ${event}`);
    };

    const onKeyAuthorizedSubscription = eventEmitter.addListener(
      'onKeyAuthorized',
      onKeyAuthorized,
    );

    const onKeyDeclined = (event: string) => {
      setTextSearchingDeviceState('Api Key Declined');
      console.log(`React Native: onKeyDeclined ${event}`);
    };

    const onKeyDeclinedSubscription = eventEmitter.addListener(
      'onKeyDeclined',
      onKeyDeclined,
    );

    const onSerialDetected = (event: string) => {
      setDeviceInformationState(`Serial Number: ${event}`);
      console.log(`React Native: onSerialDetected ${event}`);
    };

    const onSerialDetectedSubscription = eventEmitter.addListener(
      'onSerialDetected',
      onSerialDetected,
    );

    const onUuid = (event: string) => {
      setTextSearchingDeviceState(`Device nearby:\n ${event}`);
      console.log(`React Native: onUuid ${event}`);
    };

    const onUuidSubscription = eventEmitter.addListener('onUuid', onUuid);

    const onUseCount = (event: string) => {
      console.log(`React Native: onUseCount ${event}`);
    };

    const onUseCountSubscription = eventEmitter.addListener(
      'onUseCount',
      onUseCount,
    );

    const onBacTrackCountdown = (event: string) => {
      setTextSearchingDeviceState(`Countdown: ${event}`);
      console.log(`React Native: onBacTrackCountdown ${event}`);
    };

    const onBacTrackCountdownSubscription = eventEmitter.addListener(
      'onBacTrackCountdown',
      onBacTrackCountdown,
    );

    const onBacResult = (event: string) => {
      setTextSearchingDeviceState(`BAC Result: ${event}`);
      console.log(`React Native: onBacResult ${event}`);
    };

    const onBacResultSubscription = eventEmitter.addListener(
      'onBacResult',
      onBacResult,
    );

    const onDeviceConnected = (deviceType: any) => {
      let deviceName: string;
      if (deviceType == 0) {
        deviceName = 'bactrack-mobile';
      } else if (deviceType == 2) {
        deviceName = 'bactrack-c6';
      } else if (deviceType == 3) {
        deviceName = 'bactrack-c8';
      } else if (deviceType == 6) {
        deviceName = 'bactrack-mobile-v2';
      } else {
        deviceName = deviceType;
      }
      setTextSearchingDeviceState(`Device connected: ${deviceName}`);
      console.log(`React Native: onDeviceConnected ${deviceType}`);
    };

    const onDeviceConnectedSubscription = eventEmitter.addListener(
      'onDeviceConnected',
      onDeviceConnected,
    );

    const onBacDisconnected = (event: boolean) => {
      setTextSearchingDeviceState('Device Disconnected');
      setDeviceInformationState('');
      console.log(`React Native: onBacDisconnected ${event}`);
    };

    const onBacDisconnectedSubscription = eventEmitter.addListener(
      'onBacDisconnected',
      onBacDisconnected,
    );

    const onBatteryLevel = (event: string) => {
      setDeviceInformationState(`Battery Level: ${event}`);
      console.log(`React Native: onBatteryLevel ${event}`);
    };

    const onBatteryLevelSubscription = eventEmitter.addListener(
      'onBatteryLevel',
      onBatteryLevel,
    );
    const OnBatteryVoltage = (event: string) => {
      console.log(`React Native: OnBatteryVoltage ${event}`);
    };

    const OnBatteryVoltageSubscription = eventEmitter.addListener(
      'OnBatteryVoltage',
      OnBatteryVoltage,
    );

    const onBacTrackStart = (event: boolean) => {
      setTextSearchingDeviceState('Blow now...');
      console.log(`React Native: onBacTrackStart ${event}`);
    };

    const onBacTrackStartSubscription = eventEmitter.addListener(
      'onBacTrackStart',
      onBacTrackStart,
    );

    const onBacTrackBlow = (event: string) => {
      setTextSearchingDeviceState(`Keep blowing... ${event}`);
      console.log(`React Native: onBacTrackBlow ${event}`);
    };

    const onBacTrackBlowSubscription = eventEmitter.addListener(
      'onBacTrackBlow',
      onBacTrackBlow,
    );

    const onBacTrackAnalyzing = (event: boolean) => {
      setTextSearchingDeviceState('Analyzing...');
      console.log(`React Native: onBacTrackAnalyzing ${event}`);
    };

    const onBacTrackAnalyzingSubscription = eventEmitter.addListener(
      'onBacTrackAnalyzing',
      onBacTrackAnalyzing,
    );

    const onError = (event: string) => {
      setTextSearchingDeviceState(`Error: ${event}}`);
      setDeviceInformationState('');
      console.log(`React Native: onError ${event}`);
    };

    const onErrorSubscription = eventEmitter.addListener('onError', onError);

    return () => {
      onKeyAuthorizedSubscription.remove();
      onSerialDetectedSubscription.remove();
      onErrorSubscription.remove();
      onBacTrackAnalyzingSubscription.remove();
      onBacTrackBlowSubscription.remove();
      onBacTrackStartSubscription.remove();
      onBatteryLevelSubscription.remove();
      onBacDisconnectedSubscription.remove();
      onDeviceConnectedSubscription.remove();
      onUseCountSubscription.remove();
      onBacResultSubscription.remove();
      onBacTrackCountdownSubscription.remove();
      onUuidSubscription.remove();
      onKeyDeclinedSubscription.remove();
      OnBatteryVoltageSubscription.remove();
    };
  });

  const requestPermissions = async () => {
    if (Platform.OS === 'ios') {
      return requestMultiple([
        PERMISSIONS.IOS.BLUETOOTH,
        PERMISSIONS.IOS.LOCATION_ALWAYS,
      ]);
    } else {
      return requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      ]);
    }
  };

  const initBactrack = () => {
    BactrackModule.initBACtrack();
  };

  const getBatteryLevel = () => {
    BactrackModule.getBatteryLevel();
  };

  const getSerialNumber = () => {
    BactrackModule.getSerialNumber();
  };

  const startTestCountdown = () => {
    BactrackModule.startTestCountdown();
  };

  const disconnect = () => {
    BactrackModule.disconnect();
  };

  const connectToNearestBreathalyzer = () => {
    BactrackModule.connectToNearestBreathalyzer();
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Image
          style={{flex: 1, width: 250, height: 120, resizeMode: 'contain'}}
          source={require('./bactrack_logo.jpeg')}
        />
        <Text style={styles.text}> BACtrack API - Demo </Text>
        <View style={{height: 30}} />
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            textAlign: 'center',
            color: styles.text.color,
          }}>
          {`${searchingDeviceState}`}
        </Text>
        <View style={{height: 30}} />
        <Text
          style={{fontStyle: 'italic', fontSize: 14, color: styles.text.color}}>
          {`${deviceInformation}`}
        </Text>
        <View style={{height: 30}} />
      </View>
      <View style={styles.container}>
        <Button
          title="Initialize API"
          color={styles.button.color}
          onPress={initBactrack}
        />
        <View style={{height: 10}} />
        <Button
          title="Connect Breathalyzer"
          color={styles.button.color}
          onPress={connectToNearestBreathalyzer}
        />
        <View style={{height: 10}} />
        <Button
          title="Get BatteryLevel"
          color={styles.button.color}
          onPress={getBatteryLevel}
        />
        <View style={{height: 10}} />
        <Button
          title="Get SerialNumber"
          color={styles.button.color}
          onPress={getSerialNumber}
        />
        <View style={{height: 10}} />
        <Button
          title="Start Test Countdown"
          color={styles.button.color}
          onPress={startTestCountdown}
        />
        <View style={{height: 10}} />
        <Button
          title="Disconnect"
          color={styles.button.color}
          onPress={disconnect}
        />
        <View style={{height: 10}} />
        <Button
          title="Request Permissions"
          color="#303d49"
          onPress={requestPermissions}
        />
        <View style={{height: 10}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    color: '#305279',
  },
  text: {
    color: '#01152b',
  },
});
export default App;
