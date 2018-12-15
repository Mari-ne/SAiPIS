$(document).ready(function() {
    //html  польностью загружен

    $("#registration").click(function(){
        //была нажата кнопка Зарегистрироваться
        $.ajax({
            url: 'http://localhost:12321/registration',
            method: 'get',
            data: getFormData(),
            success: function(response){
                console.log("send");
            },
            error: function(result){
                console.log(result);
                $("#error-label").val("Произошла ошибка");
            }
        });
    });
});

function getFormData(){ //формируем данные для request
    var config = {}; //это объект
    //map по очереди рассматривает элементы массива, сформированные из данных формы
    $("#registration_form").serializeArray().map(function(item) { //из формы формируем данные в запрос в виде "имя поля" = "значение"
        if (item.name !== "repeat") {
            config[item.name] = item.value;
        }
    });
    return config;
}