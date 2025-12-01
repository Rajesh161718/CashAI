---
description: How to share and deploy the CashLoop app
---

# Deploying & Sharing CashLoop App

There are several ways to share your CashLoop app with others, depending on your needs:

## Option 1: Quick Share via Expo Go (Easiest - For Testing)

This is the fastest way to let others test your app. They need to install Expo Go on their phones.

### Steps:

1. **Start the development server**
```bash
npm start
```

2. **Publish to Expo**
```bash
npx expo publish
```

3. **Share the link**
   - After publishing, you'll get a URL like: `exp://exp.host/@yourusername/CashAI`
   - Share this link or QR code with others
   - They can scan it with Expo Go app (available on iOS App Store & Google Play Store)

**Pros:** 
- Very quick and easy
- No app store approval needed
- Instant updates

**Cons:**
- Users must have Expo Go installed
- Not a standalone app
- Limited to development/testing

---

## Option 2: Build Standalone Apps (Recommended - Production Ready)

Create actual installable apps (.apk for Android, .ipa for iOS) that don't require Expo Go.

### Prerequisites:

1. **Install EAS CLI**
```bash
npm install -g eas-cli
```

2. **Login to Expo**
```bash
eas login
```

3. **Configure your project**
```bash
eas build:configure
```

### Build for Android (APK/AAB):

**For testing (APK):**
```bash
eas build --platform android --profile preview
```

**For Google Play Store (AAB):**
```bash
eas build --platform android --profile production
```

After the build completes (takes 10-20 minutes), you'll get a download link for the .apk or .aab file.

**Share the APK:**
- Download the .apk file from the provided link
- Share it via Google Drive, Dropbox, or direct download
- Users can install it directly on Android (may need to enable "Install from Unknown Sources")

### Build for iOS (IPA):

**For testing (TestFlight):**
```bash
eas build --platform ios --profile preview
```

**For App Store:**
```bash
eas build --platform ios --profile production
```

**Note:** iOS builds require:
- Apple Developer Account ($99/year)
- Proper certificates and provisioning profiles
- TestFlight for distribution to testers

---

## Option 3: Publish to App Stores (Most Professional)

### Google Play Store (Android):

1. **Create a Google Play Developer account** ($25 one-time fee)
   - Visit: https://play.google.com/console

2. **Build production AAB**
```bash
eas build --platform android --profile production
```

3. **Upload to Google Play Console**
   - Create a new app in the console
   - Upload the .aab file
   - Fill in app details (description, screenshots, etc.)
   - Submit for review (usually takes 1-3 days)

### Apple App Store (iOS):

1. **Create an Apple Developer account** ($99/year)
   - Visit: https://developer.apple.com

2. **Build production IPA**
```bash
eas build --platform ios --profile production
```

3. **Upload to App Store Connect**
   - Use Transporter app or Xcode
   - Fill in app metadata
   - Submit for review (usually takes 1-7 days)

---

## Option 4: Internal Distribution (For Teams/Organizations)

### Android - Direct APK Distribution:

1. Build preview APK (see Option 2)
2. Host on your server or cloud storage
3. Share download link with your team
4. Users install directly

### iOS - TestFlight (Beta Testing):

1. Build with EAS
2. Upload to App Store Connect
3. Add testers via email
4. They install via TestFlight app
5. Can have up to 10,000 testers

---

## Quick Start Recommendation

**For immediate testing with friends/family:**
```bash
# 1. Build Android APK
eas build --platform android --profile preview

# 2. Wait for build to complete (10-20 mins)
# 3. Download the APK from the link provided
# 4. Share the APK file via WhatsApp, Drive, etc.
# 5. Users install and enjoy!
```

**For professional release:**
1. Start with Google Play Store (easier than Apple)
2. Build production AAB
3. Create Play Store listing
4. Submit for review
5. Once approved, anyone can download from Play Store

---

## Important Notes

### Before Building:

1. **Update app.json with proper details:**
   - App name
   - Bundle identifier (e.g., com.yourname.cashloop)
   - Version number
   - Icon and splash screen

2. **Test thoroughly:**
   - Test on real devices
   - Check all features work
   - Verify data persistence

3. **Prepare store assets:**
   - App icon (1024x1024)
   - Screenshots (various sizes)
   - Feature graphic
   - App description
   - Privacy policy (required for stores)

### Cost Summary:

- **Expo Go sharing:** FREE
- **EAS Build (free tier):** Limited builds/month
- **EAS Build (paid):** $29/month for unlimited builds
- **Google Play Store:** $25 one-time
- **Apple App Store:** $99/year

---

## Need Help?

- Expo Documentation: https://docs.expo.dev
- EAS Build Guide: https://docs.expo.dev/build/introduction/
- App Store Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Play Store Guidelines: https://play.google.com/console/about/guides/
