var express= require('express');
var path=require('path');
var http = require('http');
var app=express();
var url1= require('url');
var querystring=require('querystring');
var MongoClient=require('mongodb').MongoClient;

var url ="mongodb://localhost:27017/user"

app.use(express.static(__dirname + '/public'));


app.listen(3000,function(request,response){ 

	app.get('/setup',function(request,response){
		response.sendFile(path.join(__dirname ,'/public','setup.html'));
		console.log('/setup');
	});
	
	


	app.post('/setup',function(request,response){	
			console.log('/setup')
			var reviewData="";
			var data="";	

				request.on("data",function(chunk){ // similar to event.Listner() collects data from inputs field.i.e. user entered filed
					reviewData+=chunk;
				});
				
				request.on("end",function(){ 	// when data is ended
					data=querystring.parse(reviewData);
					console.log("1111111111111111111111111111ONNNNNNNNNNNNNNNNNNNNN");						
					console.log(data);
		
				});

				
					MongoClient.connect(url,function(err,db){ // connect to mongodb
						if(err) throw err;
						var value=1
						data.count=value; // adding one more field t get info about how many time perticular user has login
						db.collection('user').insertOne(data,function(err,res){          // inserting data object in database
							if(err) throw err;	
							console.log("333333333333333333333document inserted:");
							console.log(data);
							db.close();
						});
					});	

			app.get('/',function(req,res){
				res.status(200).send(data);
			});
			//response.sendFile(path.join(__dirname,'public','/setup.html'));
		});//post		

	
	app.get('/entry',function(request,response){
		response.sendFile(path.join(__dirname ,'/public','entry.html'));
		console.log('/entry');
	})
	
		
	app.post('/login',function(request,response){	
			console.log('/login')
			var reviewData="";
			var data="";	
				request.on("data",function(chunk){ // similar to event.Listner() collects data from inputs field.i.e. user entered filed
					reviewData+=chunk;
				});
				
				request.on("end",function(){ 	// when data is ended
					data=querystring.parse(reviewData);
						console.log("1111111111111111111111111111ONNNNNNNNNNNNNNNNNNNNN");						
					console.log(data);
		
				});
				
				MongoClient.connect(url,function(err,db){ // connect to mongodb
					if(err) throw err;
					db.collection('user').findOne(data,function(err,result){ // finding username and passord present in database or not and it will return database object
								if(err) throw err;
								if(result!=null)
								{	
									console.log(result);
									console.log("login succesfully");	
												app.get('/',function(req,res){
													res.status(200).send(result);
												});
									response.sendFile(path.join(__dirname,'public','/homeScreen.html'));
		
								}else{
									console.log("Invailed details");
										app.get('/entry',function(request,response){
											response.sendFile( path.join(__dirname,'public','entry.html'));
											response.write("WRONG DETAILS")
											console.log('/entry');
										});
	
									
		
						
								}
								db.close();
							});

					});					
				
	});

console.log("server started listen on port 3000");
}).listen(3000);