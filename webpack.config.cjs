const path = require('path');

module.exports = {
  entry: './src/main.ts',
  devtool: 'eval-source-map',
  mode:'development',
  plugins: [
    //new BundleAnalyzerPlugin()
  ],
  optimization: {
    chunkIds: 'named',
    concatenateModules: true
  },
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include : [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
      },
      {
        test: /src.*\.html$/,
        loader: "html-loader",
        include : [path.resolve(__dirname, 'src/html')],
        options: {
          sources: false,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.html'],
    fallback: { "stream":false, "assert":false, "http": false, "https":false, "os":false, "url":false, "crypto":false },
    alias: {
      'express-handlebars': 'handlebars/dist/handlebars.js'
    }
  },
  output: {
    publicPath:'app/js',
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app/js'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'app')
    },
    liveReload: false,
    hot: false,
    devMiddleware: {
      writeToDisk: true,
    },
    compress: true,
    allowedHosts: ['localhost', '192.168.1.215.sslip.io']
  },
};