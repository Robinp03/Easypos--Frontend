import webpack from "webpack";

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          vm: require.resolve("vm-browserify"),
          process: require.resolve("process/browser"),
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          process: "process/browser",
          "process.env": JSON.stringify(process.env.NODE_ENV),
        }),
      ],
    },
  },
};



  