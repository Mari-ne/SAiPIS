$.ajax({
    url: 'http://localhost:12321/getBooks',
    method: 'get',
    success: function(response){
        document.getElementById("insertBody").innerHTML += response;
		$("button[id^='but_']").click(function () {
		    var current_but_id = this.id;
		    var index = current_but_id.substring(4, current_but_id.length);
		    var bookId = "book" + index;
		    var bookName = $("#"+bookId+"").html();
            var authorId = "author" + index;
            var authorName = $("#"+authorId+"").html();
            if (sessionStorage.getItem("login") ==  null){
                //нет авторизированного пользователя

            }else{
                var config = {}; //это объект
                config["user"] = sessionStorage.getItem("login");
                config["bookName"] = bookName;
                config["authorName"] = authorName;
                $.ajax({
                    url: 'http://localhost:12321/makeOrder',
                    method: 'get',
                    data: config,
                    success: function (response) {
                        console.log("eee");
                    },
                    error: function (response) {
                        console.log("error");
                    }
                });
            }
		});
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
