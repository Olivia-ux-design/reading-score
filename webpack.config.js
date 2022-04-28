const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',

	// This is necessary because Figma's 'eval' works differently than normal eval
  devtool: argv.mode === 'production' ? false : 'inline-source-map',

  entry: {
    code: './src/code.js', // The entry point for your plugin code
    ui: './src/ui.js' // The entry point for your UI code
  },

  module: {
    rules: [
			// Enables including CSS by doing "import './file.css'" in your TypeScript code
			{ test: /\.css$/, use: ['style-loader', { loader: 'css-loader' }] }
    ]
  },

	// Webpack tries these extensions for you if you omit the extension like "import './file'"
  resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'), // Compile into a folder called "dist"
    publicPath: '/' // missing from original docs
  },

	// Tells Webpack to generate "ui.html" and to inline "ui.ts" into it
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/ui.html',
      filename: 'ui.html',
      inlineSource: '.(js)$',
      chunks: ['ui'],
      inject: 'body', // missing from original docs
      cache: false // missing from original docs
    }),
    new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin)
  ]
});
