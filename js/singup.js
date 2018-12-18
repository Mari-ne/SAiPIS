//при фокусе на input'e, находящемся в поле с id signup-tab
//цвет его фона изменяет цвет
$("#signup-tab input").focus(function(){
	$(this).css("background", "AliceBlue");
});

//при потере фокуса элементом input, находящимся внутри поля с id signup-tab
//цвет возвращается к изначальному
$("#signup-tab input").focusout(function(){
	$(this).css("background", "white");
});