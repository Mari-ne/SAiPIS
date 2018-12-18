var config = {}; //это объект
config["user"] = sessionStorage.getItem("login"); // получаем логин текущего пользователя из хранилища
if(config.user)//если логин не пустой и найден
	$("#currentUserLabel").append("<strong>Текущий Пользователь: </strong>" + config.user); // выводим текущего пользователя
else//иначе
	$("#currentUserLabel").append("<strong class = 'text-danger'>Вы не вошли в систему!</strong>");//выводим предупреждение

$.ajax({ 
url: 'http://localhost:12321/getBooks', 
method: 'get', 
success: function(response){ 
document.getElementById("insertBody").innerHTML += response; //вставляем пришедшую информацию
$("button[id^='but_']").click(function () { //задаем событие для всех кнопок с походим ид
var current_but_id = this.id; //ид кнопки
var index = current_but_id.substring(4, current_but_id.length); //номер строки
var bookId = "book" + index; //id имени книги
var bookName = $("#"+bookId+"").html(); //ищем название книги по ид имени книги
var authorId = "author" + index; //id автора книги
var authorName = $("#"+authorId+"").html(); //ищем автора книги по ид автора книги
if (sessionStorage.getItem("login") == null){  // если пользоватиель не авторизовался
//нет авторизированного пользователя 
$(this).hide(); //прячем кнопку
alert("Вы не можете совершить заказ, т.к. вы не авторизировались в системе"); 
}else{ //если пользователь есть - оформляем заказ
var config = {}; //это объект 
config["user"] = sessionStorage.getItem("login"); // получаем текущего пользователя 
config["bookName"] = bookName; // получаем название книги
config["authorName"] = authorName; //получаем автора книги
$.ajax({ 
url: 'http://localhost:12321/makeOrder', 
method: 'get', 
data: config, //передаем данные не в строке запроса
success: function (response) { 
console.log("заказ добавлен"); //вывод сообщения об успехе
}, 
error: function (response) { 
console.log("error"); 
} 
}); 
} 
}); 
}, 
error: function(result){ 
console.log(result); 
console.log("error"); 
} 
}); 