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
                    console.log("не удалось войти");
                    $("#error").css("display", "initial");
                    $("#error").val("Ошибка входа.");
                }else{
                    sessionStorage.setItem("login", response.userLogin);
                    console.log("aaaaaaaaaaaaaaaaaa");
                    console.log(response.userLogin);
                    document.write(response.html);
                    console.log("aaaaaaaaaaaaaaaaaa");
                }
            },
            error: function(result){
                $("#error-label").val("Произошла ошибка");
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