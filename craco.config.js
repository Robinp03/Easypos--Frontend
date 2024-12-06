import { DefinePlugin } from 'webpack';

module.exports = {
  webpack: {
    plugins: [
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  },
};

