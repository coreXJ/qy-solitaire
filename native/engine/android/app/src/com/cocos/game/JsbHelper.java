package com.cocos.game;

import android.content.Context;
import android.provider.Settings;
import android.util.Log;

import com.adjust.sdk.Adjust;
import com.cocos.lib.JsbBridgeWrapper;

public class JsbHelper {
    public  static AppActivity act;
    private static final String TAG = "JsbHelper";
    public static void emit(String event, String arg) {
        JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();
        jbw.dispatchEventToScript(event, arg);
    }

    public static void on(String event, JsbBridgeWrapper.OnScriptEventListener func) {
        JsbBridgeWrapper.getInstance().addScriptEventListener(event, func);
    }

    public static void listenEvents() {
        JsbHelper.on("init", arg -> {
            Adjust.getAdid(adid -> {
                Log.d(TAG, "Adjust.getAdid= "+ adid);
                JsbHelper.emit("respAdjustAdid", adid);
            });
            JsbHelper.emit("respDeviceId", getDeviceId(act));
        });
    }


    public static String getDeviceId(Context context) {
        return Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);
    }
}
