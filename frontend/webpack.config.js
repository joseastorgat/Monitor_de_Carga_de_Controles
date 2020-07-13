const webpack = require('webpack'); 

module.exports = (env) => {

    var mode = process.env.NODE_ENV || 'development';

    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
      }, {});

    return {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.css$/,
                    loaders: ['style-loader', 'css-loader'],
                }
            ],
        },
        plugins: [
            new webpack.DefinePlugin(envKeys)
        ]
    
    };
};