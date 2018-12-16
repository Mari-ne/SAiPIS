﻿/*
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
				Использование: user.js, book.jd, order.js
			2. db - получение ссылки на базу данных
				Передаются: название БД
				Использование: user.js, book.js, order.js
			3. createCollection - создание новой коллекции
				Передаются: название новой коллекции
				Использование: user.js, book.js, order.js (Закомментировано)
			4. collection - получение коллекции
				Передаются: название коллекции
				Использование: user.js, book.js, order.js
			5. countDocuments - считает количество документов, хранимых в коллекции
				Передаются: JS Object с ограничениями для поиска (например, найти книги, автор которых Стивен Кинг), callback-функция, в которую передается ошибка
								и количество найденных документов
				Использование: user.js, book.js
			6. insertOne - вставляет новый документ в коллекцию, для которой вызывается.
				Передаются: JS Object, с данными для нового документа; callback-функция, которая будет вызвана после вставки
				Использование: user.js, book.js, order.js
			7. findOne - ищет первую запись в документе, для которого вызывается. Если подходящих документов много, то вернет самый первый
				Передаются: JS Object с ограничениями для поиска (например, найти книги, автор которых Стивен Кинг), callback-функция, в которую передается ошибка
								и найденный документ (если подходящего документа нет, вернется null)
				Использование: user.js, book.js
			8. find - ищет все документы в коллекции, для которой вызывается
				Передаются: JS Object с ограничениями для поиска (например, найти книги, автор которых Стивен Кинг)
				Данная функция возвращает объект курсора 
				Использование: book.js, order.js
			9. toArray - приводит курсор, для которого вызывается этот метод, к массиву
				Передаются: callback-функция, в которую передается объект ошибки и получившийся массив
				Использование: book.js, order.js
			10. aggregate - делает аггрегацию (аналог join из SQL) коллекции, для которой был вызван метод
				Передаются: массив, содержащий параметры аггрегации (более подробно: https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/#db.collection.aggregate)
				Данная функция возвращает объект курсора 
				Использование: order.js
	- модуль fs:
			1. readFile - полностью читает содержимое файла 
				Передаются: путь к файлу, который необходимо прочитать; кодировка файла (не обязательно); callback-функция, в которую передаются объект ошибки и
							прочитанные данные (строка или объект класса Buffer)
				Использование: user.js, book.js, service.js
	- остальное:
			1. JSON.parse - разбирает переданную строку формата JSON
				Передаются: строка, которую нужно разобрать
				Функция возвращает объект Object, который соответствует разобранной строке
				Использование: user.js, book.js, service.js
			2. toString - преобразует объект Buffer в строку (используеься при чтении файла)
				Возвращает строковое представление объекта Buffer 
				Использование: user.js, book.js, service.js
*/

var service = require("../js/service");
var user = require("../js/user");
var book = require("../js/book");
var order = require("../js/order");


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Экспорт////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

module.exports = {
    addUser: user.addUser,
    isUniqueLogin: user.isUniqueLogin,
    getUserByLoginAndPassword: user.getUserByLoginAndPassword,
    getUserId: user.getUserId,
    getAllBooks: book.getAllBooks,
    getBookId: book.getBookId,
    addOrder: order.addOrder,
    getUserOrder: order.getUserOrder,
    getAllOrders: order.getAllOrders,
    getContactInfo: service.getContactInfo,
	getUserData: user.getUserData
}


