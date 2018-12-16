$.ajax({
    url: 'http://localhost:12321/getBooks',
    method: 'get',
    success: function(response){
        document.getElementById("insertBody").innerHTML += response;
		$("button[id^='but_']").click(function () {
					alert("yes");
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
