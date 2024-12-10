package com.cocos.game;

import android.app.Application;
import android.util.Log;

import com.adjust.sdk.Adjust;
import com.adjust.sdk.AdjustConfig;
import com.adjust.sdk.LogLevel;
import com.google.firebase.FirebaseApp;

public class MyApplication extends Application {

    private static final String TAG = "MyApplication";

    @Override
    public void onCreate() {
        super.onCreate();
        // 在这里进行全局初始化操作
        Log.d(TAG, "Application created");
        FirebaseApp.initializeApp(this);
        initAdjust();
    }

    private void initAdjust() {
        Log.d(TAG, "Adjust init");
        String appToken = "5sppxdncvgcg";
        String environment = AdjustConfig.ENVIRONMENT_SANDBOX;
        AdjustConfig config = new AdjustConfig(this, appToken, environment);
        config.setLogLevel(LogLevel.VERBOSE);
        Adjust.initSdk(config);
        JsbHelper.listenEvents();
//        Adjust.getGoogleAdId(this, googleAdId -> {
//            Log.d(TAG, "Adjust.getGoogleAdId= "+ googleAdId);
////            JsbHelper.nativeToScript("adjustGoogleAdIdResult", googleAdId);
//        });
//
//        JsbHelper.addScriptListener("getAdjustId", result -> {
//            Log.d(TAG, "getAdjustId: " + adjust_id);
//            JsbHelper.nativeToScript("getAdjustIdResult", adjust_id);
//        });
    }

}