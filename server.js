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
    '/catalog': getCatalog,
    '/makeOrder': makeOrder,
    '/privatePage': getPrivateInfo,
    '/getOrders': getOrders,
    '/orders': getOrdersInfo,
    '/ordersCatalog' :getOrdersCatalog,
    '/getAllOrdersData': getAllOrders
};

http.createServer(function (req, res) {
    console.log(req.url);
    var urlMap = url.parse(req.url);
    var action = mapping[urlMap.pathname]; //выбирает из mapping действие, которое соответствует запросу
    if (action)
        action(req, res);
    else {
        if (urlMap.pathname.includes("css"))
            loadCSS(res, urlMap.pathname.substring(urlMap.pathname.indexOf("css/") + 4));//получение названия файла
        else if (urlMap.pathname.includes("js"))
            loadJS(res, urlMap.pathname.substring(urlMap.pathname.indexOf("js/") + 3));//аолучение названия файла
        else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("404 Не найдено");
            res.end();
        }
    }
}).listen(12321);

function loadIndex(request, response) {
    fs.readFile('html\\index.html', function (err, data) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data);
        return response.end();
    });
}

function loadCSS(response, path) {
    fs.readFile('css\\' + path, "utf8", function (err, data) {
        response.writeHead(200, { "Content-Type": "text/css" });
        response.write(data);
        return response.end();
    });
}

function loadJS(response, path) {
    fs.readFile('js\\' + path, function (err, data) {
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write(data);
        return response.end();
    });
}

function entry(request, response) {
    var login = url.parse(request.url, true).query.username;
    var password = url.parse(request.url, true).query.password;

    databasescript.getUserByLoginAndPassword(login, password, function (success) {
        if (success) {
            //если был возвращен объект не null
            response.writeHead(200, { "Content-Type": "application/json" });
            var dataToSend = { userLogin: success.login.toString() };
            //отправка клиенту логина авторизировшегося пользователя
            response.write(JSON.stringify(dataToSend));
            return response.end();
        } else {
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write("error");
            return response.end();
        }
    })
}

function registration(request, response) {
    var login = url.parse(request.url, true).query.username;
    var password = url.parse(request.url, true).query.password;
    var email = url.parse(request.url, true).query.email;

    databasescript.isUniqueLogin(login, function (unique) {
        if (unique) {
            databasescript.addUser(login, password, email, function () {
                response.writeHead(200, { "Content-Type": "application/json" });
                var dataToSend = { userLogin: login };
                //отправка клиенту логина зарегестрировавшегося пользователя
                response.write(JSON.stringify(dataToSend));
                return response.end();
            });

        } else {
            response.writeHead(200, { "Content-Type": "text/html" });
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

function getAbout(request, response) {
    fs.readFile("html\\aboutUs.html", function (err, data) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data.toString());
        return response.end();
    });
}


function getContacts(request, response) {
    databasescript.getContactInfo(function (contact) {
        response.writeHead(200, { "Content-Type": "application/json" });
        //отправка клиенту контактной информации
        response.write(JSON.stringify(contact));
        return response.end();
    });
}

function getMain(request, response) {
    fs.readFile("html\\main.html", function (err, data) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data.toString());
        return response.end();
    });
}

function getCatalog(request, response) {
    fs.readFile("html\\catalog.html", function (err, data) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data.toString());
        return response.end();
    });
}

function makeOrder(request, response) {
    var login = url.parse(request.url, true).query.user;
    var bookName = url.parse(request.url, true).query.bookName;
    var author = url.parse(request.url, true).query.authorName;

    databasescript.getUserId(login, function (userId) {
        databasescript.getBookId(bookName, author, function (bookId) {
            databasescript.addOrder(userId, bookId, function () {
                //произошло добавление заказа в бд
            });
        });
    });

    response.writeHead(200, { "Content-Type": "text/html" });
    return response.end();
};

function getPrivateInfo(request, response) {
    fs.readFile("html\\privatePage.html", function (err, data) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data.toString());
        return response.end();
    });
}
//временное для проверки
function getOrders(request, response) {
    var login = url.parse(request.url, true).query.user;
    databasescript.getUserId(login, function (userId) {
        databasescript.getUserOrder(userId, function (mas) {
            //mas - массив с JSON объектами
            var userlogin;
            //согласен, коряво, но толком не знаю, как без пееребора получить сразу login юзера
            mas.map(function (item) {
                userlogin = item.userInfo.login
            });
            var result = "<b>Заказы пользователя " + userlogin + "</b><br>" + "<tr><td>Номер заказа:</td><td>Название книги:</td><td>Автор:</td><td>Дата заказа:</td></tr>";
            mas.map(function (item) {
                result += "<tr><td>" + item._id + "</td><td>" + item.bookInfo.name + "</td><td>" + item.bookInfo.author + "</td><td>" + item.date + "</td></tr>";
            });
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write(result);
            return response.end();
        })
    });
};

//если был возвращен объект не null
function getOrdersInfo(request, response) {
    fs.readFile("html\\allOrders.html", function (err, data) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data.toString());
        return response.end();
    });
};

function getOrdersCatalog(request, response) {
    fs.readFile("html\\ordersCatalog.html", function (err, data) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data.toString());
        return response.end();
    });
};

function getAllOrders(request, response) {
    var login = url.parse(request.url, true).query.user;
    
        databasescript.getAllOrders(function (mas) {
            //mas - массив с JSON объектами
var result = "";
            mas.map(function (item) {
                result += "<tr><td>" + item._id + "</td><td>" + item.userInfo.login + "</td><td>" + item.bookInfo.name + "</td><td>" + item.bookInfo.author + "</td><td>" + item.date + "</td></tr>";
            });
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write(result);
            return response.end();
        })
};


