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
var user = null; //будет хранить коллекцию user
var book = null; // будет хранить коллекцию book
var order = null; // будет хранить коллекцию order
const mongoClient = new MongoClient(dbURL, { useNewUrlParser: true }); //создание объекта для последуещего соединения с базой

//первоначальная инициализация объектов БД
mongoClient.connect(function(err, db){
	if(err){
		console.log(err);
		throw err;
	}
	dataBase = db.db("library"); //получение базы данных library
	user = dataBase.collection("user"); //получение коллекции user
	
	//TODO: первоначальная инициализация данных базы
});

/////////////////////////////////////////////////////////////////////////////////////
///////////////////////Работа с пользователями//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

//функция добавления нового пользователя (вызывается при регестрациии)
//в функцию передаются: log - логин нового пользователя; pass - пароль нового пользователя; mail - адресс электронной почты нового пользователя
//функция ничего не возвращает
function addUser(log, pass, mail){
	var newData = {login: log, password: pass, email: mail}; //формирование объекта с данными о новом пользователе
	mongoClient.connect(function(err, db){
		if(err){
			console.log(err);
			throw err;
		}
		//запись нового пользователя в коллекцию user
		user.insertOne(newData, function(err, res){
										if (err){
											console.log(err);
											throw err;
										}
								});
	});
}

//функция, проверяющая уникальность нового логина
// !!!!
//данная функция вызывается до функции addUser
// !!!!
//в функцию передается: log - логин, который нужно проверить на уникальность
//функция возвращет true если логин уникален, иначе - false
function isUniqueLogin(log){
	var query = {login: log};
	var res;
	mongoClient.connect(function(err, db){
		if(err){
			console.log(err);
			throw err;
		}
		user.findOne(query, function(err, result){
			if (err){
				console.log(err);
				throw err;
			}
			//если еще нет пользователя с логином log, то result будет равен null
			if(result)
				res = false;
			else
				res = true;
		});
	});
	return res;
}

//функция, проверяющая есть ли в коллекции user пользователь с переданным логином и паролем
//в функцию передаются: log - логин предполагаемого пользователя; pass - пароль предпалогаемого пользователя
//возвращает запись (в MongoDB называется документом) о пользователе если он есть, иначе - null
function getUserByLoginAndPassword(log, pass){
	var query = {login: log, password: pass};
	var u = {};
	mongoClient.connect(function(err, db){
		if(err){
			console.log(err);
			throw err;
		}
		user.findOne(query, function(err, res) {
								if (err) {
									console.log(err);
									throw err;
								}
								//если пользователя с таким логином и паролем не будет, то u бует null
								u = res;
							});
	});
	return u;
}

//функция для получения id пользователя по его логину
//id будет нужен при создании документа о заказе
//в функцию передаются: log - логин пользователя, для которого нужно найти id
//возвращает id (строка)
function getUserId(log){
	var query = {login: log};
	var id;
	mongoClient.connect(function(err, db){
		if(err){
			console.log(err);
			throw err;
		}
		user.findOne(query, function(err, res) {
								if (err) {
									console.log(err);
									throw err;
								}
								id = res._id;
						  });
	});
	return id;
}

/////////////////////////////////////////////////////////////////////////////////////
///////////////////////Работа с книгами//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////


