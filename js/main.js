$.ajax({
    url: 'http://localhost:12321/catalog',
    method: 'get',
    success: function(response){
        $("#container").append(response);
    },
    error: function(result){
        console.log(result);
        console.log("error");
    }
});