module.exports = {
	devtool: 'inline-source-map',
	entry: './src/index.ts',
	output: {
		path: __dirname + '/public',
		filename: 'build/bundle.js',
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
							outputPath: 'build',
						},
					},
				],
			},
			{
				test: /\.flac$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'build',
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
};
