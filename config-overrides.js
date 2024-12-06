import {webpack} from 'webpack';

export function override(config, env) {
  config.resolve.fallback = {
    "crypto": webpack.resolve("crypto-browserify"),
    "stream": webpack.resolve("stream-browserify"),
    "util": webpack.resolve("util/"),
  };
  return config;
};
