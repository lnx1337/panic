
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');



var multipart = require('multipart');
var sys = require('sys'); 
var fs= require('fs');
var exec = require('child_process').exec;


var Db = require('mysql-activerecord');
var db = new Db.Adapter({
    server: 'localhost',
    username: 'root',
    password: 'D3c3p710n',
    database: 'panic'
});




var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


/*
var Db = require('mysql-activerecord');
var db = new Db.Adapter({
    server: 'localhost',
    username: 'root',
    password: '',
    database: 'panic'
});

*/



var server= http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


 var io = require('socket.io').listen(server);

io.sockets.on('connection', function(client) {
   
   /*

   client.on('refresh', function() {	
         
     db.select(['tbl_abonados.id as abonado_id','tbl_panic_alerts.id as alert_id','tbl_panic_alerts.abonado_id','tbl_panic_alerts.alert_type_id','tbl_alert_type.description as descriptionAlert','tbl_abonados.name','tbl_abonados.name','tbl_abonados.FirstName','tbl_catalog_mass_media.description as mediaDescription','tbl_panic_alerts.latitude','tbl_panic_alerts.longitude']);
     db.join('tbl_abonados', 'tbl_abonados.id = tbl_panic_alerts.abonado_id')
     db.join('tbl_catalog_mass_media','tbl_abonados.massmed_id = tbl_catalog_mass_media.id')
     db.join('tbl_alert_type','tbl_panic_alerts.alert_type_id=tbl_alert_type.id')
     .get('tbl_panic_alerts', function(err, results, fields) {
                 client.broadcast.emit('list',JSON.stringify(results));
    });

  });

   

     */
       //io.broadcast.emit('user connected');

      //client.broadcast.emit('list',"que pedo");
      client.emit('conectado', { hello: 'hello world node :) lnx1337' });





});





app.get('/form',routes.form);
app.get('/', routes.index);
app.get('/alert/:id',routes.alert);
app.get('/abonados', user.list);



app.post('/',function(req,res){



console.log(req.files);



  var cabonado_id=req.body.abonado_id;
  var calert_type_id=req.body.alert_type_id;
  var clatitude=req.body.latitude;
  var clongitude=req.body.longitude;


   if(req.files!=null){

      fs.readFile(req.files.displayImage.path, function (err, data) {
      var picture=getName();
      var newPath =__dirname+"/public/uploads/"+picture;

      fs.writeFile(newPath, data, function (err) {
             if(err){
              console.log(err);
             }
       });

   
     var cmd="exiftool -j "+newPath; 
     var child = exec(cmd, function (error, stdout, stderr) {
       
          var result = '{"stdout":' + stdout + ',"stderr":"' + stderr + '","cmd":"' + cmd + '"}';    
          var json=JSON.parse(stdout);
          
            if(json[0].GPSLatitude!=null &&json[0].GPSLongitude){

             var Latitude=json[0].GPSLatitude.split(' ');
             var Longitude=json[0].GPSLongitude.split(' ');

             var longitudeDecimal=decimalCoorsLong(Longitude);
             var latitudeDecimal=decimalCoorsLat(Latitude);

             req.body.longitude=longitudeDecimal;
             req.body.latitude=latitudeDecimal;
             req.body.picture=picture;      
             
             console.log(req.body);




            if( cabonado_id !=" "  && calert_type_id !=" " && clatitude !=" " && clongitude !=" " ){
                  
                    db.insert('tbl_panic_alerts', { abonado_id: cabonado_id , alert_type_id: calert_type_id ,latitude:clatitude ,longitude:clongitude }, function(err, alert){              
                        db.insert('tbl_tracking_gps', { alert_id: alert.insertId, abonado_id: cabonado_id , alert_type_id: calert_type_id, latitude:clatitude, longitude:clongitude, dat_time:getDateTime() }, function(err, info){ 

                             
                              


                              db.insert('tbl_fotos', { url: picture ,latitude: latitudeDecimal, longitude: longitudeDecimal }, function(err,foto){
 

                                    
                                      
                                  
                                       db.insert('tbl_fotos_has_tbl_panic_alerts', { tbl_fotos_id:foto.insertId,  tbl_panic_alerts_id:alert.insertId,tbl_panic_alerts_tbl_abonados_id:cabonado_id}, function(err,foto){
                                                

                                                console.log(err);

                                                console.log(foto);
                    

                                                    db.select(['tbl_abonados.id as abonado_id','tbl_panic_alerts.id as alert_id','tbl_panic_alerts.abonado_id','tbl_panic_alerts.alert_type_id','tbl_alert_type.description as descriptionAlert','tbl_abonados.name','tbl_abonados.name','tbl_abonados.FirstName','tbl_catalog_mass_media.description as mediaDescription','tbl_panic_alerts.latitude','tbl_panic_alerts.longitude']);
                                                    db.join('tbl_abonados', 'tbl_abonados.id = tbl_panic_alerts.abonado_id')
                                                    db.join('tbl_catalog_mass_media','tbl_abonados.massmed_id = tbl_catalog_mass_media.id')
                                                    db.join('tbl_alert_type','tbl_panic_alerts.alert_type_id=tbl_alert_type.id')
                                                     .get('tbl_panic_alerts', function(err, results, fields) {
                                                          // io.sockets.broadcast.emit('list',JSON.stringify(results));
                                                           
                                                           //console.log(results);
                                                           io.sockets.emit('refresh',JSON.stringify(results));



                                                     });
                                                                                                     
                                             });

                      
                                   

   
                              });
                        });
                    });

                  }

                                  
           }
     });

 });

}


    

});
app.post('/login',routes.login);
app.post('/trakingGPS',routes.trakingGPS);

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

}





function decimalCoorsLat(arrayLat){
    
    var arreglo=arrayLat;
    var Grados= arreglo[0];
    var Minutos=arreglo[2];
    var Segundos=arreglo[3];
    var direccion=arreglo[4];

    Minutos=Minutos.split("'");
    Segundos=Segundos.split('"');
    latitude_sign = (direccion == "N") ? 1 : -1;
    latitude  = (parseFloat(Grados)  + ( parseFloat(Minutos[0]) / 60.0)  + ( parseFloat(Segundos[0]) / 60.0 / 60.0))  * latitude_sign;

    return latitude;
}


function decimalCoorsLong(arrayLong){
    
    var arreglo=arrayLong;
    var Grados= arreglo[0];
    var Minutos=arreglo[2];
    var Segundos=arreglo[3];
    var direccion=arreglo[4];
      
    Minutos=Minutos.split("'");
    Segundos=Segundos.split('"');

    longitude_sign = (direccion == "E") ? 1 : -1;
    longitude = ( parseFloat(Grados) +  ( parseFloat(Minutos) / 60.0) + ( parseFloat(Segundos) / 60.0 / 60.0)) * longitude_sign;

    return longitude;
}

function getName(){
  return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace('-','').replace(':','').replace(' ','').replace('-','').replace(':','')+".jpg"; 
}




