$.ajax({
    url: 'http://localhost:12321/catalog',
    method: 'get',
    success: function(response){
        //получение html файла catalog.html для заполнения внутренней части 
        //страницы main.html 
        $("#container").append(response);
    },
    error: function(result){
        console.log(result);
        console.log("error");
    }
});
