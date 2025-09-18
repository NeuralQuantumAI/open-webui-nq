import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vibecaas.ui',
  appName: 'VibeCaaS UI',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
