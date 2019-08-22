function getPlugin(context, name) {
  return context.plugins.find(p => p.constructor.name === name);
}

module.exports = context => {
  // Fix filename clash in MiniCssExtractPlugin
  const miniCssExtractPlugin = getPlugin(context, 'MiniCssExtractPlugin');
  miniCssExtractPlugin.options.filename = '[id].styles.css';
  miniCssExtractPlugin.options.moduleFilename = name => {
    return '[id].styles.css';
  };

  // Add entrypoint for webview script
  context.entry.webview = ['./src/webview/index.ts'];

  // Don't bundle the webview script into the index.html file
  const htmlWebpackPlugin = getPlugin(context, 'HtmlWebpackPlugin');
  htmlWebpackPlugin.options.chunks = ['renderer'];

  // Make webpack-dev-server write changes to disk
  // Also disable hot reloading because it causes errors in the webview script
  if (context.devServer) {
    context.devServer.writeToDisk = true;
    context.devServer.hot = false;
    context.devServer.inline = false;
  }

  return context;
};
