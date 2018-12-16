//Модуль с функциями работы с коллекцией пользователей

var service = require("../js/service");

var fs = require("fs"); //модуль для работы с файловой системой
//полная документация по fs - https://nodejs.org/api/fs.html
const MongoClient = require("mongodb").MongoClient; //модуль для работы с MongoDB
//полная документация по mongodb - https://docs.mongodb.com/manual/

const dbURL = "mongodb://localhost:27017"; //url БД
var dataBase = null; //будет хранить объект базы данных
var user = null; //будет хранить коллекцию user
const mongoClient = new MongoClient(dbURL, { useNewUrlParser: true }); //создание объекта для последуещего соединения с базой

//первоначальная инициализация объектов БД
mongoClient.connect(function(err, db){
    service.errorHandler(err);
    dataBase = db.db("library"); //получение базы данных library

    //dataBase.createCollection("user"); //создание коллекции user
    user = dataBase.collection("user"); //получение коллекции
    user.countDocuments(function(err, res){
        service.errorHandler(err);
        if(res === 0)
        //Если коллекция пустая, заполнить ее данными
            initFill();
    });
});

//заполнение БД данными из json файлов
function initFill(){
    //считывается файл resources\\<название_коллекции>.json
    fs.readFile("resources\\user.json", function(err, data){
        //полученные из файла данные переводятся в строку (toString), затем эта строка превращается json форму (JSON.parse)
        //json файл имее структуру <название_коллекции>:[{}, {}, ...], поэтому получаем значение хранящееся в свойстве <название_коллекции>
        //т.к. это значение - массив (Array), то для него применима функция map, которая позволяет перебрать весь массив поэлементно
        //каждый из элементов массива будет записан в базу
        JSON.parse(data.toString()).user.map(function(item){
            addUser(item.login, item.password, item.email, function(){console.log("Uadd");});
        });
    });
}

/////////////////////////////////////////////////////////////////////////////////////
///////////////////////Работа с пользователями//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

//функция добавления нового пользователя (вызывается при регестрациии)
//в функц	ию передаются: log - логин нового пользователя; pass - пароль нового пользователя; mail - адресс электронной почты нового пользователя
//call - функция, которая выполниться после выполнения этой функции (callback)
//    в функцию call ничего не передается
function addUser(log, pass, mail, call){
    var newData = {login: log, password: pass, email: mail}; //формирование объекта с данными о новом пользователе
    //подключение к БД
    mongoClient.connect(function(err, db){
        service.errorHandler(err);
        //вставка нового пользователя в коллекцию user
        user.insertOne(newData, function(err, res){
            service.errorHandler(err);
            call();
        });
    });
}

//функция, проверяющая уникальность нового логина
// !!!!
//ДАННАЯ ФУНКЦИЯ ВЫЗЫВАЕТСЯ ДО ФУНКЦИИ addUser
// !!!!
//в функцию передается: log - логин, который нужно проверить на уникальность
//call - функция, которая выполниться после выполнения этой функции (callback)
//    в функцию call передается true если логин уникален, иначе - false
function isUniqueLogin(log, call){
    var query = {login: log}; //создания объекта-условия поиска
    mongoClient.connect(function(err, db){
        service.errorHandler(err);
        user.findOne(query, function(err, result){
            service.errorHandler(err);
            //если еще нет пользователя с логином log, то result будет равен null
            var res;
            if(result)
                res = false;
            else
                res = true;
            call(res);
        });
    });
}

//функция, проверяющая есть ли в коллекции user пользователь с переданным логином и паролем
//в функцию передаются: log - логин предполагаемого пользователя; pass - пароль предпалогаемого пользователя
//call - функция, которая выполниться после выполнения этой функции (callback)
//    в функцию call передается запись (в MongoDB называется документом) о пользователе если он есть, иначе - null
function getUserByLoginAndPassword(log, pass, call){
    var query = {login: log, password: pass};//создание объекта-условия поиска
    mongoClient.connect(function(err, db){
        service.errorHandler(err);
        //поиск первого вхождения документа о пользователе с логином log и паролем pass
        user.findOne(query, function(err, res) {
            service.errorHandler(err)
            //если пользователя с таким логином и паролем не будет, то u бует null
            call(res);
        });
    });
}

//функция для получения id пользователя по его логину
//id будет нужен при создании документа о заказе
//в функцию передаются: log - логин пользователя, для которого нужно найти id
//call - функция, которая выполниться после выполнения этой функции (callback)
//    в функциюs call передается полученный id (в виде строки)
function getUserId(log, call){
    var query = {login: log};//создание объекта-условия поиска
    mongoClient.connect(function(err, db){
        service.errorHandler(err);
        //поиск первого вхождения документа о пользователе с логином log
        user.findOne(query, function(err, result){
            service.errorHandler(err);
            call(result._id);
        });
    });
}

//функция для получения данных о пользователе по его логину
//в функцию передаются: log - логин пользователя, для которого нужно найти данные
//call - функция, которая выполниться после выполнения этой функции (callback)
//    в функциюs call передается полученный документ
function getUserData(log, call){
	var query = {login: log};//создание объекта-условия поиска
	mongoClient.connect(function(err, db){
		service.errorHandler(err);
		//поиск первого вхождения документа о пользователе с логином log
		user.findOne(query, function(err, result){
							service.errorHandler(err);
							call(result);
		});		
	});
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Экспорт////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

module.exports = {
	addUser: addUser,
    isUniqueLogin: isUniqueLogin,
    getUserByLoginAndPassword: getUserByLoginAndPassword,
    getUserId: getUserId,
	getUserData: getUserData
}