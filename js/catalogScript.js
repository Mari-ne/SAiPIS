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
	window.open('http://localhost:12321/about', '_self');
})