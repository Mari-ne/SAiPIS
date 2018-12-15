const MongoClient = require("mongodb").MongoClient;
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
