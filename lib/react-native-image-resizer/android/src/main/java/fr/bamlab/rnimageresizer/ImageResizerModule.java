package fr.bamlab.rnimageresizer;

import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.io.IOException;


class ImageResizerModule extends ReactContextBaseJavaModule {
    private Context context;

    public ImageResizerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
    }

    /**
     * @return the name of this module. This will be the name used to {@code require()} this module
     * from javascript.
     */
    @Override
    public String getName() {
        return "ImageResizerAndroid";
    }

    @ReactMethod
    public void createResizedImage(String imagePath, int newWidth, int newHeight, String compressFormat,
                                   int quality, int rotation, String outputPath, final Callback successCb, final Callback failureCb) {
        try {
            createResizedImageWithExceptions(imagePath, newWidth, newHeight, compressFormat, quality,
                    rotation, outputPath, successCb, failureCb);
        } catch (IOException e) {
            failureCb.invoke(e.getMessage());
        }
    }

    private void createResizedImageWithExceptions(String imagePath, int newWidth, int newHeight,
                                                  String compressFormatString, int quality, int rotation, String outputPath,
                                                  final Callback successCb, final Callback failureCb) throws IOException {
        Bitmap.CompressFormat compressFormat = Bitmap.CompressFormat.valueOf(compressFormatString);
        Uri imageUri = Uri.parse(imagePath);
        File resizedImage = ImageResizer.createResizedImage(this.context, imageUri, newWidth,
                newHeight, compressFormat, quality, rotation, outputPath);
        // If resizedImagePath is empty and this wasn't caught earlier, throw.
        if (resizedImage.isFile()) {
            WritableMap response = Arguments.createMap();
            response.putString("path", resizedImage.getAbsolutePath());
            response.putString("uri", Uri.fromFile(resizedImage).toString());
            response.putString("name", resizedImage.getName());
            response.putDouble("size", resizedImage.length());
            // Invoke success
            successCb.invoke(response);
            System.out.println(" ::: " + resizedImage.getAbsolutePath());
            File testFile = new File(resizedImage.getAbsolutePath());
            System.out.println(testFile.exists());
        } else {
            failureCb.invoke("Error getting resized image path");
        }
    }

    @ReactMethod
    public void createMarkerImage(String imagePath, int width, String compressFormat,
                                   int quality, String shape, String color, int index, String outputPath, final Callback successCb, final Callback failureCb) {
        try {
            createMarkerImageWithExceptions(imagePath, width, compressFormat, quality,
                    shape, color, index, outputPath, successCb, failureCb);
        } catch (IOException e) {
            failureCb.invoke(e.getMessage());
        }
    }

    private void createMarkerImageWithExceptions(String imagePath, int width, String compressFormatString,
                                                 int quality, String shape, String color, int index, String outputPath,
                                                  final Callback successCb, final Callback failureCb) throws IOException {
        Bitmap.CompressFormat compressFormat = Bitmap.CompressFormat.valueOf(compressFormatString);
        Uri imageUri = Uri.parse(imagePath);
        File markerImage = ImageResizer.createMarkerImage(this.context, imageUri, width, compressFormat, quality,
                shape, color, index, outputPath);
        // If resizedImagePath is empty and this wasn't caught earlier, throw.
        if (markerImage.isFile()) {
            WritableMap response = Arguments.createMap();
            response.putString("path", markerImage.getAbsolutePath());
            response.putString("uri", Uri.fromFile(markerImage).toString());
            response.putString("name", markerImage.getName());
            response.putDouble("size", markerImage.length());
            // Invoke success
            successCb.invoke(response);
        } else {
            failureCb.invoke("Error getting resized image path");
        }
    }
}
