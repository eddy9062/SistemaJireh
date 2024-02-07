import { CapacitorConfig } from '@capacitor/cli';

const appName: string = 'Activos Fijos';

const config: CapacitorConfig = {
  appId: 'gt.com.santaana.activos',
  appName: appName,
  webDir: 'www',
  bundledWebRuntime: false,
  hideLogs: true,
  server: {
    cleartext: true
  },
  android: {
  },
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: "Library/CapacitorDatabase",
      iosIsEncryption: false,
      iosKeychainPrefix: appName,
      iosBiometric: {
        biometricAuth: false,
        biometricTitle : "Biometric login for capacitor sqlite"
      },
      androidIsEncryption: false,
      androidBiometric: {
        biometricAuth : false,
        biometricTitle : "Biometric login for capacitor sqlite",
        biometricSubTitle : "Log in using your biometric"
      },
      electronWindowsLocation: "C:\\ProgramData\\CapacitorDatabases",
      electronMacLocation: "/Volumes/Development_Lacie/Development/CapacitorDatabases",
      electronLinuxLocation: "Databases"
    }
  }
};


export default config;
