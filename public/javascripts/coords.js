var signlat=1;
var signlon=1;
var latAbs=0;
var lonAbs=0;
var deglat=' ';
var deglon=' ';

function convertLat(latitudGPS){
				error=0;

					if (latitudGPS.indexOf(",")!=-1){
						alert("ERROR: Utiliza \'.\' para separar decimales en vez de \',\'. (Ejemplo: 40.345233)");
					}

				 if(latitudGPS < 0){signlat = -1;}

				latAbs = Math.abs( Math.round(latitudGPS * 1000000.));
				if(latAbs > (90 * 1000000)) { 
					alert('ERROR: Los Grados (º) de la Latitud varian entre -90 y 90.'); 
					latAbs=0;
					error=1;
				}


				if (error==0){				
					return ((Math.floor(latAbs / 1000000) * signlat) + 'º' + Math.floor(  ((latAbs/1000000) - Math.floor(latAbs/1000000)) * 60)  + '\' ' +  ( Math.floor(((((latAbs/1000000) - Math.floor(latAbs/1000000)) * 60) - Math.floor(((latAbs/1000000) - Math.floor(latAbs/1000000)) * 60)) * 100000) *60/100000 ) + '\"'  );				
					
				}
			signlat=1;
			signlon=1;
 }


function convertLng(longitudGPS){
         error=0;

		   if (longitudGPS.indexOf(",")!=-1){
							alert("ERROR: Utiliza \'.\' para separar decimales en vez de \',\'. (Ejemplo: 40.345233)");
						}

		   if(longitudGPS < 0)  {signlon = -1;}
				
		   lonAbs = Math.abs(Math.round(longitudGPS * 1000000.));

				if(lonAbs > (180 * 1000000)) {  
					alert('ERROR: Los Grados (º) de la Longitud varian entre -180 y 180.'); 
					
					lonAbs=0; 
					
					error=1;
				}

		if (error==0){							
					return ((Math.floor(lonAbs / 1000000) * signlon) + 'º ' + Math.floor(  ((lonAbs/1000000) - Math.floor(lonAbs/1000000)) * 60)  + '\' ' +  ( Math.floor(((((lonAbs/1000000) - Math.floor(lonAbs/1000000)) * 60) - Math.floor(((lonAbs/1000000) - Math.floor(lonAbs/1000000)) * 60)) * 100000) *60/100000 ) + '\"'  );
				}
			signlat=1;
			signlon=1;					
						
}			
