plugins {
    id("com.android.application")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "vn.lal.licham"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    defaultConfig {
        // Mã định danh app trên Google Play. PHẢI CHỐT trước khi đưa lên Play (lên rồi không đổi được).
        applicationId = "vn.lal.licham"
        // Yêu cầu Google Play: chạy từ Android 7.0 (API 24), nhắm Android 16 (API 36)
        minSdk = 24
        targetSdk = 36
        // Uses the version code from pubspec.yaml. When using split APKs, 1000 * ABI_VERSION
        // is added automatically by Flutter. (https://developer.android.com/studio/build/configure-apk-splits#configure-APK-versions)
        // You can force using the value of versionCode by specifying the `-P force-version-code-ignoring-abi=true`
        // flag during build.
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    buildTypes {
        release {
            // R8: thu gọn + làm rối code và bỏ tài nguyên thừa ở bản phát hành (yêu cầu Google Play)
            isMinifyEnabled = true
            isShrinkResources = true
            // TẠM ký bằng khóa debug để test. Trước khi lên Google Play phải đổi sang upload key
            // (sẽ hướng dẫn trong PHAT_HANH_GOOGLE_PLAY.md, khóa KHÔNG được commit lên git).
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    }
}

flutter {
    source = "../.."
}
