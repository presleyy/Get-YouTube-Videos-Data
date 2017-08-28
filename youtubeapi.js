var querystring = require('querystring');
var https = require('https');
var async = require('async');

var host = 'www.googleapis.com';
var apiKey = 'REPLACE_API_KEY_HERE';

function performRequest(endpoint, method, params, success) {
  var paramsString = JSON.stringify(params);
  var headers = {};

  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(params);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': paramsString.length
    };
  }
  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = https.request(options, function (res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function (data) {
      responseString += data;
    });

    res.on('end', function () {
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(paramsString);
  req.end();
}

function performRequest_WaterfallOver(endpoint, method, params, signalAttName, iterator_callback, final_callback) {
  function report() {
    if (params[signalAttName] && params[signalAttName] != null)
      performRequest(endpoint, method, params, function (data) {
        iterator_callback(data);
        report();
      });
    else
      final_callback();
  }
  // instead of starting all the iterations, we only start the 1st one
  performRequest(endpoint, method, params, function (data) {
    iterator_callback(data);
    report();
  });
}

exports.getChannels = function (authorname, callback) {
  var requestParams = {
    part: 'contentDetails',
    forUsername: authorname,
    key: apiKey,
    maxResults: 50,
    pageToken: null
  }
  var totalResults = 0;
  var channels = [];
  performRequest_WaterfallOver('/youtube/v3/channels', 'GET', requestParams, "pageToken", function (data) {
    if (data) {
      if (!data.error) {
        totalResults = data.pageInfo.totalResults;
        for (var i = 0; i < data.items.length; i++) {
          var item = data.items[i];
          channels.push(item.contentDetails.relatedPlaylists.uploads)
        }
        requestParams.pageToken = data.nextPageToken;
      }
      else
        requestParams.pageToken = null;
    }
  }, function () {
    payload = {}
    payload.totalResults = totalResults;
    payload.channels = channels;
    callback(payload)
  });
}

exports.getPlaylistItems = function (playlistId, callback) {
  var requestParams = {
    part: 'contentDetails',
    playlistId: playlistId,
    key: apiKey,
    maxResults: 50,
    pageToken: null
  }
  var totalResults = 0;
  var playlistItems = [];
  performRequest_WaterfallOver('/youtube/v3/playlistItems', 'GET', requestParams, "pageToken", function (data) {
    if (data) {
      if (!data.error) {
        totalResults = data.pageInfo.totalResults;
        for (var i = 0; i < data.items.length; i++) {
          var item = data.items[i];
          playlistItems.push(item.contentDetails.videoId)
        }
        requestParams.pageToken = data.nextPageToken;
      }
      else
        requestParams.pageToken = null;
    }
  }, function () {
    payload = {}
    payload.totalResults = totalResults;
    payload.playlistItems = playlistItems;
    callback(payload)
  });
}

exports.getVideosById = function (videoIds, callback) {
  var requestParams = {
    part: 'snippet,contentDetails,statistics',
    id: videoIds,
    key: apiKey,
    maxResults: 50
  }
  var totalResults = 0;
  var videoItems = [];
  performRequest('/youtube/v3/videos', 'GET', requestParams, function (data) {
    if (data) {
      if(!data.error){
        totalResults = data.pageInfo.totalResults;
        for (var i = 0; i < data.items.length; i++) {
          var item = data.items[i];
          videoItems.push(item)
        }
      }
    }
    payload = {}
    payload.totalResults = totalResults;
    payload.videoItems = videoItems;
    callback(payload)
  });
}

function makeGetPlaylistItemsFunction(channels,i){
  return function(channel_callback){
    var channel = channels[i];
    exports.getPlaylistItems(channel, function(data){
      if(data){
        channel_callback(null, data.playlistItems);
      }
    });
  }
}

function makeGetVideosFunction(items,i){
  return function(item_callback){
    var chunkItemStr = items[i].join();
    exports.getVideosById(chunkItemStr, function(data){
      if(data){
        item_callback(null,data.videoItems);
      }
    });
  }
}

exports.getVideosByAuthor = function(username, success){
  async.waterfall([
    function(callback){
      exports.getChannels(username, function(data){
        var channels = [];
        if(data){
          channels = data.channels;
        }
        callback(null, channels);
      })
    },
    function(channels,callback){
      var tasks = [];
      for(var i=0; i<channels.length; i++){
        var getPlaylistItemTask = makeGetPlaylistItemsFunction(channels, i);
        tasks.push(getPlaylistItemTask);
      }
      async.parallelLimit(tasks, 10, function(err, results){
        var playlistitems = [];
        for(var i=0; i<results.length; i++){
          if(results[i].constructor === Array){
            for(var j=0;j<results[i].length;j++){
              playlistitems.push(results[i][j]);
            }
          }
          else{
            playlistitems.push(results[i]);
          }
        }
        callback(null, playlistitems)
      });
    },
    function(playlistitems, callback){
      var tasks = [];
      var chunkSize = 10;
      var chunkItems = [];
      for(var i=0; i<playlistitems.length;i+=chunkSize){
        var chunkItem = playlistitems.slice(i,i+chunkSize);
        chunkItems.push(chunkItem);
      }
      for(var i=0; i<chunkItems.length;i++){
        var getVideoTask = makeGetVideosFunction(chunkItems, i);
        tasks.push(getVideoTask);
      }
      async.parallelLimit(tasks,10,function(err, results){
        var videoItems = [];
        for(var i=0; i<results.length; i++){
          if(results[i].constructor === Array){
            for(var j=0;j<results[i].length;j++){
              videoItems.push(results[i][j]);
            }
          }
          else{
            videoItems.push(results[i]);
          }
        }
        callback(null, videoItems)
      })
    }
  ], function(err, result){
    if(result){
      success(result);
    }
  });
}