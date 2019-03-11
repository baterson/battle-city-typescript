const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'inline-source-map',
	entry: './src/index.ts',
	output: {
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(png|jp(e*)g|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 4000,
						},
					},
				],
			},
			{
				test: /\.wav$/,
				use: 'file-loader',
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
};
