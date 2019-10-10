(function($) {

  String.prototype.twitter = function(limit, cb, doneCb) {
    if ($.isFunction(limit)) {
      doneCb = cb;
      cb = limit;
      limit = 2;
    }

    // Accounting for retweets which don't come back
    var maxTweets = limit + 5;

    var dateHandler = function(dateStr) {
      var values = dateStr.split(" ");
      timeValue = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
      var date = Date.parse(timeValue);
      var offset = new Date().getTimezoneOffset() * 60000;
      var result = new Date(date - offset);      

      return result;
    }

    var count = 0;
    var url = 'http://api.twitter.com/statuses/user_timeline.json?screen_name=' + this + '&count=' + maxTweets + '&callback=?';
    var username = this;

    $.getJSON(url, function(response) {
      var upper = response.length < limit ? response.length : limit;
      $.each(response.slice(0, upper), function(k, tweet) {
        var url = 'http://twitter.com/' + username + '/statuses/' + tweet.id_str;
        var status = tweet.text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
          return '<a href="' + url + '">' + url + '</a>';
        }).replace(/\B@([_a-z0-9]+)/ig, function(reply) {
          return  reply.charAt(0) + '<a href="http://twitter.com/' + reply.substring(1) + '">' + reply.substring(1) + '</a>';
        });
        var result = {
          username: tweet.user.screen_name,
          url: url,
          status: status,
          createdAt: dateHandler(tweet.created_at)
        }

        count++;

        cb.call(result);
        count == upper && doneCb && doneCb.call();
      })
    });
  }

})(jQuery);
