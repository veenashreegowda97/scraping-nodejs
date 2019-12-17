const parseQueryParams = function parseQuery(queryString) {
    let query = {};
    if (!queryString) return query;
    let pairs = (queryString[0] === "?"
      ? queryString.substr(1)
      : queryString
    ).split("&");
    for (var i = 0; i < pairs.length; i++) {
      let pair = pairs[i].split("=");
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
    }
    return query;
  }

  const isURL=(str)=> { 
    const pattern = new RegExp('^(https?:\\/\\/)?'+ '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ '((\\d{1,3}\\.){3}\\d{1,3}))'+ '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ '(\\?[;&a-z\\d%_.~+=-]*)?'+ '(\\#[-a-z\\d_]*)?$','i');  
    return pattern.test(str); 
  }

  module.exports = {
    parseQueryParams, isURL
  };
  
