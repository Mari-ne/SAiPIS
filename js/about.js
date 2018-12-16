//$(document).ready(function(){
	$.ajax({
		url: 'http://localhost:12321/contacts',
		method: 'get',
		datatype: "json",
		success: function(response){
			//response содержит массив JS Object'ов, которые хранят объект типа:
			// type: 
			// value: 
			console.log(response);
			response.map(function(item){
				//для каждого элемента массива создается элемент (li) в списке(#contacts)
				$("#contacts").append($("<li></li>").text(item.type + ":  " + item.value));
			});
			
		}
	});
//});
