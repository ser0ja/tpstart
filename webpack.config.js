const {resolve} = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 8888;
const localhost = 'http://' + HOST + ':' + PORT;

const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PRODUCTION = process.env.NODE_ENV === 'production';

const devtool = PRODUCTION ? 'source-map' : 'inline-source-map';

const entry = PRODUCTION
	? './scripts/arm/Arm.tsx'
	: ['react-hot-loader/patch', 'webpack-dev-server/client?' + localhost, 'webpack/hot/only-dev-server', './scripts/arm/Arm.tsx'];

const plugins = PRODUCTION
	? [
		new ExtractTextPlugin({filename: 'style-[contenthash:10].css'}),
		new HtmlWebpackPlugin({filename: './html/index.html'}),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),
		new webpack.optimize.UglifyJsPlugin({
			beautify: false,
			mangle: {
				screw_ie8: true,
				keep_fnames: true
			},
			compress: {
				screw_ie8: true
			},
			comments: false
		})
	]
	: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	];

plugins.push(
	new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
	new webpack.DefinePlugin({
		DEVELOPMENT: JSON.stringify(DEVELOPMENT),
		PRODUCTION: JSON.stringify(PRODUCTION),
	})
);

const cssIndentifier = PRODUCTION ? '[hash:base64:10]' : '[path][name]---[local]';

const cssLoader = PRODUCTION
	? ExtractTextPlugin.extract({
		fallback: 'style-loader',
		use: ['css-loader?minimize&localIdentName=' + cssIndentifier]
	})
	: [
		{loader: 'style-loader'},
		{loader: 'css-loader?importLoaders=1&localIdentName=' + cssIndentifier},
		{
			loader: 'postcss-loader', options: {
			plugins: function(){
				return [require('precss'), require('autoprefixer')]
			}
		}
		}
	];

const scssLoader = PRODUCTION
	? ExtractTextPlugin.extract({
		fallback: 'style-loader',
		use: ['css-loader?importLoaders=1&minimize&localIdentName=' + cssIndentifier, 'sass-loader']
	})
	: [
		{loader: 'style-loader'},
		{loader: 'css-loader?importLoaders=2&localIdentName=' + cssIndentifier},
		{loader: 'css-loader?importLoaders=1&localIdentName=' + cssIndentifier},
		{
			loader: 'postcss-loader', options: {
			plugins: function(){
				return [require('precss'), require('autoprefixer')]
			}
		}
		},
		{loader: 'sass-loader'}
	];

module.exports = {
	entry: entry,
	plugins: plugins,
	context: resolve(__dirname, 'src'),
	output: {
		filename: PRODUCTION ? '[hash:12].[name].min.js' : '[name].js',
		path: resolve(__dirname, 'public'),
		publicPath: PRODUCTION ? '/' : '/'
	},
	
	devServer: {
		host: HOST,
		port: PORT,
		historyApiFallback: true,
		hot: true
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: ['ts-loader']
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: cssLoader
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: scssLoader
			},
			{
				test: /\.(png|jpg|gif)$/,
				exclude: /node_modules/,
				use: ['url-loader?limit=8192&name=images/[hash.12].[ext]']
			},
			{
				test: /\.(svg|eot|ttf|woff|woff2)$/,
				exclude: /node_modules/,
				use: ['url-loader?limit=8192&name=fonts/[hash.12].[ext]']
			}
		]
	},
	externals: {
		"react": "React",
		"react-dom": "ReactDOM"
	},
	devtool: devtool
};
