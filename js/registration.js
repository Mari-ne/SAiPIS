$(document).ready(function() {
    //html  польностью загружен
    $("#error").css("display", "none");
    $("#registration").click(function(){
        //была нажата кнопка Зарегистрироваться
        $.ajax({
            url: 'http://localhost:12321/registration',
            method: 'get',
            data: getFormDataForRegistration(), // данные для регистрации
            success: function(response){
                if (response === "error"){
                    showError("Пользователь с таким логином уже есть уже существует");
                }else{
                    	console.log("регистрация прошла успешно");
			//сохранение логина пользователя, который только что авторизировался
			//в sessionStorage (это хранилище хранит данные только пока открыта вкладка)
			sessionStorage.setItem("login", response.userLogin);
			//переход по ссылке http://localhost:12321/main
			//новая страница откроется в той же вкладке (параметр '_self')
			window.open("http://localhost:12321/main", "_self");
                }
            },
            error: function(result){
                showError(result);
                console.log("error");
            }
        });
    });
});

function getFormDataForRegistration(){ //формируем данные для request
    var config = {}; //это объект
    //map по очереди рассматривает элементы массива, сформированные из данных формы
    $("#registration_form").serializeArray().map(function(item) { //из формы формируем данные в запрос в виде "имя поля" = "значение"
        if (item.name !== "repeat") {
            config[item.name] = item.value;
        }
    });
    return config;
}
