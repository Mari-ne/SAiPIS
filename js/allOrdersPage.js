$.ajax({
    url: 'http://localhost:12321/getAllOrdersData',
    method: 'get',
    success: function(response){
        //получение html файла catalog.html для заполнения внутренней части 
        //страницы main.html 
        document.getElementById("insertBody").innerHTML += response;
    },
    error: function(result){
        console.log(result);
        console.log("error");
    }
});


$("#about").click(function(){
	//при нажатии на кнопку #about происходит переход по адресу localhost:12321/about
	//новая страница открывается в той же вкладке (параметр _self)
	window.open('http://localhost:12321/about', '_self');
})