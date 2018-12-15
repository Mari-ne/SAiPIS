/*npm install body-parser --save
*/
var http = require("http");
var fs = require('fs');
var url = require('url');
var $ = require("jquery");

http.createServer(function(req, res){
    console.log(req.url);
}).listen(12321);

