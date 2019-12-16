var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
  urls = ['http://www.imdb.com/title/tt1229340/','https://medium.com/'];
    var promises = [];
   
    for(var url of urls) {
      promises.push(new Promise((resolve, reject)=>{
        request(url, function(err, respone, html){
          if(err) {
            return reject(err);
          }
          resobj = {url:"",count :"",param:""};
          var $ = cheerio.load(html);
          var items = [];
          links = $('a');
          $(links).each(function(i, link){
            var href = $(link).attr('href');
            items.push(href)
            items = [... new Set(items)];   //Removing duplicate entries in the array
            resobj.url = items; 
          });
          hcount = items.length;
          resobj.count = hcount;
          return resolve(resobj);
        });
      }))
    }

    Promise.all(promises).then((results)=>{
      console.log('res',results);
      res.send(results);
    }).catch((error)=>{
      console.log(error);
    });
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
