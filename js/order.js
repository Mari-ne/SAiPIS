//модуль для работы с коллекцией заказов

var service = require("../js/service");

const MongoClient = require("mongodb").MongoClient; //модуль для работы с MongoDB
//полная документация по mongodb - https://docs.mongodb.com/manual/

const dbURL = "mongodb://localhost:27017"; //url БД
var dataBase = null; //будет хранить объект базы данных
var order = null; // будет хранить коллекцию order
const mongoClient = new MongoClient(dbURL, { useNewUrlParser: true }); //создание объекта для последуещего соединения с базой

//первоначальная инициализация объектов БД
mongoClient.connect(function(err, db){
    service.errorHandler(err);
    dataBase = db.db("library"); //получение базы данных library

    //dataBase.createCollection("order"); //создание коллекции order
    order = dataBase.collection("order"); //получение коллекции
});

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
        service.errorHandler(err);
        //вставка нового заказа в коллекцию ordrer
        order.insertOne(newData, function(err, res){
            service.errorHandler(err);
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
        service.errorHandler(err);
        order.aggregate([{
			//$match - фильтрует поток документов согласно указанному в значении условию
            $match: {"id_user": userId} //ищет совпадения по условию id_user = userId
        },{
			//$lookup - делает левое внешнее объединение с коллекцией из ЭТОЙ ЖЕ базы данных
            $lookup:{
                from: "user",  //с какой таблицей объединять
                localField: "id_user", //название поля в целевой таблице (order)
                foreignField: "_id", //название поля в таблице-источнике (user)
                as: "userInfo" //название поля, куда будет записан присоедененный документ
            }
        }, {
			//$unwind - вместо элемента с массивом делает массив элементоа (пример в конце файла)
            $unwind: "$userInfo"
        }, {
			//$lookup - делает левое внешнее объединение с коллекцией из ЭТОЙ ЖЕ базы данных
            $lookup:{
                from: "book",  //с какой таблицей объединять
                localField: "id_book", //название поля в целевой таблице (order)
                foreignField: "_id", //название поля в таблице-источнике (user)
                as: "bookInfo"
            }
        },{
			//$unwind - вместо элемента с массивом делает массив элементоа (пример в конце файла)
            $unwind: "$bookInfo"
        },{
			//$project - изменяет каждый документ в потоке в соответствии с указанным правилом (1 - показать поле, 0 - скрыть поле)
			//Замечание: одновременно не может быть 0 и 1 в одном $project
            $project: { "_id": 1, "userInfo.login": 1, "bookInfo.name": 1, "bookInfo.author": 1, "date": 1}//определение полей, содержащихся в вернувшемся документе
        }]).toArray(function(err, result){
            service.errorHandler(err);
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
        service.errorHandler(err);
        order.aggregate([{
			//$lookup - делает левое внешнее объединение с коллекцией из ЭТОЙ ЖЕ базы данных
            $lookup:{
                from: "user",  //с какой таблицей объединять
                localField: "id_user", //название поля в целевой таблице (order)
                foreignField: "_id", //название поля в таблице-источнике (user)
                as: "userInfo"
            }
        }, {
			//$unwind - вместо элемента с массивом делает массив элементоа (пример в конце файла)
            $unwind: "$userInfo"
        }, {
			//$lookup - делает левое внешнее объединение с коллекцией из ЭТОЙ ЖЕ базы данных
            $lookup:{
                from: "book",  //с какой таблицей объединять
                localField: "id_book", //название поля в целевой ьаблице (order)
                foreignField: "_id", //название поля в таблице-источнике (user)
                as: "bookInfo"
            }
        },{
			//$unwind - вместо элемента с массивом делает массив элементоа (пример в конце файла)
            $unwind: "$bookInfo"
        },{//$project - изменяет каждый документ в потоке в соответствии с указанным правилом (1 - показать поле, 0 - скрыть поле)
			//Замечание: одновременно не может быть 0 и 1 в одном $project
            $project: { "_id": 1, "userInfo.login": 1, "bookInfo.name": 1, "bookInfo.author": 1, "date": 1}//определение полей, содержащихся в вернувшемся документе
        }]).toArray(function(err, result){
            service.errorHandler(err);
            call(result);
        });
    });
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Экспорт////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

module.exports = {
    addOrder: addOrder,
    getUserOrder: getUserOrder,
    getAllOrders: getAllOrders
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Пояснения//////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
/*
Пояснения оператора агрегации unwind:
	Пример документа коллекции article:
		{
			title : "this is my title" ,
			author : "bob" ,
			posted : new Date () ,
			pageViews : 5 ,
			tags : [ "fun" , "good" , "fun" ] ,
			comments : [
				{ author :"joe" , text : "this is cool" } ,
				{ author :"sam" , text : "this is bad" }
			],
			other : { foo : 5 }
		}
	Обратим внимание, что tags на самом деле представляют собой массив из 3 элементов, а comments - массив из 2-х элементов.
	
	То, что $unwind делает, позволяет вам очистить документ от каждого элемента и вернуть этот результирующий документ. Чтобы думать об этом в классическом подходе, это было бы равнозначно "для каждого элемента в массиве тегов, вернуть документ только с этим элементом".

	Таким образом, результат выполнения:
		db.article.aggregate(
			{ $project : {
				author : 1 ,
				title : 1 ,
				tags : 1
			}},
			{ $unwind : "$tags" }
		);
	
	вернет следующие документы:
	{
		"result" : [
			{
				"_id" : ObjectId("4e6e4ef557b77501a49233f6"),
				"title" : "this is my title",
				"author" : "bob",
				"tags" : "fun"
			},
			{
				"_id" : ObjectId("4e6e4ef557b77501a49233f6"),
				"title" : "this is my title",
				"author" : "bob",
				"tags" : "good"
			},
			{
				"_id" : ObjectId("4e6e4ef557b77501a49233f6"),
				"title" : "this is my title",
				"author" : "bob",
				"tags" : "fun"
			}
		],
		"OK" : 1
	}
	Грубо говоря, если в документе есть массив, то unwind сделает копии этого документа и эти копии
	будут содержать один из элементов этого массива.
*/
