/*
Всего в базе данных храниться 3 коллекции:
 - user - хранит информацию о зарегестрированных пользователях.
   + _id - идентификатор (генерируется MongoDB);
   + login - логин пользователя;
   + password - пароль пользователя;
   + email - электронная почта пользователя.
- book - хранит информацию о книгах.
   + _id - идентификатор (генерируется MongoDB);
   + name - название книги;
   + author - автор книги;
   + annotation - аннотация книги (краткое содержимое);
   + description - описание атрибутов книги: год издания, издательство, количество страниц и др.
- order - хранит какой пользователь заказал какую книгу и когда.
   + _id - идентификатор (генерируется MongoDB);
   + id_user - идентификатор пользователя, который сделал заказ;
   + id_book - идентификатор книги, которую заказали;
   + date - дата заказа.
*/

/*
MongoDB использует NoSQL. Тип хранилища - документоориентированное.
Главное отличие NoSQL от SQL в следующих моментах:
1. В NoSQL нет понятия таблицы. Это понятие заменяется коллекцией. Главное отличие коллекции от таблицы в том, что
		коллекция может содержать другие коллекции в себе. Также, коллекция может содержать в себе документы произвольной
		структуры (однако для эффективной работы так лучше не делать).
2. Понятие записи заменяется понятием документа. В отличие от хранилищ типа ключ-значение, выборка по запросу к документному хранилищу 
		может содержать части большого количества документов без полной загрузки этих документов в оперативную память.
*/

//практически все функции посленим параметром имеют callback'и, т.к. все они асинхронны

/*
	Список использованных функций:
	- модуль mongodb:
			1. connect - создает соединение с MongoDB и возвращает ссылку на базу данных
				Передаютя: callback-функция
			2. db - 
			3. createCollection
			4. collection
			5. countDocuments - считает количество документов, хранимых в коллекции
				Передаются: JS Object с ограничениями для поиска (например, найти книги, автор которых Стивен Кинг), callback-функция, в которую передается ошибка
								и количество найденных документов
			6. insertOne - вставляет новый документ в коллекцию, для которой вызывается.
				Передаются: JS Object, с данными для нового документа; callback-функция, которая будет вызвана после вставки
			7. findOne - ищет первую запись в документе, для которого вызывается. Если подходящих документов много, то вернет самый первый
				Передаются: JS Object с ограничениями для поиска (например, найти книги, автор которых Стивен Кинг), callback-функция, в которую передается ошибка
								и найденный документ (если подходящего документа нет, вернется null)
			8. find - ищет все документы в коллекции, для которой вызывается
				Передаются: JS Object с ограничениями для поиска (например, найти книги, автор которых Стивен Кинг)
				Данная функция возвращает объект курсора 
			9. toArray
			10. aggregate
	- модуль fs:
			1. readFile - полностью читает содержимое файла 
				Передаются: путь к файлу, который необходимо прочитать; кодировка файла (не обязательно); callback-функция 
	- остальное:
			1. JSON.parse
			2. toString
*/

/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////Работа с БД/////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
var fs = require("fs"); //модуль для работы с файловой системой
//полная документация по fs - https://nodejs.org/api/fs.html
const MongoClient = require("mongodb").MongoClient; //модуль для работы с MongoDB
//полная документация по mongodb - https://docs.mongodb.com/manual/

const dbURL = "mongodb://localhost:27017"; //url БД
var dataBase = null; //будет хранить объект базы данных
var user = null; //будет хранить коллекцию user
var book = null; // будет хранить коллекцию book
var order = null; // будет хранить коллекцию order
const mongoClient = new MongoClient(dbURL, { useNewUrlParser: true }); //создание объекта для последуещего соединения с базой

//первоначальная инициализация объектов БД
mongoClient.connect(function(err, db){
    errorHandler(err);
    dataBase = db.db("library"); //получение базы данных library

    //dataBase.createCollection("user"); //создание коллекции user
    user = dataBase.collection("user"); //получение коллекции
    user.countDocuments(function(err, res){
        errorHandler(err);
        if(res === 0)
        //Если коллекция пустая, заполнить ее данными
            initFill("user");
    });
    //dataBase.createCollection("book"); //создание коллекции book
    book = dataBase.collection("book"); //получение коллекции
    book.countDocuments(function(err, res){
        errorHandler(err);
        if(res === 0)
        //Если коллекция пустая, заполнить ее данными
            initFill("book");
    });
    //dataBase.createCollection("order"); //создание коллекции order
    order = dataBase.collection("order"); //получение коллекции
});

//заполнение БД данными из json файлов
//в функцию передается: collect - название коллекции, которую необходимо заполнить изначальными данными
function initFill(collect){
    //считывается файл resources\\<название_коллекции>.json
    fs.readFile("..\\resources\\" + collect + ".json", function(err, data){
        //полученные из файла данные переводятся в строку (toString), затем эта строка превращается json форму (JSON.parse)
        //json файл имее структуру <название_коллекции>:[{}, {}, ...], поэтому получаем значение хранящееся в свойстве <название_коллекции>
        //т.к. это значение - массив (Array), то для него применима функция map, которая позволяет перебрать весь массив поэлементно
        //каждый из элементов массива будет записан в базу
        JSON.parse(data.toString())[collect].map(function(item){
            switch(collect){
                case "user": {
                    addUser(item.login, item.password, item.email, function(){console.log("Uadd");});
                    break;
                }
                case "book":{
                    addBook(item.name, item.author, item.annotation, item.description, function(){console.log("Badd");});
                    break;
                }
            }
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
        errorHandler(err);
        //вставка нового пользователя в коллекцию user
        user.insertOne(newData, function(err, res){
            errorHandler(err);
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
        errorHandler(err);
        user.findOne(query, function(err, result){
            errorHandler(err);
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
        errorHandler(err);
        //поиск первого вхождения документа о пользователе с логином log и паролем pass
        user.findOne(query, function(err, res) {
            errorHandler(err)
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
        errorHandler(err);
        //поиск первого вхождения документа о пользователе с логином log
        user.findOne(query, function(err, result){
            errorHandler(err);
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
		errorHandler(err);
		//поиск первого вхождения документа о пользователе с логином log
		user.findOne(query, function(err, result){
							errorHandler(err);
							call(result);
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
        errorHandler(err);
        //поиск всех книг (без условий поиска)
        book.find({}).toArray(function(err, result){
            errorHandler(err);
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
        errorHandler(err);
        //поиск первого вхождения документа о книге с названием bookName и автором bookAuthor
        book.findOne(query, function(err, res) {
            errorHandler(err);
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
        errorHandler(err);
        //вставка нового пользователя в коллекцию user
        book.insertOne(newData, function(err, res){
            errorHandler(err);
            call();
        });
    });
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////Работа с заказами//////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

//функция для добавления нового заказа
//в функцию передаются: userId - id пользователя, который заказывает книгу; bookId - id книги, которую заказывает пользователь
//call - функция, которая выполниться после выполнения этой функции (callback)
//    в функцию call ничего не передается
function addOrder(userId, bookId, call){
    var newData = {id_user: userId, id_book: bookId, date: new Date()}; //формирование объекта с данными о новом заказе
    mongoClient.connect(function(err, db){
        errorHandler(err);
        //вставка нового заказа в коллекцию ordrer
        order.insertOne(newData, function(err, res){
            errorHandler(err);
            call();
        });
    });
}

//функция для получения всех заказов определенного пользователя
//в функцию передаются: userId - id пользователя, все заказы которого нужно получить
//call - функция, которая выполниться после выполнения этой функции (callback)
//    в функцию call передается массив (Array) с заказами
//Передаваемый массив содержит в себе JS Object со следующей структурой:
//		_id: <id заказа>
//		userInfo:
//					login: <логин пользователя, сделавшего заказ>
//		bookInfo:
//					name: <название заказанной книги>,
//					author: <автор заказанной книги>
//		date: <дата заказа>
function getUserOrder(userId, call){
    mongoClient.connect(function(err, db){
        errorHandler(err);
        order.aggregate([{
            $match: {"id_user": userId} //ищет совпадения по условию id_user = userId
        },{
            $lookup:{
                from: "user",  //с какой таблицей объединять
                localField: "id_user", //название поля в целевой таблице (order)
                foreignField: "_id", //название поля в таблице-источнике (user)
                as: "userInfo"
            }
        }, {
            $unwind: "$userInfo"
        }, {
            $lookup:{
                from: "book",  //с какой таблицей объединять
                localField: "id_book", //название поля в целевой таблице (order)
                foreignField: "_id", //название поля в таблице-источнике (user)
                as: "bookInfo"
            }
        },{
            $unwind: "$bookInfo"
        },{
            $project: { "_id": 1, "userInfo.login": 1, "bookInfo.name": 1, "bookInfo.author": 1, "date": 1}//определение полей, содержащихся в вернувшемся документе
        }]).toArray(function(err, result){
            errorHandler(err);
            call(result);
        });
    });
}

//функция для получения всех заказов, хранящихся в БД
//в функцию передаются:
//call - функция, которая выполниться после выполнения этой функции (callback)
//    в функцию call передается массив (Array) с заказами
//Передаваемый массив содержит в себе JS Object со следующей структурой:
//		_id: <id заказа>
//		userInfo:
//					login: <логин пользователя, сделавшего заказ>
//		bookInfo:
//					name: <название заказанной книги>,
//					author: <автор заказанной книги>
//		date: <дата заказа>
function getAllOrders(call){
    mongoClient.connect(function(err, db){
        errorHandler(err);
        order.aggregate([{
            $lookup:{
                from: "user",  //с какой таблицей объединять
                localField: "id_user", //название поля в целевой таблице (order)
                foreignField: "_id", //название поля в таблице-источнике (user)
                as: "userInfo"
            }
        }, {
            $unwind: "$userInfo"
        }, {
            $lookup:{
                from: "book",  //с какой таблицей объединять
                localField: "id_book", //название поля в целевой ьаблице (order)
                foreignField: "_id", //название поля в таблице-источнике (user)
                as: "bookInfo"
            }
        },{
            $unwind: "$bookInfo"
        },{
            $project: { "_id": 1, "userInfo.login": 1, "bookInfo.name": 1, "bookInfo.author": 1, "date": 1}//определение полей, содержащихся в вернувшемся документе
        }]).toArray(function(err, result){
            errorHandler(err);
            call(result);
        });
    });
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////Сторонние функции//////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

//функция обработки ошибок (была созданна для уменьшения дублируещегося кода)
//в функцию передается: error - ошибка, которую нужно обработать
//функция ничего не возвращает
//функция выкидывает исключение (это необходимо, чтобы верхние уровни знали о проблеме)
function errorHandler(error){
    if(error){
        //если ошибка есть, то вывести ее на экран и выкинуть исключение
        console.log(error);
        throw error;
    }
}

//функция для прочтения файла с контактной информацией (для страницы "О нас")
//в функцию передается:
//call - функция, которая выполниться после выполнения этой функции (callback)
//    в функцию call передается массив (Array) JS Object'ов, каждый из которых содержит свою контактную информацию
function getContactInfo(call){
    //считывается файл resources\\contacts.json
    fs.readFile("resources\\contacts.json", function(err, data){
        //полученные из файла данные переводятся в строку (toString), затем эта строка превращается json форму (JSON.parse)
        call(JSON.parse(data.toString())["contacts"]);
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
    getAllBooks: getAllBooks,
    getBookId: getBookId,
    addOrder: addOrder,
    getUserOrder: getUserOrder,
    getAllOrders: getAllOrders,
    getContactInfo: getContactInfo,
	getUserData: getUserData
}