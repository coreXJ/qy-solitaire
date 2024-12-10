package com.cocos.game;

import static android.provider.Settings.System.getString;

import android.content.Context;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;

public class FirebaseHelper {


    private final static String TAG = "FirebaseXJ";
    public static void init(Context ctx) {
         FirebaseMessaging.getInstance().getToken()
                 .addOnCompleteListener(new OnCompleteListener<String>() {
                     @Override
                     public void onComplete(@NonNull Task<String> task) {
                         if (!task.isSuccessful()) {
                             Log.w(TAG, "Fetching FCM registration token failed", task.getException());
                             return;
                         }

                         // Get new FCM registration token
                         String token = task.getResult();

                         Log.d(TAG, token);
//                         Toast.makeText(ctx, token, Toast.LENGTH_SHORT).show();
                     }
                 });
    }

}
