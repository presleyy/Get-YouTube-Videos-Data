console.log("Start the api...");
var http = require('http');
var api = require('./youtubeapi');
var url = require('url');

http.createServer(function (req, res) {
    console.log("Begin - request from: "+req.connection.remoteAddress+"; url: "+req.url);
    var parsedUrl = url.parse(req.url, true);
    var queryAsObject = parsedUrl.query;
    if (queryAsObject && queryAsObject.author) {
        api.getVideosByAuthor(queryAsObject.author, function (data) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(data));
            res.end();
            console.log("End - request successfully returned");
        });
    }
    else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write("No author detected!");
        res.end();
        console.log("End - request no data returned");
    }
}).listen(8080);