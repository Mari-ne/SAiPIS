/*npm install jquery
npm install mongodb
*/
var databasescript = require("../Контрольная/js/dataBase");

var http = require("http");
var fs = require('fs');
var url = require('url');
const pug = require('pug');

var mapping = {
    '/': loadIndex,
    '/entry': entry,
    '/registration': registration,
    "/getBooks": getBooks,
    '/about': getAbout, 
    '/contacts': getContacts,
    '/main': getMain,
    '/catalog': getCatalog,
    '/makeOrder': makeOrder,
    "/getAllOrdersTable": getAllOrdersTable,
    "/getAllOrdersPage": getAllOrdersPage,
    "/getAllOrdersData": getAllOrdersData,
    "/getPrivateTable": getPrivateTable,
    "/getPrivatePage": getPrivatePage
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
            loadJS(res, urlMap.pathname.substring(urlMap.pathname.indexOf("js/") + 3));//получение названия файла
		else if(urlMap.pathname.includes("img"))
            loadIMG(res, urlMap.pathname.substring(urlMap.pathname.indexOf("img/") + 4));//получение названия файла
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

function loadIMG(response, path){
    fs.readFile('img\\' + path, function(err, data){
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
		//отправка клиенту логина авторизировшегося пользователя
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
		   		//отправка клиенту логина зарегестрировавшегося пользователя
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
        var value = 1;
        mas.map(function (item) {
            var bookId = "book" + value;
            var buttonId = "but_" + value;
            var authorId = "author" + value;
            result += "<tr><td id = " + bookId + ">" + item.name + "</td><td id=" + authorId + ">" + item.author + "</td><td>" + item.annotation + "</td><td>" + item.description + "</td>" +
                "<td><button type='button' class='btn btn-success' id = " + buttonId + " >Заказать</button></td></tr>";
            value++;
        });
        response.writeHead(200, { "Content-Type": "text/html" });
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
	    //отправка клиенту контактной информации
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

function makeOrder(request, response){
    var login = url.parse(request.url, true).query.user;
    var bookName = url.parse(request.url, true).query.bookName;
    var author = url.parse(request.url, true).query.authorName;

    databasescript.getUserId(login, function (userId) {
        databasescript.getBookId(bookName, author, function (bookId) {
	console.log(bookId);
            databasescript.addOrder(userId, bookId, function () {
                //произошло добавление заказа в бд
            });
        });
    });

    response.writeHead(200, {"Content-Type": "text/html"});
    return response.end();
};

function getAllOrdersTable(request, response){
	console.log("allOrders");

        //mas - массив с JSON объектами
		fs.readFile("html\\allOrders.html", function(err, data){
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(data.toString());
			return response.end();
		});
}

function getAllOrdersPage(request, response){

        //mas - массив с JSON объектами
		fs.readFile("html\\allOrdersPage.html", function(err, data){
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(data.toString());
			return response.end();
		});
}

function getAllOrdersData(request, response){
  	databasescript.getAllOrders(function (mas) {
        //mas - массив с JSON объектами
        var result = "";
        mas.map(function (item) {
            result+="<tr><td>"+item.userInfo.login+"</td><td>"+item.bookInfo.author+"</td><td>"+item.bookInfo.name+"</td><td>"+item.date+ "</td>" + "</tr>";
        });
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(result);
        return response.end();
    });
}

function getPrivateTable(request, response){
	var login = url.parse(request.url, true).query.user;
    databasescript.getUserId(login, function (userId) {
        databasescript.getUserOrder(userId, function (mas) {
            //mas - массив с JSON объектами
            var userlogin;
            //согласен, коряво, но толком не знаю, как без пееребора получить сразу login юзера
            mas.map(function (item) {
                userlogin = item.userInfo.login
            });
            var result = "";
			const compiledFunction = pug.compileFile('html/privatePageTable.pug');
			response.writeHead(200, { "Content-Type": "text/html" });
			response.write(compiledFunction({
				  mass: mas
				}));
            return response.end();
        })
	});
}

function getPrivatePage(request, response){

        //mas - массив с JSON объектами
		fs.readFile("html\\privatePage.html", function(err, data){
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(data.toString());
			return response.end();
		});
}