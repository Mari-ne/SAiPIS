try{
	sessionStorage.clear();
}
catch(err){
	;
}

$(document).ready(function() {
    //html  польностью загружен

    $("#entry").click(function(){
        //была нажата кнопка Войти
        $.ajax({
            url: 'http://localhost:12321/entry',
            method: 'get',
            data: getFormDataForEntry(),
            success: function(response){
                console.log("send");
                if(response === "error"){
                    showError("Не удалось войти");
                }else{
			sessionStorage.setItem("login", response.userLogin); //сохранение логина авторизировавшегося 
			//пользователял в sessionStorage (это хранилище хранит данные только пока открыта вкладка)
			//переход по ссылке http://localhost:12321/main
			//новая страница откроется в той же вкладке (параметр '_self')
			window.open("http://localhost:12321/main", "_self");
                }
            },
            error: function(result){
                showError(result);
            }
        });
    });
});

function getFormDataForEntry(){ //формируем данные для request
    var config = {}; //это объект
    //map по очереди рассматривает элементы массива, сформированные из данных формы (Логин + пароль)
    $("#entry_form").serializeArray().map(function(item) { //из формы формируем данные в запрос в виде "имя поля" = "значение"
        config[item.name] = item.value;
    });
    return config;
}
