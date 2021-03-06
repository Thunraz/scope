module.exports = {
    productionSourceMap: false,

    pages: {
        index: {
            // entry for the page
            entry: 'src/main.js',
            // the source template
            template: 'src/index.pug',
            // output as dist/index.html
            filename: 'index.html',
            // when using title option,
            // template title tag needs to be <title><%= HtmlWebpackPlugin.options.title %></title>
            title: 'Index Page',
            // chunks to include on this page, by default includes
            // extracted common chunks and vendor chunks.
            // chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    },

    runtimeCompiler: true
}