
/*
 * GET home page.
 */

 
var Db = require('mysql-activerecord');
var db = new Db.Adapter({
    server: 'localhost',
    username: 'root',
    password: 'D3c3p710n',
    database: 'panic'
});




exports.index = function(req, res){

/* var data= db.count('tbl_medicos',function(data){console.log(data);});*/
 //db.select('id,nomCompleto').get('tbl_medicos',function(err,data){ console.log(data); }); 


 db.select(['tbl_abonados.id as abonado_id','tbl_panic_alerts.id as alert_id','tbl_panic_alerts.abonado_id','tbl_panic_alerts.alert_type_id','tbl_alert_type.description as descriptionAlert','tbl_abonados.name','tbl_abonados.name','tbl_abonados.FirstName','tbl_catalog_mass_media.description as mediaDescription','tbl_panic_alerts.latitude','tbl_panic_alerts.longitude']);
 db.join('tbl_abonados', 'tbl_abonados.id = tbl_panic_alerts.abonado_id')
 db.join('tbl_catalog_mass_media','tbl_abonados.massmed_id = tbl_catalog_mass_media.id')
 db.join('tbl_alert_type','tbl_panic_alerts.alert_type_id=tbl_alert_type.id')
.get('tbl_panic_alerts', function(err, results, fields) {
         	 
    res.render('index',{data:results});


});


     

};





exports.form=function(req,res){

   res.render('form',{data:''});
}


exports.abonado=function(req,res){

  
 db.select(['tbl_abonados.id as abonado_id','tbl_panic_alerts.id as alert_id','tbl_panic_alerts.abonado_id','tbl_panic_alerts.alert_type_id','tbl_alert_type.description as descriptionAlert','tbl_abonados.name','tbl_abonados.name','tbl_abonados.FirstName','tbl_catalog_mass_media.description as mediaDescription','tbl_panic_alerts.latitude','tbl_panic_alerts.longitude']);
 db.join('tbl_abonados', 'tbl_abonados.id = tbl_panic_alerts.abonado_id')
 db.join('tbl_catalog_mass_media','tbl_abonados.massmed_id = tbl_catalog_mass_media.id')
 db.join('tbl_alert_type','tbl_panic_alerts.alert_type_id=tbl_alert_type.id')
 db.where("tbl_abonados.id="+req.params.id + " and tbl_panic_alerts.abonado_id="+req.params.id)
 .get('tbl_panic_alerts', function(err, results, fields) {
    res.send(results);
});


/*
    db.select('id,name, FirstName,LastName').where('id='+req.params.id).get('tbl_abonados',function(err,data){
      res.send(data);
   }); 
*/


}



exports.login=function(req,res){
 

  var username=req.body.username;
  var password=req.body.password;
  if(username.length!=0 && password.length !=0){
     db.select('id,username,password').where('username= "'+ username +'" and password="'+password+'"').get('tbl_abonados',function(err,data){
            if(data.length>0){
                 res.send(data);
            }else{
            	res.send('{error:"Acces Denied"}');
            }   
     });
  }else{
  	res.send('{error:"not data"}');
  }
  
}




exports.alertPanic = function (req,res){
      
      var cabonado_id=req.body.abonado_id;
      var calert_type_id=req.body.alert_type_id;
      var clatitude=req.body.latitude;
      var clongitude=req.body.longitude;


      if( cabonado_id !=" "  && calert_type_id !=" " && clatitude !=" " && clongitude !=" " ){
       
        db.insert('tbl_panic_alerts', { abonado_id: cabonado_id , alert_type_id: calert_type_id ,latitude:clatitude ,longitude:clongitude }, function(err, alert){              
            db.insert('tbl_tracking_gps', { alert_id: alert.insertId, abonado_id: cabonado_id , alert_type_id: calert_type_id, latitude:clatitude, longitude:clongitude, dat_time:getDateTime() }, function(err, info){ 
                 res.send('{ alert_id:"'+alert.insertId+'",abonado_id:"'+cabonado_id+'",alert_type_id:"'+calert_type_id+'"}');  


            });
        });

      }

      
} 

exports.trakingGPS=function (req,res){

   
      var calertid=req.body.alert_id;
      var cabonado_id=req.body.abonado_id;
      var calert_type_id=req.body.alert_type_id;
      var clatitude=req.body.latitude;
      var clongitude=req.body.longitude;
      db.insert('tbl_tracking_gps', { alert_id: calertid, abonado_id:cabonado_id , alert_type_id:calert_type_id, latitude:clatitude, longitude:clongitude, dat_time: getDateTime() }, function(err, info){ 
             res.send('{ alert_id:"'+info.insertId+'",abonado_id:"'+cabonado_id+'",alert_type_id:"'+calert_type_id+'"}');  
      });


}



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