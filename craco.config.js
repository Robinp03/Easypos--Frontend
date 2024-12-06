import { DefinePlugin } from 'webpack';

export default {
  webpack: {
    plugins: [
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  },
};

