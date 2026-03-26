# TaskManager Android App

A standalone Android application that wraps the TaskManager web frontend in a native WebView — **no Chrome badge, no browser UI, full immersive experience**.

## Features

- ✅ Full-screen WebView (no address bar, no browser controls)
- ✅ Splash screen while loading
- ✅ Swipe-to-refresh
- ✅ Back button navigates within WebView history
- ✅ Offline detection with retry screen
- ✅ JavaScript, DOM storage, cookies enabled
- ✅ Immersive mode (hides status bar + navigation bar)

## Setup

### 1. Install Android Studio
Download from [developer.android.com](https://developer.android.com/studio)

### 2. Set Your Website URL
Open `app/src/main/java/com/taskmanager/app/MainActivity.java` and update:
```java
private static final String WEBAPP_URL = "https://YOUR-APP.vercel.app/mobile/home";
```

### 3. Replace App Icon
Replace the icon files in:
- `app/src/main/res/mipmap-hdpi/ic_launcher.png` (72×72)
- `app/src/main/res/mipmap-xhdpi/ic_launcher.png` (96×96)
- `app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (144×144)
- `app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192×192)

Or use Android Studio → right-click `res` → **New → Image Asset** to generate all sizes.

### 4. Build Debug APK
```bash
cd android
./gradlew assembleDebug
```
APK output: `app/build/outputs/apk/debug/app-debug.apk`

### 5. Build Release APK (for Play Store)
```bash
./gradlew assembleRelease
```

## Project Structure
```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/taskmanager/app/
│   │   │   ├── MainActivity.java      # WebView + fullscreen + splash
│   │   │   └── OfflineActivity.java   # No-internet screen
│   │   ├── res/
│   │   │   ├── layout/
│   │   │   │   ├── activity_main.xml
│   │   │   │   └── activity_offline.xml
│   │   │   ├── values/
│   │   │   │   ├── colors.xml
│   │   │   │   ├── strings.xml
│   │   │   │   └── styles.xml
│   │   │   └── drawable/
│   │   │       └── splash_background.xml
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
├── settings.gradle
└── gradle.properties
```
