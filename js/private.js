var config = {}; //это объект
config["user"] = sessionStorage.getItem("login");

$.ajax({
    url: 'http://localhost:12321/getOrders',
        method: 'get',
		data: config,
        success: function(response){
            document.getElementById("insertBody").innerHTML += response;
           
        },
        error: function(result){
            console.log(result);
            console.log("error");
        }
                
});
