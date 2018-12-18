$.ajax({
    url: 'http://localhost:12321/getAllOrdersTable',
    method: 'get', // данные передадутся не текстом запроса
    success: function(response){
        //получение html файла allOrders.html для заполнения внутренней части 
        //страницы AllOrdersPage.html 
        $("#container").append(response); //Вставка allOrders.html после всех дочерних элементов
    },
    error: function(result){
        console.log(result);
        console.log("error");
    }
});