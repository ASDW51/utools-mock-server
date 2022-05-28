var path = require("path")
const webpack = require('webpack');
console.log(webpack)
const nodePoly = require("node-polyfill-webpack-plugin")
module.exports = {
    mode:'development',
    target:"node",
    entry:"./public/require.js",
    output:{
        filename:"require.js",
        path:path.join(__dirname,"dist")
    },
    resolve:{
        fallback: {
            setImmediate: require.resolve('./setImmediate.js'),
        }
    },
    node:{
        global:true
    },
    plugins:[
        new nodePoly(),
        new webpack.ProvidePlugin(['global']),
        new webpack.ProvidePlugin({
            Buffer:["buffer","Buffer"]
        }),
    ]
}