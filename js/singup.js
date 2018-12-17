/*var signupUsername = document.getElementById('signup-username'); // получаем значение поля имени пользователя окна регистрации
var username = sessionStorage.getItem('username'); // кидаем его в хранилище, которое сохранит данные до закрытия браузера
signupUsername.value = username;*/ 
//Все менять


//при фокусе на input'e, находящемся в поле с id signup-tab
//цвет его фона изменяет цвет
$("#signup-tab input").focus(function(){
	console.log(this);
	$(this).css("background", "AliceBlue");
});

//при потере фокуса элементом input, находящимся внутри поля с id signup-tab
//цвет возвращается к изначальному
$("#signup-tab input").focusout(function(){
	console.log(this);
	$(this).css("background", "white");
});