/*----------------------------------------------------------------------------------------------------------------------------------\
| CORPORATIVO COPAMEX SA DE CV             |                              COORDINACION DE SISTEMAS                                  |
|-----------------------------------------------------------------------------------------------------------------------------------|
| Programa: copamex\framework\recursosJS\configOpenLink.js                                                                          |
| Objetivo: Librería con facilitadores para el manejo de la Interfaz con Sencha ExtJS                                               |
|    Autor: Erick Christian Rosales Cruz                                                                                            |
|    Fecha: Septiembre del 2014                                                                                                     |
|  Sistema: Integración Datasul - Syncro Fosber                                                                                     |
|-----------------------------------------------------------------------------------------------------------------------------------|
|                                     H I S T O R I A L   D E   M O D I F I C A C I O N E S                                         |
|-----------------------------------------------------------------------------------------------------------------------------------|
| RESPONSABLE              |  TAREA   |  FECHA       | DESCRIPCION                                                                  |
|-----------------------------------------------------------------------------------------------------------------------------------|
| Erick Rosales  (ECRC)    |  000000  |  00/00/0000  | Actualización de la Librería.                                                |
\----------------------------------------------------------------------------------------------------------------------------------*/
Ext.define('modOpenLink',
           {
               extend: 'Ext.data.Model',
               fields: [
                   {name: 'idStore', type:'string'},
                   {name: 'respuestaJson', type:'string'}
               ]
           });

function preparaDataGrid(pDatos,pTablaRetorno){
    var datosJson = pDatos;
    var datosRetorno = datosJson[pTablaRetorno];
    console.warn('datosRetorno');
    console.warn(datosRetorno);
    return datosRetorno;
}

function transformaRespuestaWS(pDatosJson){
    var objRespuestaAPI = {}; //Objeto Vacio
    objRespuestaAPI.success = pDatosJson.success;

    console.warn('Haciendo el Map');
    if(pDatosJson.informacion !== undefined){
        pDatosJson.informacion.map(aElemento =>{
            console.log('aElemento');
            console.log(aElemento);
            objRespuestaAPI[Object.keys(aElemento)] = Object.values(aElemento)[0];
        });    
    }
    return objRespuestaAPI;
}



function generaDatosOpenLink(p_idStore, 
                              p_respuestaJson){
    Ext.define('storeOpenLink',
               {
                   extend: 'Ext.data.Store',
                   model: 'modOpenLink',
                   proxy:{
                       type: 'sessionstorage',
                       id: p_idStore
                   }
               });

    var storeOpenLink = Ext.create('storeOpenLink');
    storeOpenLink.getProxy().clear();

    storeOpenLink.add({
        idStore: p_idStore,
        respuestaJson: p_respuestaJson
    });

    storeOpenLink.sync();  
}

function recuperaDatosOpenLink(p_idStore){

    Ext.define('storeOpenLink',
               {
                   extend: 'Ext.data.Store',
                   model: 'modOpenLink',
                   proxy:{
                       type: 'sessionstorage',
                       id: p_idStore
                   }
               });

    var valRetorno = '';
    var storeOpenLink = Ext.create('storeOpenLink');

    Ext.define('storeOpenLink',
               {
                   extend: 'Ext.data.Store',
                   model: 'modOpenLink',
                   proxy:{
                       type: 'sessionstorage',
                       id: 'openLink'
                   }
               });

    storeOpenLink.load(function(records,op,success){
        var datosOpenLink, iCiclo;

        for (iCiclo=0; iCiclo<records.length; iCiclo++){
            datosOpenLink = records[iCiclo].data;
            //valRetorno = Ext.decode(datosOpenLink.respuestaJson);
            valRetorno = datosOpenLink.respuestaJson;

        }

        return valRetorno;
    });
    return valRetorno;
}


function muestraErrorServer(p_datosOpenLink, p_funcionExtra){
    if(p_datosOpenLink === undefined){
        console.warn('muestraErrorServer - No se recibió el Objeto con los Datos');
        return;
    }

    if(p_datosOpenLink.temp_mensaje_exec === undefined){
        return;
    }
    
    var numRegistros = Object.keys(p_datosOpenLink.temp_mensaje_exec).length;
    var errorApi = '';

    for(var iCiclo=0; iCiclo < numRegistros; iCiclo++){
        if(p_datosOpenLink.temp_mensaje_exec[iCiclo] !== null){

            temp_mensaje_exec = p_datosOpenLink.temp_mensaje_exec[iCiclo];

            if(temp_mensaje_exec.tipomensaje !== undefined && temp_mensaje_exec.tipomensaje == '_Error AppServer'){
                errorApi = errorApi + temp_mensaje_exec.contenido + '</br></br>';
            }
        }
    }

    var msgTipo      = 'ERROR';
    var msgTitulo    = 'Error Servidor Backend';
    var msgContenido = errorApi;
    var msgFuncion   = function(p_campoFoco){
        if(p_campoFoco !== undefined){
            enfocaElemento(p_campoFoco);
        }

        if(p_funcionExtra !== undefined){
            p_funcionExtra();
        }
    };

    var msgFormato = {};
    msgFormato.ancho = 700;
    msgFormato.alto  = 140 * numRegistros;

    if(errorApi !== ''){
        mensajeUsr(msgTipo,
                   msgTitulo,
                   msgContenido,
                   msgFuncion,
                   msgFormato
                  );
    }
}

function ejecutaOpenLink(p_datosJsonFormulario, 
                          p_fncSuccess, 
                          p_paramsSuccess,
                          p_fncFailure,
                          p_paramsFailure,
                          p_fncCallback,
                          p_paramsCallback,
                          p_modoDebug,
                          p_configuracion){

    var mensaje      = 'Por favor espere, procesando informacion...';
    var textoProceso = 'Procesando';
    var anchoMensaje = 300;
    var iconoMensaje = 'progresoOpenLink';
    var muestraMensaje = true;
	
    p_datosJsonFormulario.versionOpenLink = recuperaDatoSesion('versionOpenLink');
    //----------------------------------------------------------------//
    // ECRC: Incluyendo Empresa y Sistema en caso de que no Venga.    //
    //----------------------------------------------------------------//
    
    if(p_datosJsonFormulario.codEmpresa === undefined){
        p_datosJsonFormulario.codEmpresa = recuperaDatoSesion('codEmpresa');
        console.warn('ejecutaOpenLink::Empresa establecida:',p_datosJsonFormulario.codEmpresa);
    }

    if(p_datosJsonFormulario.codSistema === undefined){
        p_datosJsonFormulario.codSistema = recuperaDatoSesion('codSistema');
        console.warn('ejecutaOpenLink::Sistema establecido:',p_datosJsonFormulario.codSistema);
    }

    if(p_configuracion !== null && p_configuracion !== undefined){
        mensaje      = p_configuracion.mensaje;
        textoProceso = p_configuracion.textoProceso;
        anchoMensaje = p_configuracion.anchoMensaje;
        iconoMensaje = p_configuracion.icono;

        if(p_configuracion.muestraMensaje !== undefined){
            muestraMensaje = p_configuracion.muestraMensaje;
        }

    }

    var funcionSuccess;
    var funcionFailure;

    if(muestraMensaje === true){
        var cajaEspera = Ext.MessageBox.show({ 
            icon         : iconoMensaje,
            msg          : mensaje, 
            progressText : textoProceso, 
            width        : anchoMensaje, 
            wait         : true, 
            waitConfig   : {interval  :170,
                            increment :10
                           }
        });
    }

    /*--------------------------------------------------------------------------\
    | ECRC: Modificando los datos que se enviaran para cambiar las comas que	|
    |       son los delimitadores que se utilizan en Progress.					|
    \--------------------------------------------------------------------------*/
    //var objDatosJsonFormulario = JSON.parse(p_datosJsonFormulario);
    var objJsonDatos = JSON.parse(p_datosJsonFormulario.datosJson);
    var cambioTexto = true;

    // ECRC: Adicionando la URL del OpenLink
    if(p_datosJsonFormulario.openLinkServidor === undefined){
        p_datosJsonFormulario.openLinkServidor = recuperaDatoSesion('servidor');
        p_datosJsonFormulario.openLinkServicio = recuperaDatoSesion('servicio');
        p_datosJsonFormulario.openLinkPrograma = recuperaDatoSesion('programa');
    }
    
    if(p_datosJsonFormulario.codEmpresa === undefined){
        p_datosJsonFormulario.codEmpresa = recuperaDatoSesion("codEmpresa");
        p_datosJsonFormulario.codSistema = recuperaDatoSesion("codSistema");
    }
    
    if(p_datosJsonFormulario.usuarioActivo === undefined){
        p_datosJsonFormulario.usuarioActivo = recuperaDatoSesion('clavePersona');
    }

    var nombreCampo;
    var valorCampo;
    var aDatosJson;
    aDatosJson = new Array();
    aDatosJson[0] = new Object();

    for(var iCiclo=0; iCiclo < objJsonDatos.length; iCiclo++){
        var contObjJson = objJsonDatos[iCiclo];

        for(var iKeys=0; iKeys < Object.keys(contObjJson).length; iKeys++){


            nombreCampo = Object.keys(contObjJson)[iKeys];
            valorCampo = contObjJson[nombreCampo];

            cambioTexto = true;
            while(cambioTexto){
                cambioTexto = false;
                try{

                    if(valorCampo !== null){
                        if(valorCampo.indexOf(",") > -1){
                            valorCampo = valorCampo.replace(",","#comma"); 
                            cambioTexto = true;
                        }
                    }
                }
                catch(error){
                }
            }
            aDatosJson[0][nombreCampo] = valorCampo;   
        }
    }

    if(aDatosJson[0].p_codSistema === undefined){
       aDatosJson[0].p_codSistema   = recuperaDatoSesion('codSistema'); 
    }

    if(aDatosJson[0].p_codEmpresa === undefined){
       aDatosJson[0].p_codEmpresa   = recuperaDatoSesion('codEmpresa');
    }

    if(aDatosJson[0].p_clavePersona === undefined){
        aDatosJson[0].p_clavePersona   = recuperaDatoSesion('clavePersona');
    }

    aDatosJson[0].p_idSesion     = recuperaDatoSesion("idSesion");

    var strJson = JSON.stringify(aDatosJson);
    p_datosJsonFormulario.datosJson = strJson;

    Ext.Ajax.request({
        url: obtieneUrlOpenLink('Json'),
        method: 'POST',
        success: function(response,opts){
            var datosJson = Ext.decode(response.responseText);

            // ECRC: Implementación de la Lógica de Negocio
            var idOpenLink = p_datosJsonFormulario.codProcedimiento;

            if(p_datosJsonFormulario.idOpenLink !== undefined){
                idOpenLink = p_datosJsonFormulario.idOpenLink;
            }

            generaDatosOpenLink(idOpenLink,
                                Ext.encode(datosJson) //ECRC: Almacenando la informacion en Texto Plano
                               );
            // ECRC: Función cuando se ejecuta correctamente el Script en el Servidor 
            if(datosJson.success === true ){
                if(muestraMensaje === true){
                    cajaEspera.hide();
                }                

                if(p_fncSuccess !== undefined){
                    /* ECRC: Funcion especial a ejecutar*/
                    switch(p_fncSuccess){
                        case "despliegaArchivo":
                            console.warn('>>>>despliegaArchivo:Inicia');
                            console.warn('>>>p_paramsSuccess');
                            console.warn(p_paramsSuccess);
                            console.warn('datosJson');
                            console.warn(datosJson);

                            let urlArchivoDescarga = rutaBase() + recuperaDatoSesion('urlTemporal') + datosJson.tempArchivoGenerado[0].nombrearchivo;
                            console.warn('urlArchivoDescarga: ',urlArchivoDescarga);

                            funcionSuccess = p_fncSuccess + "('" + urlArchivoDescarga + "',p_paramsSuccess)";  

                            console.warn('funcionSuccess::',funcionSuccess);

                            try{
                                eval(funcionSuccess);
                            } catch(error){
                                console.error('Error en la Funcion: ' + funcionSuccess);
                                console.error(error.message);
                                console.error('Verifique la Sintaxis de la Funcion.');
                            }      
                            break;                         
                        case "generaReporte":
                            //--------------------------------------\
                            // ECRC: Integración de Jasper Reports. |
                            //--------------------------------------*/

                            /*----------------------------------------------------------------------\
                            | ECRC: En ésta sección se general la URL para  presentar  el  Reporte  |
                            |       para que posteriormente se presente una Ventana con el Reporte  |
                            |       ya generado.                                                    |
                            |       Los parámetros que se envían al Jasper Server son:              |
                            |       idSesion y datosJson (Con el ID Sesión y el ID Trans).          |
                            \----------------------------------------------------------------------*/

                            var urlJasper = creaUrlJasper(p_paramsSuccess);
                            funcionSuccess = p_fncSuccess + "('" + urlJasper + "',p_paramsSuccess)";  

                            try{
                                eval(funcionSuccess);
                            } catch(error){
                                console.error('Error en la Funcion: ' + funcionSuccess);
                                console.error(error.message);
                                console.error('Verifique la Sintaxis de la Funcion.');
                            }                            
                            break;
                        default:
                            if(p_paramsSuccess === "" || p_paramsSuccess === undefined){
                                funcionSuccess = p_fncSuccess + "(p_datosJsonFormulario,datosJson)";
                            }                        
                            else{
                                var strParametros = String(p_paramsSuccess);
                                var arrayParametros = strParametros.split(",");

                                if(arrayParametros.length > 1){
                                    funcionSuccess = p_fncSuccess + "(";

                                    for(var iCiclo=0;iCiclo<=arrayParametros.length;iCiclo++){

                                        if(arrayParametros[iCiclo] !== undefined){
                                            funcionSuccess += arrayParametros[iCiclo];
                                            if(iCiclo != (arrayParametros.length - 1)  ){
                                                funcionSuccess += ",";
                                            }
                                        }
                                    }   
                                    funcionSuccess += ")";
                                }
                                else{
                                    funcionSuccess = p_fncSuccess + "(p_paramsSuccess)";
                                }
                            }

                            try{
                                if(String(p_fncSuccess).indexOf('function') != -1){
                                    funcionSuccess = p_fncSuccess;
                                    funcionSuccess();
                                }else{
                                    eval(funcionSuccess);
                                }

                            } catch(error){
                                console.error('Error en la Funcion: ' + funcionSuccess);
                                console.error(error.message);
                                console.error('Verifique la Sintaxis de la Funcion.');
                            }
                            break;
                    } //p_fncSuccess

                    /*****************/

                    /***********************/

                }
            }
            else{
                if(datosJson !== undefined){
                    /*------------------------------------------------------------------\
                    | ECRC: Errores de Lógica de Negocio encontrados en la ejecución	|
                    |       de los Procedimientos Backend.								|
                    \------------------------------------------------------------------*/
                    numRegistros = Object.keys(datosJson.ttInformacion).length; //Object.keys(datosJson.ttInformacion).length;

                    console.error('numRegistros:' + numRegistros);
                    console.error(datosJson);

                    for(let iCicloInformacion=0; iCicloInformacion < numRegistros; iCicloInformacion++){
                        if(datosJson.ttInformacion[iCicloInformacion] !== null){

                            let ttInformacion = datosJson.ttInformacion[iCicloInformacion];
                            console.info('ttInformacion');
                            console.info(ttInformacion);

                            if(ttInformacion.tipo == 'ERROR'){
                                mensajeError = '<font color=darkred size=2px><b>' + ttInformacion.codInformacion + ' - ';
                                mensajeError += ttInformacion.descInformacion + '</b></br>';
                                mensajeError += '<i>' + ttInformacion.adicional + '</i></font></br>';
                            }
                        }
                    }                        
                }

                if(muestraMensaje === true){
                    cajaEspera.hide();
                }

                if(p_modoDebug){
                    Ext.Msg.show({
                        title      : 'Error en API Backend',
                        msg        : mensajeError,
                        width      : 500,
                        buttons    : Ext.MessageBox.OK,
                        icon       : Ext.MessageBox.ERROR
                    });
                }



                if(p_paramsFailure === "" || p_paramsFailure === undefined){
                    p_paramsFailure = datosJson;
                    funcionFailure = p_fncFailure + "(p_datosJsonFormulario,p_paramsFailure)";
                }
                else{

                    funcionFailure = p_fncFailure + "(p_paramsFailure,p_datosJsonFormulario)";                    
                }



                if(p_fncFailure !== undefined){
                    if(String(p_fncFailure).indexOf('function') != -1){
                        funcionFailure = p_fncFailure;
                        funcionFailure();
                    }
                    else{
                        console.warn('Funcion de error: ' + p_fncFailure + ' > ' + funcionFailure);
                        console.warn('Ejecutando la Funcion: ' + funcionFailure);
                        eval(funcionFailure);   
                    }
                }
            }
        },
        failure: function(response,opts){
            /* ECRC: Función cuando hay Error en la Ejecución en el Servidor */
            console.error('Servidor Fallo con el Estado: ' + response.status);

            if(muestraMensaje === true){
                cajaEspera.hide();
            }
        },
        callback: function(success,data,response){
            var respuestaServidor = JSON.parse(response.responseText);
            
            if(respuestaServidor.success === false){
                console.warn('ADVERTENCIA: Fallo la Ejecución de la API en el Servidor');
                muestraErrorServer(respuestaServidor);
            }
            
            var funcionCallback;
            if(success && p_fncCallback !== undefined){
                if(p_paramsCallback !== undefined || p_paramsCallback != ''){
                    funcionCallback = p_fncCallback + '(p_paramsCallback)';
                }
                else{
                    funcionCallback = p_fncCallback + '()';
                }

                try{
                    if(String(p_fncCallback).indexOf('function') != -1){
                        funcionCallback = p_fncCallback;
                        funcionCallback();
                    }else{
                        eval(funcionCallback);                        
                    }                    

                }catch(error){
                    console.error('Error en la Funcion Callback');
                    console.error(error.message);
                    console.error('Verifique la Sintaxis de la Funcion');
                }
            } 
        },
        params: p_datosJsonFormulario
    }); 
}


function EncodeUtf8 (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
}

function DecodeUtf8(utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}

function valorCampo(p_idStorage,p_nombreTabla,p_campoExtrae,p_tipo){
    var valRetorno;

    datosJson = Ext.decode(recuperaDatosOpenLink(p_idStorage));
    valRetorno = datosJson[p_nombreTabla][0][p_campoExtrae];

    if(valRetorno === undefined){
        console.error('configOpenLink.js::valorCampo=>Campo no existe=>',p_nombreTabla,'.',p_campoExtrae);
        return;
    }

    if(p_tipo === 'NUM' && valRetorno !== undefined){
        console.info('valorCampo=>',p_idStorage,'->',p_nombreTabla,'.',p_campoExtrae);
        valRetorno = valRetorno.replace(',','');
    }

    return valRetorno;
}

function resultadoOpenLink(p_idStore){
    var valRetorno;

    datosJson = Ext.decode(recuperaDatosOpenLink(p_idStore));

    return datosJson;

}

function generaParamsProxy(p_codPrograma, p_codProcedimiento, p_datosJson){
    var objExtraParams = {
        codPrograma      : p_codPrograma,
        codProcedimiento : p_codProcedimiento,
        usuarioActivo    : recuperaDatoSesion('clavePersona'),
        datosJson        : p_datosJson,
        proxyRest        : 'true',
        codEmpresa       : recuperaDatoSesion("codEmpresa"),
        codSistema       : recuperaDatoSesion("codSistema"),
        openLinkServidor : recuperaDatoSesion('servidor'),
        openLinkServicio : recuperaDatoSesion('servicio'),
        openLinkPrograma : recuperaDatoSesion('programa'),
        versionOpenLink  : recuperaDatoSesion('versionOpenLink')

    };

    return objExtraParams;
}