var config = {}; //это объект
config["user"] = sessionStorage.getItem("login"); // получаем логин текущего пользователя из хранилища
if(config.user)//если логин не пустой и найден
	$("#currentUserLabel").append("<strong>Текущий Пользователь: </strong>" + config.user); // выводим текущего пользователя
else//иначе
	$("#currentUserLabel").append("<strong class = 'text-danger'>Вы не вошли в систему!</strong>");//выводим предупреждение

if(config.user !== null && config.user !== undefined){
	$.ajax({
		url: 'http://localhost:12321/getPrivateTable',
			method: 'get',
			data: config,
			success: function(response){
			   $("#container").append(response); // вставляем после всех дочерних элементов
			},
			error: function(result){
				console.log(result);
				console.log("error");
			}         
	});
}