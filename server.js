const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const app = express();
const { parseQueryParams,isURL } = require('./utils/index');
const {insertData} = require('./models/scrapermodel');
console.log('dfghjk');
app.get("/", function(req, res) {
  console.log('yes');
  urlval = []
  let urls = req.query.url;
  if(urls.length > 5) {
    res.send({
      status : 'nok',
      message : 'Cannot be scraped more than 5 URLS'
    })
  }
  let promises = [];
  for (let url of urls) {
    promises.push(
      new Promise((resolve, reject) => {
        request(url, function(err, respone, html) {
          if (err) {
            return reject(err);
          }
          resobj = { main : "",urlval: "", count: "", param: "" };
          let $ = cheerio.load(html);
          links = $("a");
          let scrapedURLS = [];
          $(links).each(function(i, link) {
            let href = $(link).attr("href");
            if(isURL(href) && href!== undefined) {
              scrapedURLS.push(href);
            }  
          });
          scrapedURLS = [...new Set(scrapedURLS)];
          resobj.urlval = scrapedURLS;
          resobj.main = url;
          return resolve(resobj);
        });
      })
    );
  }

  Promise.all(promises)
    .then(results => {
      finalobj = [];
      mongoobj = {};
      results.forEach((item,index)=>{
        finalres = getURLStructure(item.urlval);
        finalobj.push({url:item.main,result:finalres,count:Object.keys(finalres).length});
      });
      insertData(finalobj);
      res.send({
        status:'ok',
        message :'data inserted',
        data : finalobj
      }); 
    })
    .catch(error => {
      console.log(error);
    });
});


function getURLStructure(urls) {
  let urlStruct = [];
  urls &&
    urls.forEach((item, index) => {
      let urlParam = item.split("?");
      let parameters = Object.keys(parseQueryParams(urlParam[1]));
      let urlStructIndex = getIndex(urlStruct, urlParam[0]);
      if (urlStructIndex !== -1) {
        let paramArr = [...urlStruct[urlStructIndex].param,...parameters];

        urlStruct[urlStructIndex].param = [... new Set(paramArr)];
      } else {
        urlStruct.push({
          url: urlParam[0],
          param: parameters
        });
      }
    });
    console.log('urlstruct',urlStruct);
  return urlStruct;
}

function getIndex(urlStruct, url) {
  let index = urlStruct.findIndex(item => item.url === url);
  return index;
}

app.listen("8081");
console.log("Magic happens on port 8081");
exports = module.exports = app;
