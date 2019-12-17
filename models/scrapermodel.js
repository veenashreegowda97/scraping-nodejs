const MongoClient = require('mongodb').MongoClient;
const insertData = function getDataFromDynamoDB(json) {
    var uri = "mongodb://Veena:veenapackeer@cluster0-shard-00-00-ood86.mongodb.net:27017,cluster0-shard-00-01-ood86.mongodb.net:27017,cluster0-shard-00-02-ood86.mongodb.net:27017/scraping?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";
    MongoClient.connect(uri, function(err, client) {
    const collection = client.db("scraping").collection("scrapedCollection").insert(json)
    client.close();
    });
}


module.exports = {
    insertData,
  };