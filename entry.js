$(document).ready(function() {
    //html  польностью загружен

    $("#entry").click(function(){
        //была нажата кнопка Войти
        $.ajax({
            url: 'http://localhost:12321/entry',
            method: 'get',
            data: getFormData(),
            success: function(response){
                console.log("send");
            },
            error: function(result){
                console.log(result);
            }
        });
    });
});

function getFormData(){ //формируем данные для request
    var config = {}; //это объект
    //map по очереди рассматривает элементы массива, сформированные из данных формы (Логин + пароль)
    $("#entry_form").serializeArray().map(function(item) { //из формы формируем данные в запрос в виде "имя поля" = "значение"
        config[item.name] = item.value;
    });
    return config;
}