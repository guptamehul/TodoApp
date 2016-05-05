$('.login').on('click',function(e){
	$.ajax({
		uri:'/login',
		method:'post',
		'content-type':'application/json',
		'data':{email:'m@gmail.com',pass:'123'}
	})
	.success(function(){
		//redirect to home
	})
	.fail(function(){
		//redirect to login with errors
	})
})

$('.checkbox').on('click',function(e){
	var uid = $(this).uid;
	var status = ($(this:checked)) ? true : false
	// /todos/1/true
	$.ajax({
		uri:'/todos/'+uid+'/'+status,
		method:'post',
		'content-type':'application/json',
		'data':{email:'m@gmail.com',pass:'123'}
	})
	.success(function(d){
		//redirect to home

	})
	.fail(function(){
		//redirect to login with errors
	})
})

function gettodos() {
	return $http.get('/todos/' + todo_id + '/' +'true').exec();
}

gettodos().then(function(d){
	
})
