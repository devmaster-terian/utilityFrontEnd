var objAmbienteOpenLink = new Object();
//objAmbienteOpenLink.servidorWeb      = 'http://10.11.21.19';http://127.0.0.1:5000/read_users
//objAmbienteOpenLink.servidor         = '10.11.21.19';
//objAmbienteOpenLink.servicio         = 'OPENLINK_WS_PRUEBAS';
//objAmbienteOpenLink.programa         = 'openLink&Tipo.html';
objAmbienteOpenLink.servidorWeb      = 'http://127.0.0.1:5050';
objAmbienteOpenLink.servidor         = '127.0.0.1';
objAmbienteOpenLink.servicio         = '5050';
objAmbienteOpenLink.programa         = 'login';
objAmbienteOpenLink.ambiente         = 'Stageing Environment';
objAmbienteOpenLink.versionOpenLink  = '2.0';
objAmbienteOpenLink.cgiWebspeed      = 'scripts/cgiip.exe/WService=';
objAmbienteOpenLink.tituloAplicacion = 'TERIAN - Enterprise Framework';

Ext.define('modAmbienteOpenLink',
{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'servidorWeb',      type:'string'},
		{name: 'servidor',         type:'string'},
		{name: 'servicio',         type:'string'},
		{name: 'programa',         type:'string'},
		{name: 'ambiente',         type:'string'},
        {name: 'tituloAplicacion', type:'string'}
	]
});

Ext.define('storeAmbienteOpenLink',
{
	extend: 'Ext.data.Store',
	model: 'modAmbienteOpenLink',
	proxy:{
		type: 'sessionstorage',
		id: 'storeAmbienteOpenLink'
	}
});

function obtieneUrlOpenLink(p_tipoRespuesta, p_procesoServidor){
    let cUrlRetorno = '';
    let cProgramaWebspeed = objAmbienteOpenLink.programa;
    
    
    if(p_tipoRespuesta === undefined){
        console.error('configAmbienteOpenLink::Debe informar un Tipo de Respuesta para generar la URL');
        return 'nok';
    }
    
    if(p_procesoServidor !== undefined){
        p_tipoRespuesta = p_tipoRespuesta + p_procesoServidor;
    }
    
    cProgramaWebspeed = cProgramaWebspeed.replace('&Tipo',p_tipoRespuesta);
    
    urlRetorno = '../../../../../../' +
                 objAmbienteOpenLink.cgiWebspeed + 
                 objAmbienteOpenLink.servicio + '/' + 
                 cProgramaWebspeed;
    
    console.log('urlRetorno:' + urlRetorno);
    return urlRetorno;
}


function rutaBase(){
    let urlRetorno = '../../../../../';
    return urlRetorno;
}

function datosOpenLink(p_dato){
    var datoRetorno ='Sin dato recibido';
  
    if(p_dato == 'servidorWeb'){
        datoRetorno = objAmbienteOpenLink.servidorWeb;
    }
    
    if(p_dato == 'servidor'){
        datoRetorno = objAmbienteOpenLink.servidor;
    }
    
    if(p_dato == 'servicio'){
        datoRetorno = objAmbienteOpenLink.servicio;
    }
    
    if(p_dato == 'programa'){
        datoRetorno = objAmbienteOpenLink.programa;
    }
    
    if(p_dato == 'ambiente'){
        datoRetorno = objAmbienteOpenLink.ambiente;
    }
    
    if(p_dato == 'tituloAplicacion'){
        datoRetorno = objAmbienteOpenLink.tituloAplicacion;
    }	

    if(p_dato == 'versionOpenLink'){
        datoRetorno = objAmbienteOpenLink.versionOpenLink;
    }	
    
    return datoRetorno;
}


function validaArchivo(){
    var archivo = 'Archivo configAmbiente.js listo!';
    return archivo;
}

function generaAmbienteOpenLink(){
	Ext.onReady(function(){

		var storeAmbienteOpenLink = Ext.create('storeAmbienteOpenLink');
		storeAmbienteOpenLink.getProxy().clear();
        

        /*------------------------------------------------------\
        | ECRC: Todos los campos deben leerse en Minusculas.	|
        \------------------------------------------------------*/
        storeAmbienteOpenLink.add({
            servidorWeb      : objAmbienteOpenLink.servidorWeb,
            servidor         : objAmbienteOpenLink.servidor,
            servicio         : objAmbienteOpenLink.servicio,
            programa         : objAmbienteOpenLink.programa,
            ambiente         : objAmbienteOpenLink.ambiente,  
            tituloAplicacion : objAmbienteOpenLink.tituloAplicacion
        });
        
		storeAmbienteOpenLink.sync();
	});
}

function recuperaDatoAmbiente(p_dato){
	var valRetorno = '';
    var storeAmbienteOpenLink = Ext.create('storeAmbienteOpenLink');
    
    storeAmbienteOpenLink.load(function(records,op,success){
        var sesionCPX, iCiclo;
        
        for (iCiclo=0; iCiclo<records.length; iCiclo++){
            sesionCPX = records[iCiclo].data;
            valRetorno = sesionCPX[p_dato];
        }
        
        return valRetorno;
    });
    return valRetorno;
}

generaAmbienteOpenLink();