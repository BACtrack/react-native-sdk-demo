package com.bactrackreactnativedemo;

import android.util.Log;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import BreathalyzerSDK.API.BACtrackAPI;
import BreathalyzerSDK.API.BACtrackAPICallbacks;
import BreathalyzerSDK.Constants.BACTrackDeviceType;
import BreathalyzerSDK.Constants.BACtrackUnit;
import BreathalyzerSDK.Exceptions.BluetoothLENotSupportedException;
import BreathalyzerSDK.Exceptions.BluetoothNotEnabledException;
import BreathalyzerSDK.Exceptions.LocationServicesNotEnabledException;

public class BactrackModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private static final String BACTRACK_API_KEY = "Your API Key goes here";
    private BACtrackAPI mAPI;
    BactrackModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "BactrackModule";
    }

    private void sendEvent(
        ReactContext reactContext,
        String eventName,
        String params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }




    private final BACtrackAPICallbacks mCallbacks = new BACtrackAPICallbacks() {
        @Override
        public void BACtrackAPIKeyDeclined(String errorMessage) {
            sendEvent(reactContext, "onKeyDeclined", errorMessage);
        }

        @Override
        public void BACtrackAPIKeyAuthorized() {
            sendEvent(reactContext, "onKeyAuthorized", "true");
        }

        @Override
        public void BACtrackConnected(BACTrackDeviceType bacTrackDeviceType) {
            sendEvent(reactContext, "onDeviceConnected", bacTrackDeviceType.getDisplayName());
        }

        @Override
        public void BACtrackDidConnect(String s) {
            Log.d("DEBUG_TAG", "BACtrackDidConnect: " + s);
        }

        @Override

        public void BACtrackDisconnected() {
            sendEvent(reactContext, "onBacDisconnected", "true");
        }

        @Override
        public void BACtrackConnectionTimeout() {
            Log.d("DEBUG_TAG", "BACtrackConnectionTimeout: ");
        }

        @Override
        public void BACtrackUnits(BACtrackUnit unit) {
            Log.d("DEBUG_TAG", "BACtrackUnits: " + unit.name());
        }

        @Override
        public void BACtrackFoundBreathalyzer(BACtrackAPI.BACtrackDevice BACtrackDevice) {
            Log.d("DEBUG_TAG", "BACtrackFoundBreathalyzer: " + BACtrackDevice.device);
        }

        @Override
        public void BACtrackCountdown(int currentCountdownCount) {
            sendEvent(reactContext, "onBacTrackCountdown", String.valueOf((currentCountdownCount)));
        }

        @Override
        public void BACtrackStart() {
            sendEvent(reactContext, "onBacTrackStart", "true");
        }

        @Override
        public void BACtrackBlow(float blowFractionRemaining) {
            sendEvent(reactContext, "onBacTrackBlow", String.valueOf(blowFractionRemaining));
        }

        @Override
        public void BACtrackAnalyzing() {
            sendEvent(reactContext, "onBacTrackAnalyzing", "true");
        }

        @Override
        public void BACtrackResults(float measuredBac) {
            sendEvent(reactContext, "onBacResult", String.valueOf(measuredBac));
        }

        @Override
        public void BACtrackFirmwareVersion(String version) {
            sendEvent(reactContext, "onFirmwareVersion", version);
        }

        @Override
        public void BACtrackSerial(String serialHex) {
            sendEvent(reactContext, "onSerialDetected", serialHex);
        }

        @Override
        public void BACtrackUseCount(int useCount) {
            sendEvent(reactContext, "onUseCount", String.valueOf(useCount));
        }

        @Override
        public void BACtrackBatteryVoltage(float voltage) {
            sendEvent(reactContext, "OnBatteryVoltage", String.valueOf(voltage));

        }

        @Override
        public void BACtrackBatteryLevel(int level) {
            sendEvent(reactContext, "onBatteryLevel", String.valueOf(level));
        }

        @Override
        public void BACtrackError(int errorCode) {
            sendEvent(reactContext, "onError", String.valueOf(errorCode));
        }
    };

    @ReactMethod
    public void initBACtrack() {
        try {
            mAPI = new BACtrackAPI(reactContext, mCallbacks, BACTRACK_API_KEY);
        } catch (BluetoothLENotSupportedException | BluetoothNotEnabledException |
                 LocationServicesNotEnabledException e) {
            sendEvent(reactContext, "onError", "Permissions not granted");
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void connectToNearestBreathalyzer() {
        if (mAPI != null) {
            mAPI.connectToNearestBreathalyzer();
        }
    }

    @ReactMethod
    public void getBatteryLevel() {
        if (mAPI != null) {
            mAPI.getBreathalyzerBatteryVoltage();
        }
    }

    @ReactMethod
    public void getSerialNumber() {
        if (mAPI != null) {
            mAPI.getSerialNumber();
        }
    }

    @ReactMethod
    public void startTestCountdown() {
        if (mAPI != null) {
            mAPI.startCountdown();
        }
    }

    @ReactMethod
    public void disconnect() {
        if (mAPI != null) {
             mAPI.disconnect();
        }
    }


    @ReactMethod
    public void addListener(String eventName) {
        Log.d("DEBUG_TAG", "addListener: " + eventName);

    }

    @ReactMethod
    public void removeListeners(Integer count) {
        Log.d("DEBUG_TAG", "removeListeners: " + count);
    }

}



