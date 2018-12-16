/*npm install jquery
npm install mongodb
*/
var databasescript = require("../Контрольная/js/dataBase");

var http = require("http");
var fs = require('fs');
var url = require('url');

var mapping = {
    '/': loadIndex,
    '/entry': entry,
    '/registration': registration,
    "/getBooks": getBooks,
    '/about': getAbout, 
    '/contacts': getContacts,
	'/main': getMain,
	'/catalog': getCatalog
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
    fs.readFile('css\\' + path, "utf8",  function(err, data){
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

    databasescript.getUserByLoginAndPassword(login, password, function (success) {
        if (success){
            //если был возвращен объект не null
            response.writeHead(200, {"Content-Type": "application/json"});
            var dataToSend = {userLogin: success.login.toString()};
            response.write(JSON.stringify(dataToSend));
            return response.end();
        }else{
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write("error");
            return response.end();
        }
    })
}

function registration(request, response){
    var login = url.parse(request.url, true).query.username;
    var password = url.parse(request.url, true).query.password;
    var email = url.parse(request.url, true).query.email;

    databasescript.isUniqueLogin(login, function(unique){
        if (unique){
            databasescript.addUser(login, password, email, function () {
				response.writeHead(200, {"Content-Type": "application/json"});
				var dataToSend = {userLogin: login};
				response.write(JSON.stringify(dataToSend));
				return response.end();
			});
            
        }else{
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write("error");
            return response.end();
        }
    });
}

function getBooks(request, response) {
    databasescript.getAllBooks(function (mas) {
        //mas - массив с JSON объектами
        var result = "";
        var value =1;
        mas.map(function (item) {
            var bookId = "book"+value;
            var buttonId = "but_"+value;
            result+="<tr><td id = " +bookId+">"+item.name+"</td><td>"+item.author+"</td><td>"+item.annotation+"</td><td>"+item.description+"</td>" +
                "<td><button type='button' class='btn btn-success' id = "+buttonId+" >Заказать</button></td></tr>";
            value++;
        });
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(result);
        return response.end();
    });
}

function getAbout(request, response){
    fs.readFile("html\\aboutUs.html", function(err, data){
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(data.toString());
            return response.end();
        });
}

function getContacts(request, response){
    databasescript.getContactInfo(function(contact){
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(contact));
        return response.end();
    });
}

function getMain(request, response){
    fs.readFile("html\\main.html", function(err, data){
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(data.toString());
            return response.end();
        });
}

function getCatalog(request, response){
    fs.readFile("html\\catalog.html", function(err, data){
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(data.toString());
            return response.end();
        });
}