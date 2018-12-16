/*npm install body-parser --save
*/
var http = require("http");
var fs = require('fs');
var url = require('url');
var $ = require("jquery");

var mapping = {
    '/': loadIndex,
    '/entry': entry
};

http.createServer(function(req, res){
    console.log(req.url);
    var urlMap = url.parse(req.url);
    var action = mapping[urlMap.pathname]; //выбирает из mapping действие, которое соответствует запросу
    if(action)
        action(req, res);
    else{
        if(urlMap.pathname.includes("css"))
            loadCSS(res, urlMap.pathname.substring(urlMap.pathname.indexOf("css/") + 4));//получение названия файла
        else if(urlMap.pathname.includes("js"))
            loadJS(res, urlMap.pathname.substring(urlMap.pathname.indexOf("js/") + 3));//аолучение названия файла
        else{
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.write("404 Не найдено");
            res.end();
        }
    }
}).listen(12321);

function loadIndex(request, response){
    fs.readFile('html\\index.html', function(err, data){
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(data);
        return response.end();
    });
}

function loadCSS(response, path){
    fs.readFile('css\\' + path, function(err, data){
        response.writeHead(200, {"Content-Type": "text/css"});
        response.write(data);
        return response.end();
    });
}

function loadJS(response, path){
    fs.readFile('js\\' + path, function(err, data){
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(data);
        return response.end();
    });
}

function entry(request, response){
    var login = url.parse(request.url, true).query.username;
    var password = url.parse(request.url, true).query.password;
}

function registration(request, response){
    var login = url.parse(request.url, true).query.username;
    var password = url.parse(request.url, true).query.password;
    var email = url.parse(request.url, true).query.email;
}

