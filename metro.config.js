const { getDefaultConfig } = require('@expo/metro-config');

const {
  withSentryConfig
} = require("@sentry/react-native/metro");

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

module.exports = withSentryConfig(defaultConfig);