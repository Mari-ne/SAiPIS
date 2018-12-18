$.ajax({
    url: 'http://localhost:12321/getAllOrdersData',
    method: 'get', // данные передадутся не текстом запроса
    success: function(response){
        document.getElementById("insertBody").innerHTML = response; // вставка разметки внутрь блока
    },
    error: function(result){
        console.log(result);
        console.log("error");
    }
});