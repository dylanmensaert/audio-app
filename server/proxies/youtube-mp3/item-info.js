var proxyPath = 'a/itemInfo/';

module.exports = function(app) {
    // For options, see:
    // https://github.com/nodejitsu/node-http-proxy
    var proxy = require('http-proxy').createProxyServer({
        changeOrigin: true
    });

    proxy.on('error', function(err, req) {
        console.error(err, req.url);
    });

    app.use('/' + proxyPath, function(req, res, next) {
        // include root path in proxied request
        req.url = req.url.slice(0, 1) + proxyPath + req.url.slice(1);

        proxy.web(req, res, {
            target: 'http://www.youtube-mp3.org'
        });
    });
};
