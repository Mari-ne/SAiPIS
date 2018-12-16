$.ajax({
    url: 'http://localhost:12321/getBooks',
    method: 'get',
    success: function(response){
        document.getElementById("insertBody").innerHTML += response;
    },
    error: function(result){
        console.log(result);
        console.log("error");
    }
});

$('[id^="but_"]').click(function () {
        alert("yes");
});

$("#about").click(function(){
	$.ajax({
		url: 'http://localhost:12321/about',
		method: 'get',
		datatype: "text/html",
		success: function(page){
			document.write(page);
		}
	})
})