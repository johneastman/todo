# TODO

A shopping/to-do list app in React Native. The purpose of this project is to rebuild my [Shopper](https://github.com/johneastman/Shopper) Android app in React Native, a modern mobile development framework that will also ensure my app is cross platform.

## Helpful Resources

-   Creating a React Native project with TypeScript: https://reactnative.dev/docs/typescript
-   Running your app on a device: https://reactnative.dev/docs/running-on-device
-   Authorize Android device with expo: https://github.com/expo/fyi/blob/main/authorize-android-device.md
-   Publish to Google Play/Download to device: https://reactnative.dev/docs/signed-apk-android.html

## Run on Android Device

1. Download Android Studio
1. Install [`Android 13 (Tiramisu)`](https://reactnative.dev/docs/environment-setup?guide=native#android-sdk)
1. From this project's root directory, run:
    1. `chmod +x start-app.sh `
    1. `./start-all.sh`

Note: May need to run `npx react-native start` instead.

Additional steps/resources can be found [here](https://reactnative.dev/docs/environment-setup?guide=native).

## App Icon and Splash Screen

### Android

#### Icon

Replace the images in the directories under `android/app/src/main/res` with the images in matching directories under `assets/icons/android` (for example, replace the files in `android/app/src/main/res/mipmap-anydpi-v26` with the files in `assets/icons/android/mipmap-anydpi-v26`):

-   mipmap-anydpi-v26
-   mipmap-hdpi
-   mipmap-ldpi
-   mipmap-xhdpi
-   mipmap-xxhdpi
-   mipmap-xxxhdpi

Icons can be generated with [easyappicon.com](https://easyappicon.com/).

#### Splash Screen

Replace the files in the following directories with `splashscreen_image.png` in `assets/icons/android/splashscreen_image.png`:

-   drawable-hdpi
-   drawable-mdpi
-   drawable-xhdpi
-   drawable-xxhdpi
-   drawable-xxxhdpi

## Asset Attributions

-   <a href="https://www.flaticon.com/free-icons/next" title="next icons">Next icons created by Roundicons - Flaticon</a>
-   <a href="https://www.flaticon.com/free-icons/tick" title="tick icons">Tick icons created by Maxim Basinski Premium - Flaticon</a>
-   <a href="https://www.flaticon.com/free-icons/to-do-list" title="to-do-list icons">To-do-list icons created by Graphics Plazza - Flaticon</a>

## Development Notes

-   [This commit](https://github.com/johneastman/todo/commit/9a2057b1917fdb755e847a0035733668f589ff11#diff-160b2590964a24e07144d14fabcc65c2d080c70128eca667934f1061644b2690) removed `react-native-reanimated` mock to resolve this error:
    ```
    TypeError: Cannot set property setGestureState of [object Object] which has only a getter.
    ```
    Additional resource: https://github.com/computerjazz/react-native-draggable-flatlist/blob/main/tests/index.test.js
