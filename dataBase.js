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

const MongoClient = require("mongodb").MongoClient; //модуль для работы с MongoDB
var dbURL = "mongodb://localhost:27017";
var dataBase = null; //будет хранить объект базы данных
const mongoClient = new MongoClient(dbURL, { useNewUrlParser: true });

mongoClient.connect(function(err, db){
	if(err){
		console.log(err);
		throw err;
	}
	dataBase = db.db("library"); //получение базы данных library
});

//функция добавления нового пользователя (вызывается при регестрациии)
//в функцию передаются: log - логин нового пользователя; pass - пароль нового пользователя; mail - адресс электронной почты нового пользователя
//функция ничего не возвращает
function addToUser(log, pass, mail){
	var newData = {login: log, password: pass, email: mail}; //формирование объекта с данными о новом пользователе
	mongoClient.connect(function(err, db){
		if(err){
			console.log(err);
			throw err;
		}
		//запись нового пользователя в коллекцию user
		dataBase.collection("user").insertOne(newData, function(err, res) {
														if (err){
															console.log(err);
															throw err;
														}
		});
	});
}

//функция, проверяющая есть ли в коллекции user пользователь с переданным логином и паролем
//в функцию передаются: log - логин предполагаемого пользователя; pass - пароль предпалогаемого пользователя
//возвращает запись (в MongoDB называется документом) о пользователе если он есть, иначе - null
function getUserByLoginAndPassword(log, pass){
	var query = {login: log, password: pass};
	mongoClient.connect(function(err, db){
		if(err){
			console.log(err);
			throw err;
		}
		dataBase.collection("user").find(query).toArray(function(err, res) {
													if (err) {
														console.log(err);
														throw err;
													}
											  });
	});
}
