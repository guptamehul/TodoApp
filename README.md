Language : Angular and Node Js
=============================Node Js =============================

1.  npm install express-generator -g  
	install express generator globally 

2. express [project_name] -e or ''
	create project skeleton
	e : ejs template engine
	'' : jade 

	install express package locally using command :
	 npm install express --save

3. edit app.js
	write:

	app.listen(4040,function(){
  		console.log("Hey I am your server listening on port 4040!!!!!")
	})

4. run server
	node app.js or nodemon app.js
