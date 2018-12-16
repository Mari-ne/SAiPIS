//$(document).ready(function(){
	$.ajax({
		url: 'http://localhost:12321/contacts',
		method: 'get',
		datatype: "json",
		success: function(response){
			console.log(response);
			response.map(function(item){
				$("#contacts").append($("<li></li>").text(item.type + ":  " + item.value));
			});
			
		}
	});
//});
