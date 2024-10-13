# TODO

A shopping/to-do list app in React Native. The purpose of this project is to rebuild my [Shopper](https://github.com/johneastman/Shopper) Android app in React Native, a modern mobile development framework that will also ensure my app is cross platform.

## Helpful Resources

-   Creating a React Native project with TypeScript: https://reactnative.dev/docs/typescript
-   Running your app on a device: https://reactnative.dev/docs/running-on-device
-   Authorize Android device with expo: https://github.com/expo/fyi/blob/main/authorize-android-device.md
-   Publish to Google Play/Download to device: https://reactnative.dev/docs/signed-apk-android.html

## Setup and Run the App on an Android Device

### Backend

This project has a backend component that must be setup before the app. Follow the instructions [in this repo](https://github.com/johneastman/todo-backend).

### App

1. Create a file in the root directory called `env.json` and add the following data:
   ```
   cat >> env.json <<EOF
   {
       "baseURL": "<BASE_URL>",
       "areTestsRunningOverride": false
   }
   EOF
   ```
    * `BASE_URL` is for the TODO Backend API. 
1. Download node:

   I use [Brew](https://brew.sh/):
   ```
   brew install node
   ```
1. Run npm clean install:
   ```
   npm ci
   ```
1. Download [Android Studio](https://developer.android.com/studio/index.html).
1. Setup [development environment](https://reactnative.dev/docs/set-up-your-environment?platform=android)
1. From this project's root directory, run:

    ```bash
    chmod +x start-app.sh

    ./start-all.sh
    ```

    - Note: May need to run `npx react-native start` instead.
    - Additional steps/resources can be found [here](https://reactnative.dev/docs/environment-setup?guide=native).

1. Stop the app and run the following script to update the icons and splash screen:

    ```bash
    chmod +x move_android_images.sh

    ./move_android_images.sh
    ```

    - NOTE: this script currently only works for Android.

1. Restart the app (`./start-app.sh`), and the icon and splash screen should be updated.

## Run Tests

Run `npm test`.
