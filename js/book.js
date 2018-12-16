//модуль для работы с коллекцией книг

var service = require("../js/service");

var fs = require("fs"); //модуль для работы с файловой системой
//полная документация по fs - https://nodejs.org/api/fs.html
const MongoClient = require("mongodb").MongoClient; //модуль для работы с MongoDB
//полная документация по mongodb - https://docs.mongodb.com/manual/

const dbURL = "mongodb://localhost:27017"; //url БД
var dataBase = null; //будет хранить объект базы данных
var book = null; // будет хранить коллекцию book
const mongoClient = new MongoClient(dbURL, { useNewUrlParser: true }); //создание объекта для последуещего соединения с базой

//первоначальная инициализация объектов БД
mongoClient.connect(function(err, db){
    service.errorHandler(err);
    dataBase = db.db("library"); //получение базы данных library
	
    //dataBase.createCollection("book"); //создание коллекции book
    book = dataBase.collection("book"); //получение коллекции
    book.countDocuments(function(err, res){
        service.errorHandler(err);
        if(res === 0)
        //Если коллекция пустая, заполнить ее данными
            initFill();
    });
});

//заполнение БД данными из json файлов
function initFill(){
    //считывается файл resources\\<название_коллекции>.json
    fs.readFile("resources\\book.json", function(err, data){
        //полученные из файла данные переводятся в строку (toString), затем эта строка превращается json форму (JSON.parse)
        //json файл имее структуру <название_коллекции>:[{}, {}, ...], поэтому получаем значение хранящееся в свойстве <название_коллекции>
        //т.к. это значение - массив (Array), то для него применима функция map, которая позволяет перебрать весь массив поэлементно
        //каждый из элементов массива будет записан в базу
        JSON.parse(data.toString()).book.map(function(item){
            addBook(item.name, item.author, item.annotation, item.description, function(){console.log("Badd");});
        });
    });
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////Работа с книгами///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

//функция для получения всех книг, хранящихся в БД
//в функцию передаются:
//call - функция, которая выполниться после выполнения этой функции (callback)
//    в функцию call передается массив (Array) с книгами
function getAllBooks(call){
    mongoClient.connect(function(err, db){
        service.errorHandler(err);
        //поиск всех книг (без условий поиска)
        book.find({}).toArray(function(err, result){
            service.errorHandler(err);
            call(result)
        });
    });
}

//ЕСЛИ ДЛЯ ИДЕНИФИКАЦИИ БУДЕТ ИСПОЛЬЗОВАТЬСЯ ЧТО-ТО ДРУГОЕ, НАПИШИТЕ - Я ПОМЕНЯЮ!!!!!
//функция для получения id книги по ее названию и автору
//id будет нужен при создании документа о заказе
//в функцию передаются: bookName - назвние книги, для которой происходит поиск; bookAuthor - автор книги, для которой происходит поиск
//call - функция, которая выполниться после выполнения этой функции (callback)
//    в функцию call передается полученный id (в виде строки)
function getBookId(bookName, bookAuthor, call){
    var query = {name: bookName, author: bookAuthor}; //создание объекта-условия поиска
    mongoClient.connect(function(err, db){
        service.errorHandler(err);
        //поиск первого вхождения документа о книге с названием bookName и автором bookAuthor
        book.findOne(query, function(err, res) {
            service.errorHandler(err);
            call(res._id);
        });
    });
}

//функция добавления новой книги
//в функцию передаются: bookName - название новой книги; bookAuthor - автор новой книги; bookAnnotation - аннотация новой книги; bookDescription - описание новой книги
//call - функция, которая выполниться после выполнения этой функции (callback)
//    в функцию call ничего не передается
function addBook(bookName, bookAuthor, bookAnnotation, bookDescription, call){
    var newData = {name: bookName, author: bookAuthor, annotation: bookAnnotation, description: bookDescription}; //формирование объекта с данными о новой книге
    mongoClient.connect(function(err, db){
        service.errorHandler(err);
        //вставка нового пользователя в коллекцию user
        book.insertOne(newData, function(err, res){
            service.errorHandler(err);
            call();
        });
    });
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Экспорт////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

module.exports = {
    getAllBooks: getAllBooks,
    getBookId: getBookId
}