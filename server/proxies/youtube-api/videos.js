var proxyPath = '/youtube/v3/videos';

module.exports = function (app) {
    // For options, see:
    // https://github.com/nodejitsu/node-http-proxy
    var proxy = require('http-proxy').createProxyServer({
        secure: false,
        changeOrigin: true
    });

    proxy.on('error', function (err, req) {
        console.error(err, req.url);
    });

    app.use(proxyPath, function (req, res, next) {
        // include root path in proxied request
        req.url = proxyPath + '/' + req.url;

        proxy.web(req, res, {
            target: 'https://www.googleapis.com'
        });
    });
};
