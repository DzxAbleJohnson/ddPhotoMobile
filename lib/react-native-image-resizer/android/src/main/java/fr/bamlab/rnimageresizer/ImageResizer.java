package fr.bamlab.rnimageresizer;

import android.content.Context;
import android.content.ContentResolver;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Typeface;
import android.media.ExifInterface;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Base64;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.IOException;
import java.util.Date;

/**
 * Provide methods to resize and rotate an image file.
 */
class ImageResizer {
    private final static String IMAGE_JPEG = "image/jpeg";
    private final static String IMAGE_PNG = "image/png";
    private final static String SCHEME_DATA = "data";
    private final static String SCHEME_CONTENT = "content";
    private final static String SCHEME_FILE = "file";

    /**
     * Resize the specified bitmap, keeping its aspect ratio.
     */
    private static Bitmap resizeImage(Bitmap image, int maxWidth, int maxHeight) {
        Bitmap newImage = null;
        if (image == null) {
            return null; // Can't load the image from the given path.
        }

        if (maxHeight > 0 && maxWidth > 0) {
            float width = image.getWidth();
            float height = image.getHeight();

            float ratio = Math.min((float)maxWidth / width, (float)maxHeight / height);

            int finalWidth = (int) (width * ratio);
            int finalHeight = (int) (height * ratio);
            newImage = Bitmap.createScaledBitmap(image, finalWidth, finalHeight, true);
        }

        return newImage;
    }

    /**
     * Rotate the specified bitmap with the given angle, in degrees.
     */
    public static Bitmap rotateImage(Bitmap source, float angle)
    {
        Bitmap retVal;

        Matrix matrix = new Matrix();
        matrix.postRotate(angle);
        retVal = Bitmap.createBitmap(source, 0, 0, source.getWidth(), source.getHeight(), matrix, true);
        return retVal;
    }

    /**
     * Save the given bitmap in a directory. Extension is automatically generated using the bitmap format.
     */
    private static File saveImage(Bitmap bitmap, File saveDirectory, String fileName,
                                    Bitmap.CompressFormat compressFormat, int quality)
            throws IOException {
        if (bitmap == null) {
            throw new IOException("The bitmap couldn't be resized");
        }

        File newFile = new File(saveDirectory, fileName + "." + compressFormat.name());
        if(!newFile.createNewFile()) {
            throw new IOException("The file already exists");
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        bitmap.compress(compressFormat, quality, outputStream);
        byte[] bitmapData = outputStream.toByteArray();

        outputStream.flush();
        outputStream.close();

        FileOutputStream fos = new FileOutputStream(newFile);
        fos.write(bitmapData);
        fos.flush();
        fos.close();

        return newFile;
    }

    /**
     * Get {@link File} object for the given Android URI.<br>
     * Use content resolver to get real path if direct path doesn't return valid file.
     */
    private static File getFileFromUri(Context context, Uri uri) {

        // first try by direct path
        File file = new File(uri.getPath());
        if (file.exists()) {
            return file;
        }

        // try reading real path from content resolver (gallery images)
        Cursor cursor = null;
        try {
            String[] proj = {MediaStore.Images.Media.DATA};
            cursor = context.getContentResolver().query(uri, proj, null, null, null);
            int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
            cursor.moveToFirst();
            String realPath = cursor.getString(column_index);
            file = new File(realPath);
        } catch (Exception ignored) {
        } finally {
            if (cursor != null) {
                cursor.close();
            }
        }

        return file;
    }


    /**
     * Get orientation by reading Image metadata
     */
    public static int getOrientation(Context context, Uri uri) {
        try {
            File file = getFileFromUri(context, uri);
            if (file.exists()) {
                ExifInterface ei = new ExifInterface(file.getAbsolutePath());
                return getOrientation(ei);
            }
        } catch (Exception ignored) { }

        return 0;
    }

    /**
     * Convert metadata to degrees
     */
    public static int getOrientation(ExifInterface exif) {
        int orientation = exif.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);
        switch (orientation) {
            case ExifInterface.ORIENTATION_ROTATE_90:
                return 90;
            case ExifInterface.ORIENTATION_ROTATE_180:
                return 180;
            case ExifInterface.ORIENTATION_ROTATE_270:
                return 270;
            default:
                return 0;
        }
    }

    /**
     * Compute the inSampleSize value to use to load a bitmap.
     * Adapted from https://developer.android.com/training/displaying-bitmaps/load-bitmap.html
     */
    private static int calculateInSampleSize(BitmapFactory.Options options, int reqWidth, int reqHeight) {
        final int height = options.outHeight;
        final int width = options.outWidth;

        int inSampleSize = 1;

        if (height > reqHeight || width > reqWidth) {
            final int halfHeight = height / 2;
            final int halfWidth = width / 2;

            // Calculate the largest inSampleSize value that is a power of 2 and keeps both
            // height and width larger than the requested height and width.
            while ((halfHeight / inSampleSize) >= reqHeight && (halfWidth / inSampleSize) >= reqWidth) {
                inSampleSize *= 2;
            }
        }

        return inSampleSize;
    }

    /**
     * Load a bitmap either from a real file or using the {@link ContentResolver} of the current
     * {@link Context} (to read gallery images for example).
     *
     * Note that, when options.inJustDecodeBounds = true, we actually expect sourceImage to remain
     * as null (see https://developer.android.com/training/displaying-bitmaps/load-bitmap.html), so
     * getting null sourceImage at the completion of this method is not always worthy of an error.
     */
    private static Bitmap loadBitmap(Context context, Uri imageUri, BitmapFactory.Options options) throws IOException {
        Bitmap sourceImage = null;
        String imageUriScheme = imageUri.getScheme();
        if (imageUriScheme == null || !imageUriScheme.equalsIgnoreCase(SCHEME_CONTENT)) {
            try {
                sourceImage = BitmapFactory.decodeFile(imageUri.getPath(), options);
            } catch (Exception e) {
                e.printStackTrace();
                throw new IOException("Error decoding image file");
            }
        } else {
            ContentResolver cr = context.getContentResolver();
            InputStream input = cr.openInputStream(imageUri);
            if (input != null) {
                sourceImage = BitmapFactory.decodeStream(input, null, options);
                input.close();
            }
        }
        return sourceImage;
    }

    /**
     * Loads the bitmap resource from the file specified in imagePath.
     */
    private static Bitmap loadBitmapFromFile(Context context, Uri imageUri, int newWidth,
                                             int newHeight) throws IOException  {
        // Decode the image bounds to find the size of the source image.
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        loadBitmap(context, imageUri, options);

        // Set a sample size according to the image size to lower memory usage.
        options.inSampleSize = calculateInSampleSize(options, newWidth, newHeight);
        options.inJustDecodeBounds = false;
        return loadBitmap(context, imageUri, options);

    }

    /**
     * Loads the bitmap resource from a base64 encoded jpg or png.
     * Format is as such:
     * png: 'data:image/png;base64,iVBORw0KGgoAA...'
     * jpg: 'data:image/jpeg;base64,/9j/4AAQSkZJ...'
     */
    private static Bitmap loadBitmapFromBase64(Uri imageUri) {
        Bitmap sourceImage = null;
        String imagePath = imageUri.getSchemeSpecificPart();
        int commaLocation = imagePath.indexOf(',');
        if (commaLocation != -1) {
            final String mimeType = imagePath.substring(0, commaLocation).replace('\\','/').toLowerCase();
            final boolean isJpeg = mimeType.startsWith(IMAGE_JPEG);
            final boolean isPng = !isJpeg && mimeType.startsWith(IMAGE_PNG);

            if (isJpeg || isPng) {
                // base64 image. Convert to a bitmap.
                final String encodedImage = imagePath.substring(commaLocation + 1);
                final byte[] decodedString = Base64.decode(encodedImage, Base64.DEFAULT);
                sourceImage = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
            }
        }

        return sourceImage;
    }

    /**
     * Create a resized version of the given image.
     */
    public static File createResizedImage(Context context, Uri imageUri, int newWidth,
                                          int newHeight, Bitmap.CompressFormat compressFormat,
                                          int quality, int rotation, String outputPath) throws IOException  {
        Bitmap sourceImage = null;
        String imageUriScheme = imageUri.getScheme();
        if (imageUriScheme == null || imageUriScheme.equalsIgnoreCase(SCHEME_FILE) || imageUriScheme.equalsIgnoreCase(SCHEME_CONTENT)) {
            sourceImage = ImageResizer.loadBitmapFromFile(context, imageUri, newWidth, newHeight);
        } else if (imageUriScheme.equalsIgnoreCase(SCHEME_DATA)) {
            sourceImage = ImageResizer.loadBitmapFromBase64(imageUri);
        }

        if (sourceImage == null) {
            throw new IOException("Unable to load source image from path");
        }

        // Scale it first so there are fewer pixels to transform in the rotation
        Bitmap scaledImage = ImageResizer.resizeImage(sourceImage, newWidth, newHeight);
        if (sourceImage != scaledImage) {
            sourceImage.recycle();
        }

        // Rotate if necessary
        Bitmap rotatedImage = scaledImage;
        int orientation = getOrientation(context, imageUri);
        rotation = orientation + rotation;
        rotatedImage = ImageResizer.rotateImage(scaledImage, rotation);

        if (scaledImage != rotatedImage) {
            scaledImage.recycle();
        }

        // Save the resulting image
        File path = context.getCacheDir();
        if (outputPath != null) {
            path = new File(outputPath);
        }

        File newFile = ImageResizer.saveImage(rotatedImage, path,
                Long.toString(new Date().getTime()), compressFormat, quality);

        // Clean up remaining image
        rotatedImage.recycle();

        return newFile;
    }

    public static File createMarkerImage(Context context, Uri imageUri, int width, Bitmap.CompressFormat compressFormat,
                                         int quality, String shape, String color, int index, String outputPath) throws IOException  {


        int containerWidth = 160;
        int containerPadding = 25;
        int iconWidth = containerWidth - (containerPadding * 2);
        int strokeWidth = width * 2;
        int iconInsideWidth = iconWidth - (strokeWidth * 2);

        BitmapFactory.Options bmOptions = new BitmapFactory.Options();
        Bitmap bm = BitmapFactory.decodeFile(imageUri.getPath(), bmOptions);
        Bitmap bmInside = Bitmap.createBitmap(iconInsideWidth, iconInsideWidth, Bitmap.Config.ARGB_8888);
        Bitmap bmOutsideShadow = Bitmap.createBitmap(containerWidth, containerWidth, Bitmap.Config.ARGB_8888);
        Bitmap bmOutside = Bitmap.createBitmap(containerWidth, containerWidth, Bitmap.Config.ARGB_8888);
        Bitmap bmResult = Bitmap.createBitmap(containerWidth, containerWidth, Bitmap.Config.ARGB_8888);

        Canvas canvasResult = new Canvas(bmResult);
        if (shape.equals("empty")){
            bm = Bitmap.createScaledBitmap(bm, iconWidth, iconWidth, true);
            canvasResult.drawBitmap(bm, containerPadding, containerPadding, null);
        } else {
            bm = Bitmap.createScaledBitmap(bm, iconInsideWidth, iconInsideWidth, true);
            int id = context.getResources().getIdentifier(shape, "drawable", context.getPackageName());
            Bitmap mask = BitmapFactory.decodeResource(context.getResources(), id);
            Bitmap maskOutsideShadow = Bitmap.createScaledBitmap(mask, iconWidth + 2, iconWidth + 5, true);
            Bitmap maskOutside = Bitmap.createScaledBitmap(mask, iconWidth, iconWidth, true);
            Bitmap maskInside = Bitmap.createScaledBitmap(mask, iconInsideWidth, iconInsideWidth, true);

            Canvas canvasInside = new Canvas(bmInside);
            Paint paintInside = new Paint(Paint.ANTI_ALIAS_FLAG);
            paintInside.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_IN));
            canvasInside.drawBitmap(bm, 0, 0, null);
            canvasInside.drawBitmap(maskInside, 0, 0, paintInside);

            Canvas canvasShadow = new Canvas(bmOutsideShadow);
            //그림자
            Paint paintBGShadow = new Paint();
            paintBGShadow.setStyle(Paint.Style.FILL);
            paintBGShadow.setColor(Color.parseColor("#000000"));
            paintBGShadow.setAlpha(40);
            canvasShadow.drawRect(containerPadding, containerPadding, containerWidth - containerPadding, containerWidth - containerPadding, paintBGShadow);
            // 마스크로 그림자 모양만들기
            Paint paintOutsideShadow = new Paint(Paint.ANTI_ALIAS_FLAG);
            paintOutsideShadow.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_IN));
            canvasShadow.drawBitmap(maskOutsideShadow, containerPadding - 1, containerPadding, paintOutsideShadow);

            Canvas canvasOutside = new Canvas(bmOutside);
            // 라인 색 넣기
            Paint paintBG = new Paint();
            paintBG.setStyle(Paint.Style.FILL);
            paintBG.setColor(Color.parseColor(color));
            canvasOutside.drawRect(containerPadding, containerPadding, containerWidth - containerPadding, containerWidth - containerPadding, paintBG);
            // 마스크로 모양만들기
            Paint paintOutside = new Paint(Paint.ANTI_ALIAS_FLAG);
            paintOutside.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_IN));
            canvasOutside.drawBitmap(maskOutside, containerPadding, containerPadding, paintOutside);
            // 그림자 얹기
            canvasResult.drawBitmap(bmOutsideShadow, 0, 0, null);
            // Outside 얹기
            canvasResult.drawBitmap(bmOutside, 0, 0, null);
            // Inside 얹기
            canvasResult.drawBitmap(bmInside, containerPadding + strokeWidth, containerPadding + strokeWidth, null);
        }

        // 그림자
        Paint paintIndexBGShadow = new Paint();
        paintIndexBGShadow.setColor(Color.parseColor("#000000"));
        paintIndexBGShadow.setAlpha(40);
        canvasResult.drawCircle(20, 23, 20, paintIndexBGShadow);
        // index나오는 동그라미 백그라운드
        Paint paintIndexBG = new Paint();
        paintIndexBG.setColor(Color.parseColor(color));
        canvasResult.drawCircle(20, 20, 20, paintIndexBG);
        // index
        Paint paintIndexText = new Paint();
        if (color.toUpperCase().equals("#FFFFFF") || color.toUpperCase().equals("#D1D1D1")){
            paintIndexText.setColor(Color.parseColor("#000000"));
        } else {
            paintIndexText.setColor(Color.parseColor("#FFFFFF"));
        }
        paintIndexText.setTextSize( 31 );
        paintIndexText.setTextAlign(Paint.Align.CENTER);
        paintIndexText.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        canvasResult.drawText(Integer.toString(index), 20, 30, paintIndexText);

        // Save the resulting image
        File path = context.getCacheDir();
        if (outputPath != null) {
            path = new File(outputPath);
        }
        File newFile = ImageResizer.saveImage(bmResult, path,
                Long.toString(new Date().getTime()), compressFormat, 100);
        return newFile;
    }
}
