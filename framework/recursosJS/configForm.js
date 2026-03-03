/*----------------------------------------------------------------------------------------------------------------------------------\
| CORPORATIVO COPAMEX SA DE CV             |                              COORDINACION DE SISTEMAS                                  |
|-----------------------------------------------------------------------------------------------------------------------------------|
| Programa: copamex\framework\recursosJS\configForm.js                                                                              |
| Objetivo: Configuraciones y Funciones facilitadoras para el Desarrollo de Aplicaciones Web.                                       |
|    Autor: Erick Christian Rosales Cruz (ECRC)                                                                                     |        
|    Fecha: Septiembre del 2014                                                                                                     |
|  Sistema: Framework Desarrollo Web Copamex                                                                                        |
|-----------------------------------------------------------------------------------------------------------------------------------|
|                                     H I S T O R I A L   D E   M O D I F I C A C I O N E S                                         |
|-----------------------------------------------------------------------------------------------------------------------------------|
| RESPONSABLE              |  TAREA   |  FECHA       | DESCRIPCION                                                                  |
|-----------------------------------------------------------------------------------------------------------------------------------|
| Erick Rosales (ECRC)     |  000000  |  04/01/2019  | Actualización para la Creación de Mensajes.                                  |
\----------------------------------------------------------------------------------------------------------------------------------*/
function fechaInicialMes(pMes,pAnn){
    var fechaRetorno = new Date();
    var primerDia = new Date(pAnn,pMes,1);
    return primerDia;
}

function fechaFinalMes(pMes,pAnn){
    var fechaRetorno = new Date();
    var mesProceso   = pMes + 1;

    if(pMes === 13){
        pMes = 1;
        pAnn = pAnn + 1;
    }

    var ultimoDia = new Date(pAnn,pMes,0);
    return ultimoDia;
}

function fechaInicialMesActual(){
    var fechaActual = new Date();
    var primerDia = new Date(fechaActual.getFullYear(),fechaActual.getMonth(),1);
}

function fechaFinalMesActual(){
    var fechaActual = new Date();
    var mesProceso  = fechaActual.getMonth() + 1;
    var annProceso  = fechaActual.getFullYear();

    if(mesProceso === 13){
        mesProceso = 1;
        annProceso = annProceso + 1;
    }

    var primerDia = new Date(annProceso,mesProceso,0);
    return primerDia;
}

function mensajeProceso(pTitulo,pMensaje,pIcono){
    Ext.Msg.show({
        title     : pTitulo,
        msg       : pMensaje,
        width     : 350,
        closable  : false,
        icon      : pIcono,       
        buttons   : []
    });
}

function eliminarClaseEtiqueta(pIdEtiqueta,pClase){
    var etiqueta = Ext.getCmp(pIdEtiqueta);
    if(etiqueta !== undefined){
        etiqueta.removeCls(pClase);
    }
    else{
        console.error('eliminarClaseEtiqueta::No se localizó la Etiqueta ' + pIdEtiqueta);
    }
}


function actualizarClaseEtiqueta(pIdEtiqueta,pClaseActual,pClaseNueva){
    var etiqueta = Ext.getCmp(pIdEtiqueta);
    if(etiqueta !== undefined){
        etiqueta.removeCls(pClaseActual);
        etiqueta.addCls(pClaseNueva);
    }
    else{
        console.error('actualizarClaseEtiqueta::No se localizó la Etiqueta ' + pIdEtiqueta);
    }
}

function cambiaClaseEtiqueta(pIdEtiqueta,pClase){
    var etiqueta = Ext.getCmp(pIdEtiqueta);
    if(etiqueta !== undefined){
        var claseActual = etiqueta.cls;
        var nombreClase = Ext.getClass(etiqueta).superclass.self.getName()

        etiqueta.removeCls(claseActual);
        etiqueta.addCls(pClase);
    }
    else{
        console.error('cambiaClaseEtiqueta::No se localizó la Etiqueta ' + pIdEtiqueta);
    }
}

function estableceClaseEtiqueta(pIdEtiqueta,pClase){
    var etiqueta = Ext.getCmp(pIdEtiqueta);
    if(etiqueta !== undefined){
        etiqueta.addCls(pClase);
    }
    else{
        console.error('estableceClaseEtiqueta::No se localizó la Etiqueta ' + pIdEtiqueta);
    }
}

function creaMensajeApi(pTipoMensaje,pMensaje){

    var temp_mensaje_exec = new Array();
    var datosOpenLink = new Object();
    var objMensaje = new Object();

    objMensaje.tipomensaje = pTipoMensaje;
    objMensaje.contenido   = pMensaje;
}

function mensajesApi(pObjMensajeExec){
    var numRegistros  = Object.keys(pObjMensajeExec).length;
    var infoMensaje   = '';
    var mensajeActivo = false;
    var aMensaje      = new Array();

    //ECRC: Extrayendo los Mensajes de la API
    for(var iCiclo=0; iCiclo < numRegistros; iCiclo++){
        if(pObjMensajeExec[iCiclo] !== null){

            temp_mensaje_exec = pObjMensajeExec[iCiclo];

            if(temp_mensaje_exec.tipomensaje !== undefined &&
               (temp_mensaje_exec.tipomensaje == 'INFO-DATASUL' || temp_mensaje_exec.tipomensaje == 'ERROR-DATASUL')){
                if(aMensaje.indexOf(temp_mensaje_exec.contenido) < 0){
                    aMensaje.push(temp_mensaje_exec.contenido);
                }
            }
        }
    }    

    //ECRC: Preparando la Cadena de Mensaje
    for(var iCiclo=0; iCiclo < aMensaje.length; iCiclo++){
        infoMensaje = infoMensaje + aMensaje[iCiclo] + '<br>';
    }

    return infoMensaje;
}

function formateaEntero(pValor){
    return Ext.util.Format.number(pValor,'0,000/i');
}

function formateaNumero(pValor){
    return Ext.util.Format.number(pValor,'0,000.00/i');
}

function formateaDecimal(pValor){
    var valorRecibido = Ext.util.Format.number(pValor,'0,000.0000/i');
    if(parseInt(pValor) < 0 ){
        valorRecibido = parseFloat(pValor) * -1;
        valorRecibido = '-' + Ext.util.Format.number(valorRecibido,'0,000.0000/i');
    }
    return valorRecibido;
}

function ajustaInterface(pContenedor,pElementoAjuste,pAlturaAjuste){
    Ext.getCmp(pContenedor).doLayout();
    var elementoAjuste = Ext.getCmp(pElementoAjuste);
    var alturaElemento = Ext.getBody().getViewSize().height - pAlturaAjuste;
    Ext.getCmp(pElementoAjuste).setHeight(alturaElemento);
    Ext.getCmp(pContenedor).doLayout();

}

function limpiarPanel(pIdPanel){
    var panelItems = Ext.getCmp(pIdPanel);

    if(pIdPanel !== undefined){
        var itemExiste = true;
        while(itemExiste){
            itemPanel = panelItems.items.first();
            if(itemPanel !== undefined){
                panelItems.remove(itemPanel, true);
            }
            else{
                itemExiste = false;
            }
        }

        Ext.getCmp(pIdPanel).doLayout();
    }
    else{
        console.warn('limpiarPanel - No se encontró el Panel ' + pIdPanel);
    }
}

function cerrarAplicacion(pNombreAplicacion){
    var idVentana = 'win' + pNombreAplicacion;

    var win = window.parent.Ext.getCmp(idVentana);

    if(win === undefined){
        var win = window.parent.Ext.getCmp(pNombreAplicacion);
    }

    if(win)win[win.closeAction]();
}

function muestraVentana(pVentana){
    var idVentana = 'widget.' + pVentana;
    var winVentana = Ext.create(idVentana);
    winVentana.show();
}

function abrirVentana(pVentana){
    var idVentana = 'widget.' + pVentana;
    var winVentana = Ext.create(idVentana);
    winVentana.show();
}

function cerrarVentana(pVentana){
    var winVentana = Ext.getCmp(pVentana);

    if(winVentana !== undefined){
        winVentana.close();
    }
    else{
        console.warn('configForm::No existe la Ventana ' + pVentana);
    }
}

function refrescaGrid(pIdGrid,pIndCleanGrid){
    var gridObject  = Ext.getCmp(pIdGrid);
    var idStoreGrid = pIdGrid.replace('grid','store');
    var storeGrid   = Ext.getStore(idStoreGrid);

    if(storeGrid.consultaActiva !== undefined){
        if(storeGrid.consultaActiva){
            console.warn('refrescaGrid: Existe una Consulta Activa para el Objeto ' + pIdGrid);
            return;
        }

        storeGrid.idGrid = pIdGrid;
    }

    if(storeGrid !== undefined){
        if(pIndCleanGrid){
            storeGrid.loadData([],false);    
        }
        storeGrid.load();
    }
    else{
        console.warn('refrescaGrid: No se encontró el Store del Grid');
    }
}

function muestraAdvertenciaApi(p_datosOpenLink, p_campoFoco, p_funcionExtra, p_funcionCallback){
    if(p_datosOpenLink === undefined){
        console.error('muestraAdvertenciaApi: El Objeto de Datos no esta defindio');
        return;
    }

    console.log('muestraAdvertenciaApi');
    console.log(p_datosOpenLink);

    var numRegistros = Object.keys(p_datosOpenLink.temp_mensaje_exec).length;
    var infoApi = '';

    var aMensaje = new Array();
    numMensajes = 0;

    for(var iCiclo=0; iCiclo < numRegistros; iCiclo++){
        if(p_datosOpenLink.temp_mensaje_exec[iCiclo] !== null){

            temp_mensaje_exec = p_datosOpenLink.temp_mensaje_exec[iCiclo];

            if(temp_mensaje_exec.tipomensaje !== undefined &&
               (temp_mensaje_exec.tipomensaje == 'WARNING-DATASUL' || 
                temp_mensaje_exec.tipomensaje == 'WARNING-API'     ||
                temp_mensaje_exec.tipomensaje == 'WARNING')){
                if(aMensaje.indexOf(temp_mensaje_exec.contenido) < 0){
                    aMensaje.push(temp_mensaje_exec.contenido);
                }
            }
        }
    }

    for(var iCiclo=0; iCiclo < aMensaje.length; iCiclo++){
        numMensajes = numMensajes + 1;
        infoApi = infoApi + '<p>' + aMensaje[iCiclo] + '</p>';
    }

    var msgTipo      = 'ADVERTENCIA';
    var msgTitulo    = 'Advertencia API Backend';
    var msgContenido = infoApi;
    var msgFuncion   = function(){
        if(p_campoFoco !== undefined){
            enfocaElemento(p_campoFoco);
            }

        if(p_funcionExtra !== undefined){
            p_funcionExtra();
        }
    };

    if(altoMensaje < 200){
        altoMensaje = 230;
    }

    var altoMensaje = altoMensaje + (70 * numRegistros);

    var msgFormato = {};
    msgFormato.ancho = 700;
    msgFormato.alto  = altoMensaje;

    if(msgContenido !== ''){
        mensajeUsr(msgTipo,
                   msgTitulo,
                   msgContenido,
                   msgFuncion,
                   msgFormato
                  );
    }
    else{
        console.log('Deberia hacer');
        console.log(p_funcionCallback);
        if( p_funcionCallback !== undefined){
            console.log('funcion');

            if(String(p_funcionCallback).indexOf('function') != -1){
                p_funcionCallback();
            }
            else{
                eval(p_funcionCallback);
            }

        }

    }
}

function muestraInfoApi(p_datosOpenLink, p_campoFoco, p_funcionExtra, p_funcionCallback){
    if(p_datosOpenLink === undefined){
        console.error('muestraInfoApi: El Objeto de Datos no esta defindio');
        return;
    }

    var numRegistros = Object.keys(p_datosOpenLink.temp_mensaje_exec).length;
    var infoApi = '';

    var aMensaje = new Array();
    numMensajes = 0;

    for(var iCiclo=0; iCiclo < numRegistros; iCiclo++){
        if(p_datosOpenLink.temp_mensaje_exec[iCiclo] !== null){

            temp_mensaje_exec = p_datosOpenLink.temp_mensaje_exec[iCiclo];

            if(temp_mensaje_exec.tipomensaje !== undefined &&
               (temp_mensaje_exec.tipomensaje == 'INFO-DATASUL' || 
                temp_mensaje_exec.tipomensaje == 'INFO-API'     ||
                temp_mensaje_exec.tipomensaje == 'INFO')){
                if(aMensaje.indexOf(temp_mensaje_exec.contenido) < 0){
                    aMensaje.push(temp_mensaje_exec.contenido);
                }
            }
        }
    }

    for(var iCiclo=0; iCiclo < aMensaje.length; iCiclo++){
        numMensajes = numMensajes + 1;
        infoApi = infoApi + '<p>' + aMensaje[iCiclo] + '</p>';
    }

    var msgTipo      = 'INFO';
    var msgTitulo    = 'Información API Backend';
    var msgContenido = infoApi;
    var msgFuncion   = function(){
        if(p_campoFoco !== undefined){
            enfocaElemento(p_campoFoco);
            }

        if(p_funcionExtra !== undefined){
            p_funcionExtra();
        }
    };

    if(altoMensaje < 200){
        altoMensaje = 200;
    }

    var altoMensaje = altoMensaje + (70 * numRegistros);

    var msgFormato = {};
    msgFormato.ancho = 600;
    msgFormato.alto  = altoMensaje;

    if(msgContenido !== ''){
        mensajeUsr(msgTipo,
                   msgTitulo,
                   msgContenido,
                   msgFuncion,
                   msgFormato
                  );
    }
    else{
        console.log('Deberia hacer');
        console.log(p_funcionCallback);
        if( p_funcionCallback !== undefined){
            console.log('funcion');

            if(String(p_funcionCallback).indexOf('function') != -1){
                p_funcionCallback();
            }
            else{
                eval(p_funcionCallback);
            }

        }

    }
}

function muestraErrorApi(p_datosOpenLink, p_campoFoco, p_funcionExtra){
    if(p_datosOpenLink === undefined){
        console.error('muestraErrorApi: No se recibió el Objeto con los Datos o no esta definido');
        return;
    }


    try{
        var numRegistros = Object.keys(p_datosOpenLink.temp_mensaje_exec).length;
    }catch(error){
        console.error('muestraErrorApi: No hay mensajes de error para desplegar');
        return;
    }

    var errorApi     = '';
    var numMensajes  = 0;
    var arrayMensaje = new Array();

    var aMensaje = new Array();
    numMensajes  = 0;

    for(var iCiclo=0; iCiclo < numRegistros; iCiclo++){
        if(p_datosOpenLink.temp_mensaje_exec[iCiclo] !== null){

            temp_mensaje_exec = p_datosOpenLink.temp_mensaje_exec[iCiclo];

            if(temp_mensaje_exec.tipomensaje !== undefined &&
               (temp_mensaje_exec.tipomensaje == 'ERROR-DATASUL' || 
                temp_mensaje_exec.tipomensaje == 'ERROR'         || 
                temp_mensaje_exec.tipomensaje == 'ERROR-API'     || 
                temp_mensaje_exec.tipomensaje == '_Error AppServer')){
                if(aMensaje.indexOf(temp_mensaje_exec.contenido) < 0){
                    aMensaje.push(temp_mensaje_exec.contenido);
                }
            }
        }
    }

    for(var iCiclo=0; iCiclo < aMensaje.length; iCiclo++){
        numMensajes = numMensajes + 1;
        errorApi = errorApi + '<p>' + aMensaje[iCiclo] + '</p>';
    }

    console.warn('p_campoFoco: ' + p_campoFoco);

    var msgTipo      = 'ERROR';
    var msgTitulo    = 'Error API (Backend)';
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
    msgFormato.ancho = 500;

    if(msgFormato.alto < 120){
        msgFormato.alto = 120;
    }

    msgFormato.alto  = msgFormato.alto + (60 * numMensajes);

    mensajeUsr(msgTipo,
               msgTitulo,
               msgContenido,
               msgFuncion,
               msgFormato
              );
}

function toCamelCase(s) {
    // remove all characters that should not be in a variable name
    // as well underscores an numbers from the beginning of the string
    s = s.replace(/([^a-zA-Z0-9_\- ])|^[_0-9]+/g, "").trim().toLowerCase();
    // uppercase letters preceeded by a hyphen or a space
    s = s.replace(/([ -]+)([a-zA-Z0-9])/g, function(a,b,c) {
        return c.toUpperCase();
    });
    // uppercase letters following numbers
    s = s.replace(/([0-9]+)([a-zA-Z])/g, function(a,b,c) {
        return b + c.toUpperCase();
    });
    return s;
}

function workingDaysBetweenDates(startDate, endDate, indSaturday) {
    var numDays = 0;
    for(var loopDate = startDate; loopDate <= endDate; loopDate.setDate(loopDate.getDate() + 1)){
        console.log(loopDate);

        if(loopDate.getDay() === 0){
            /* Domingo */
            continue;
        }

        if(indSaturday  === false){
            if(loopDate.getDay() === 6){
                /* Sabado */
                continue;
            }

        }

        numDays = numDays + 1;
    }

    return numDays;
}


function stringToDate(_date,_format,_delimiter)
{
    var formatLowerCase=_format.toLowerCase();
    var formatItems=formatLowerCase.split(_delimiter);
    var dateItems=_date.split(_delimiter);
    var monthIndex=formatItems.indexOf("mm");
    var dayIndex=formatItems.indexOf("dd");
    var yearIndex=formatItems.indexOf("yyyy");
    var month=parseInt(dateItems[monthIndex]);
    month-=1;
    var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    return formatedDate;
}

function cambiaFavicon(src) {
    var link = document.createElement('link'),
        oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'icon';
    link.href = src;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
}

function codificaOpenLink(p_objJson){
    var cadenaObjeto = Ext.encode(p_objJson);
    
    cadenaObjeto = '#ini#' + cadenaObjeto + '#fin#';

    if(cadenaObjeto.indexOf('"')){
        cadenaObjeto = cadenaObjeto.split('"').join('&#34;');
    }

    if(cadenaObjeto.indexOf(':')){
        cadenaObjeto = cadenaObjeto.split(':').join('&#58;');
    }
    if(cadenaObjeto.indexOf('{')){
        cadenaObjeto = cadenaObjeto.split('{').join('&#123;');
    }

    if(cadenaObjeto.indexOf('}')){
        cadenaObjeto = cadenaObjeto.split('}').join('&#125;');
    }

    if(cadenaObjeto.indexOf('/')){
        cadenaObjeto = cadenaObjeto.split('/').join('&#47;');
    }

    return cadenaObjeto;
}

function decodificaOpenLink(p_cadenaObjeto){
    var objJson = p_cadenaObjeto;

    if(objJson.indexOf('&#34;')){
        objJson = objJson.split('&#34;').join('"');
    }

    if(objJson.indexOf('&#58;')){
        objJson = objJson.split('&#58;').join(':');
    }

    if(objJson.indexOf('&#123;')){
        objJson = objJson.split('&#123;').join('{');
    }

    if(objJson.indexOf('&#125;')){
        objJson = objJson.split('&#125;').join('}');
    }

    if(objJson.indexOf('&#47;')){
        objJson = objJson.split('&#47;').join('/');
    }

    if(objJson.indexOf('#ini#')){
        objJson = objJson.split('#ini#').join('');
    }

    objJson = objJson.replace('#ini#','');

    if(objJson.indexOf('#fin#')){
        objJson = objJson.split('#fin#').join('');
    }

    if(objJson !== ''){
        objJson = Ext.decode(objJson);
    }

    return objJson;
}

function convierteAscci(p_valor){
    var caracteresAscci = true;

    while(caracteresAscci){
        caracteresAscci = false;
        if(p_valor.indexOf('&#193;') > -1){
            p_valor = p_valor.replace('&#193;','Á');
            caracteresAscci = true;
        }

        if(p_valor.indexOf('&#225;') > -1){
            p_valor = p_valor.replace('&#225;','á');
            caracteresAscci = true;
        }


        if(p_valor.indexOf('&#201;') > -1){
            p_valor = p_valor.replace('&#201;','É');
            caracteresAscci = true;
        }

        if(p_valor.indexOf('&#233;') > -1){
            p_valor = p_valor.replace('&#233;','é');
            caracteresAscci = true;
        }

        if(p_valor.indexOf('&#205;') > -1){
            p_valor = p_valor.replace('&#205;','Í');
            caracteresAscci = true;
        }

        if(p_valor.indexOf('&#237;') > -1){
            p_valor = p_valor.replace('&#237;','í');
            caracteresAscci = true;
        }

        if(p_valor.indexOf('&#211;') > -1){
            p_valor = p_valor.replace('&#211;','Ó');
            caracteresAscci = true;
        }

        if(p_valor.indexOf('&#243;') > -1){
            p_valor = p_valor.replace('&#243;','ó');
            caracteresAscci = true;
        }

        if(p_valor.indexOf('&#218;') > -1){
            p_valor = p_valor.replace('&#218;','Ú');
            caracteresAscci = true;
        }


        if(p_valor.indexOf('&#250;') > -1){
            p_valor = p_valor.replace('&#250;','ú');
            caracteresAscci = true;
        }


        if(p_valor.indexOf('&#209;') > -1){
            p_valor = p_valor.replace('&#209;','Ñ');
            caracteresAscci = true;
        }

        if(p_valor.indexOf('&#241;') > -1){
            p_valor = p_valor.replace('&#241;','ñ');
            caracteresAscci = true;
        }
    }
    return p_valor;
}

function ocultarElemento(p_IdElemento){
    var elemento = Ext.getCmp(p_IdElemento);
    if(elemento !== undefined){
        elemento.setVisible(false);
    }
    else{
        console.error('ocultarElemento - No se encontro el elemento ' + p_IdElemento);
    }
}

function mostrarElemento(p_IdElemento){
    var elemento = Ext.getCmp(p_IdElemento);
    if(elemento !== undefined){
        elemento.setVisible(true);
    }
    else{
        console.error('mostrarElemento - No se encontro el elemento ' + p_IdElemento);
    }
}


/*------------------------------------------------------------------------------\
| ECRC: Funcion para tomar el Valor de una Columna de una Fila Seleccionada.	|
\------------------------------------------------------------------------------*/
function valorGridColumna(p_IdGrid,p_columna){
    var gridProto       = Ext.getCmp(p_IdGrid);
    var selectionModel  = gridProto.getSelectionModel();
    var selectionCount = selectionModel.getCount();

    if(selectionCount === 0){
        selectionModel.select(0);
    }

    var selectedRecords = selectionModel.getSelection();
    var valorRetorno    = selectedRecords[0].get(p_columna);

    return valorRetorno;
}

/*----------------------------------------------------------\
| ECRC: Funcion para Totalizar Valores de Columnas de Grid.	|
\----------------------------------------------------------*/
function valTotalColumna(p_datos){
    var valorColumna  = p_datos;
    var resultado     = '';
    var valorDato     = '';
    var valResultado  = 0;
    var insertaLimite = 0;
    var aDatos;

    resultado = '';

    for(var iCiclo=0; iCiclo<=valorColumna.length; iCiclo++){
        if(valorColumna.substr(iCiclo,1) != ' '){
            resultado = resultado + valorColumna.substr(iCiclo,1);
            insertaLimite = 0;
        }

        if(valorColumna.substr(iCiclo,1) == ' ' && insertaLimite === 0){
            resultado = resultado + '|';
            insertaLimite = 1;
        }
    }

    aDatos = resultado.split('|');

    for(var iCiclo=0; iCiclo<= aDatos.length; iCiclo++){
        valorDato = aDatos[iCiclo];

        if(valorDato !== undefined){
            valorDato = valorDato.replace(',','');
            valResultado += parseFloat(valorDato);
        } //Diferente de undefined

    }

    resultado = '<b><font color=red>' + Ext.util.Format.number(valResultado, '0,000.00') + '</font></b>';

    return resultado;
}

function asignaDatosComboBox(p_idComboBox,
                              p_datosJson,
                              p_nombreTabla,
                              p_elementoClave,
                              p_elementoDescripcion,
                              p_valorDefault,
                              p_filtrarPor,
                              p_objConfig
                             ){

    var nombreEntidad;
    var nombreStore;
    var storeCombo;
    var datosJson;
    var valCampoClave;
    var valCampoDesc;
    var datosComboBox;
    var numRegistros;
    var primerValor;
    var comboEstandar;

    p_elementoClave       = p_elementoClave.toLowerCase();
    p_elementoDescripcion = p_elementoDescripcion.toLowerCase();

    datosJson     = p_datosJson;
    nombreEntidad = p_idComboBox.substring(3,p_idComboBox.length);
    nombreStore   = 'store' + nombreEntidad;
    storeCombo    = Ext.getStore(nombreStore);

    if(storeCombo === undefined){
        nombreEntidad = p_idComboBox.substring(4,p_idComboBox.length);
        nombreStore   = 'store' + nombreEntidad;
        storeCombo    = Ext.getStore(nombreStore);
    }

    if(storeCombo === undefined){
        nombreEntidad = p_idComboBox.substring(4,p_idComboBox.length);
        nombreStore   = 'store' + nombreEntidad.toLowerCase();
        storeCombo    = Ext.getStore(nombreStore);
    }

    if(storeCombo === undefined){
        console.error('asignaDatosComboBox::No se encontró el Store: ' + nombreStore);
    }

    valCampoClave = '';
    valCampoDesc  = '';
    datosComboBox = new Array();
    comboEstandar = Ext.getCmp(p_idComboBox);

    if(comboEstandar === undefined){
        comboEstandar = window.parent.Ext.getCmp(p_idComboBox);
    }

    if(comboEstandar === undefined){
        console.error('asignaDatosComboBox::No se encontró el ComboBox: ' + p_idComboBox);
    }


    numRegistros = Object.keys(datosJson[p_nombreTabla]).length;

    primerValor  = '';
    for(var iCiclo=0; iCiclo <= numRegistros; iCiclo++){

        if(datosJson[p_nombreTabla][iCiclo] !== null && datosJson[p_nombreTabla][iCiclo] !== undefined){

            if(primerValor === ''){
                primerValor = datosJson[p_nombreTabla][iCiclo][p_elementoClave];
            }

            valCampoClave = datosJson[p_nombreTabla][iCiclo][p_elementoClave];
            valCampoDesc  = datosJson[p_nombreTabla][iCiclo][p_elementoDescripcion];
            valCampoDesc  = convierteAscci(valCampoDesc);

            if(valCampoClave.trim() !== '' && valCampoDesc.trim() !== ''){
                datosComboBox[iCiclo] = [valCampoClave,valCampoDesc];
            }
        }
    }

    /* ECRC: Cargando la informacion en el ComboBox */
    storeCombo.loadData(datosComboBox, false);

    /* ECRC: Implementando el valor por defecto     */
    if(p_valorDefault !== '' && p_valorDefault !== undefined){
        comboEstandar.setValue(p_valorDefault);
    }

    if(p_valorDefault === undefined){
        comboEstandar.reset();
        comboEstandar.setValue(primerValor);
    }

    if(p_valorDefault === ''){
        comboEstandar.setValue(primerValor);

    }

    if(p_objConfig !== undefined){
        if(String(p_objConfig.funcion).indexOf('function') != -1){
            p_objConfig.funcion();
        }
        else{
            eval(p_objConfig.funcion);
        }

    }
}

/*----------------------------------------------\
| ECRC: Funciones de Manipulación de ComboBox.	|
\----------------------------------------------*/
function cargaComboBox(p_idComboBox,
                        p_codPrograma,
                        p_codProcedimiento,
                        p_nombreTabla,
                        p_elementoClave,
                        p_elementoDescripcion,
                        p_valorDefault,
                        p_filtrarPor,
                        p_appServerDatos,
                        p_modoDebug,
                        p_funcionExito,
                        p_funcionFallo){

    var nombreEntidad;
    var nombreStore;
    var storeCombo;
    var strJson;
    var datosJsonFormulario;
    var comboEstandar;
    var mensajeError;
    var codEmpresa = recuperaDatoSesion();
    var codSistema = '';

    codEmpresa = recuperaDatoSesion("codEmpresa");
    codSistema = recuperaDatoSesion("codSistema");
    nombreEntidad = p_idComboBox.substring(3,p_idComboBox.length);
    nombreStore   = 'store' + nombreEntidad;
    storeCombo    = Ext.getStore(nombreStore);

    if(storeCombo === undefined){
        nombreEntidad = p_idComboBox.substring(4,p_idComboBox.length);
        nombreStore   = 'store' + nombreEntidad;
        storeCombo    = Ext.getStore(nombreStore);
    }
    if(storeCombo === undefined){
        nombreEntidad = p_idComboBox.substring(4,p_idComboBox.length);
        nombreStore   = 'store' + nombreEntidad.toLowerCase();
        storeCombo    = Ext.getStore(nombreStore);
    }

    if(storeCombo === undefined){
        console.error('No se encontró el Store: ' + nombreStore);
    }

    arrayInformacion    = new Array();
    arrayInformacion[0] = new Object();
    arrayInformacion[0].p_filtrarPor = p_filtrarPor;

    /*------------------------------------------\
    | ECRC: Implementando llamadas AppServer.	|
    \------------------------------------------*/
    if((typeof p_appServerDatos != 'undefined') && p_appServerDatos !== null){
        if(p_appServerDatos.p_AppServerApi !== null &&
           p_appServerDatos.p_AppServerApi !== undefined){

            arrayInformacion[0].p_idSesion           = p_appServerDatos.p_idSesion;
            arrayInformacion[0].p_clavePersona       = p_appServerDatos.p_clavePersona;
            arrayInformacion[0].p_codEmpresaSel      = p_appServerDatos.p_codEmpresaSel;
            arrayInformacion[0].p_codSucursalSel     = p_appServerDatos.p_codSucursalSel;
            arrayInformacion[0].p_codSistema         = p_appServerDatos.p_codSistema;
            arrayInformacion[0].p_AppServerApi       = p_appServerDatos.p_AppServerApi;
            arrayInformacion[0].p_AppServerProcedure = p_appServerDatos.p_AppServerProcedure;
        }
        else{
            console.warning('No se informó los datos de Ejecución de AppServer');
        }
    }

    strJson = JSON.stringify(arrayInformacion);

    var servidorOpenLink;
    var servicioOpenLink;
    var programaOpenLink;

    if (typeof datosOpenLink == 'function'){
        servidorOpenLink = datosOpenLink('servidor');
        servicioOpenLink = datosOpenLink('servicio');
        programaOpenLink = datosOpenLink('programa');
    }
    else{
        var objAmbienteOpenLink = Ext.decode(recuperaDatosOpenLink('ambienteOpenLink'));
        servidorOpenLink = objAmbienteOpenLink.servidor;
        servicioOpenLink = objAmbienteOpenLink.servicio;
        programaOpenLink = objAmbienteOpenLink.programa;
    }

    datosJsonFormulario = {codPrograma      : p_codPrograma,
                           codProcedimiento : p_codProcedimiento,
                           tipoLlamada      : "combobox",
                           usuarioActivo    : "",
                           datosJson        : strJson,
                           codEmpresa       : codEmpresa,
                           codSistema       : codSistema,
                           versionOpenLink  : recuperaDatoSesion('versionOpenLink'),
                           openLinkServidor : servidorOpenLink,
                           openLinkServicio : servicioOpenLink,
                           openLinkPrograma : programaOpenLink
                          };
    comboEstandar = Ext.getCmp(p_idComboBox);

    if(comboEstandar === undefined){
        comboEstandar = window.parent.Ext.getCmp(p_idComboBox);
    }

    if(comboEstandar === undefined){
        console.error('No se encontró el ComboBox: ' + p_idComboBox);
    }

    var cajaEspera = Ext.MessageBox.show({
        msg: 'Espere, solicitando datos (ComboBox)...',
        progressText: 'Procesando',
        width:300,
        wait:true,
        waitConfig: {interval:200}
    });

    Ext.Ajax.request({
        url: obtieneUrlOpenLink('Json'),
        method: 'POST',
        success: function(response,opts){

            var datosJson;
            var valCampoClave;
            var valCampoDesc;
            var datosComboBox;
            var numRegistros;
            var primerValor;
            var existeValorDefault = false;

            /* ECRC: Función cuando se ejecuta correctamente el Script en el Servidor */
            datosJson = Ext.decode(response.responseText);

            if(datosJson.success === true ){
                /* ECRC: API ejecutada correctamente y sin Errores */

                valCampoClave = '';
                valCampoDesc  = '';
                datosComboBox = new Array();

                numRegistros = Object.keys(datosJson[p_nombreTabla]).length;
                primerValor  = '';
                for(var iCiclo=0; iCiclo < numRegistros; iCiclo++){
                    if(datosJson[p_nombreTabla][iCiclo] !== null){

                        if(primerValor === ''){
                            primerValor = datosJson[p_nombreTabla][iCiclo][p_elementoClave];
                        }

                        valCampoClave = datosJson[p_nombreTabla][iCiclo][p_elementoClave];
                        valCampoDesc  = datosJson[p_nombreTabla][iCiclo][p_elementoDescripcion];
                        valCampoDesc  = convierteAscci(valCampoDesc);

                        datosComboBox[iCiclo] = [valCampoClave,valCampoDesc];

                        /* Validando si el Valor Default Existe */
                        if(valCampoClave == p_valorDefault){
                            existeValorDefault = true;
                        }
                    }
                }

                /* ECRC: Cargando la informacion en el ComboBox */
                storeCombo.loadData(datosComboBox, false);

                /* ECRC: Implementando el valor por defecto     */
                if(p_valorDefault !== ''){
                    comboEstandar.setValue(p_valorDefault);
                }

                if(p_valorDefault === undefined || p_valorDefault === ''){
                    comboEstandar.setValue(primerValor);
                }

                if(existeValorDefault === false){
                    comboEstandar.setValue(primerValor);
                }

                cajaEspera.hide();

                if(p_funcionExito !== null &&p_funcionExito !== undefined ){
                    try{
                        p_funcionExito();
                    } catch(error){
                        console.error('Error en la Funcion: ' + p_funcionExito);
                        console.error(error.message);
                        console.error('Verifique la Sintaxis de la Funcion.');
                    }
                }
                return 'OK';
            }
            else{
                /* ECRC: Errores encontrados en la API */

                numRegistros = Object.keys(datosJson.dsRetorno.ttInformacion).length;

                for(var iCiclo=0; iCiclo <= numRegistros; iCiclo++){
                    if(datosJson.dsRetorno.ttInformacion[iCiclo] != null){

                        if(datosJson.dsRetorno.ttInformacion[iCiclo].tipo == 'ERROR'){
                            mensajeError = '<font color=darkred size=2px><b>' + datosJson.dsRetorno.ttInformacion[iCiclo].codInformacion + ' - ';
                            mensajeError += datosJson.dsRetorno.ttInformacion[iCiclo].descInformacion + '</b></br>';
                            mensajeError += '<i>' + datosJson.dsRetorno.ttInformacion[iCiclo].adicional + '</i></font></br>';
                        }
                    }
                }

                cajaEspera.hide();

                if(p_funcionFallo !== null){
                    try{
                        p_funcionFallo();

                    } catch(error){
                        console.error('Error en la Funcion: ' + p_funcionFallo);
                        console.error(error.message);
                        console.error('Verifique la Sintaxis de la Funcion.');
                    }
                }

                if(p_modoDebug === true){
                    Ext.Msg.show({
                        title      : 'Error en API Backend',
                        msg        : mensajeError,
                        width      : 500,
                        buttons    : Ext.MessageBox.OK,
                        icon       : Ext.MessageBox.ERROR
                    });
                }

                /* ECRC: Cargando la informacion en el ComboBox */
                datosComboBox = '';
                storeCombo.loadData(datosComboBox, false);
                comboEstandar.setValue('');
                return 'NOK';
            }
        },
        failure: function(response,opts){
            /* ECRC: Función cuando hay Error en la Ejecución en el Servidor */
            console.error('Servidor falló con el Código ' + response.status);
            return 'ERROR';
        },
        params: datosJsonFormulario
    });
    return 'FINISH';
}


function asignaValorElemento(p_elemento,
                              p_valor,
                              p_tipo){


    p_valor = transformaValorHTML(p_valor);

    let valorElemento = p_valor;
    let elemento = Ext.getCmp(p_elemento);

    if(elemento === undefined){
        console.error('asignaValorElemento - No se encontró el Componente o Elemento: ' + p_elemento);
        return;
    }

    if(p_valor === 'NULL' ||
       p_valor === undefined ||
       p_valor === null){
        p_valor = '';
    }

    if(p_valor !== '' || p_valor !== null){
        if(elemento.xtype !== 'datefield'){
            if(p_valor !== undefined){

                p_valor = Ext.util.Format.htmlDecode(p_valor);
            }
        }
    }

    if(elemento !== undefined){
        switch(elemento.xtype){
            case 'combobox':
                elemento.setValue(p_valor);
                break;
            case 'textfield':
                elemento.setValue(p_valor);
                break;
            case 'tbtext':
                elemento.update(p_valor);
                break;
            case 'label':
                elemento.update(p_valor);
                break;
            case 'datefield':
                let elementoDate = Ext.getCmp(p_elemento);
                
                if(p_valor            !== 'NULL' &&
                   p_valor            !== ''     &&
                   p_valor            !== null   &&
                   p_valor            !== undefined){

                    if(typeof(p_valor) == 'object'){
                        elementoDate.setValue(p_valor);
                    }
                    else{
                        var valDia   = p_valor.substring(0,2);
                        var valMes   = p_valor.substring(3,5) - 1;
                        var valAnn   = p_valor.substring(6,10);
                        var valFecha = new Date(valAnn,valMes,valDia);
                        elementoDate.setValue(valFecha);
                    }
                }
                else{
                    elementoDate.setValue(null);
                }
                break;                
            case 'checkboxfield':
                if(typeof p_valor === 'string'){
                    if(p_valor === 'true' || p_valor === 'yes' || p_valor.toLowerCase() === 'si'){
                        elemento.checked = true;
                    }
                    else{
                        elemento.setValue(0);
                    }
                }
                break;
            default:
                elemento.setValue(p_valor);
        }

        if(isNaN(p_valor) === false){
            if(p_tipo == "INT"){
                Ext.getCmp(p_elemento).setValue(Ext.util.Format.number(p_valor, '0,000'));
            }

            if(p_tipo == "DEC"){
                Ext.getCmp(p_elemento).setValue(Ext.util.Format.number(p_valor, '0,000.00'));
            }

            if(p_tipo == "VAL"){
                Ext.getCmp(p_elemento).setValue(Ext.util.Format.number(p_valor, '0,000.00000'));
            }
        }
    }
    else{
        var mensaje = 'asignaValorElemento::No se encontro el Elemento con Id  o itemId en la Interfaz: ' + p_elemento;
        console.error(mensaje);
    }
}

function leeValorElemento(p_elemento,p_tipo){
    var valRetorno = "";
    var Elemento = Ext.getCmp(p_elemento);

    if(Elemento === undefined){
        console.error('leeValorElemento:: No se encontró el Elemento o Componente: ' + p_elemento);
        return;
    }

    var tipoElemento = Elemento.getXType();

    switch(tipoElemento){
        case 'datefield':
            valRetorno = Ext.getCmp(p_elemento).getSubmitValue();

            if(p_tipo === "FECHA"){
                console.info('valRetorno:' + valRetorno);

                var dia = valRetorno.substring(0,2);
                var mes = valRetorno.substring(3,5);
                var ann = valRetorno.substring(6,10);

                valRetorno = dia + "-" + mes + "-" + ann;
            }
            break;
        case 'timefield':
            valRetorno = Ext.getCmp(p_elemento).getValue();
            if(valRetorno !== undefined){
                valRetorno = Ext.Date.format(valRetorno, 'H:i');
                valRetorno = valRetorno.replace(':','|');
            }
            break;
        case 'radiogroup':
            var radioGroup = Ext.getCmp(p_elemento).getValue();
            valRetorno = radioGroup[p_elemento];
            break;
        case 'checkbox':
            valRetorno = Ext.getCmp(p_elemento).getValue().toString();
            break;
        case 'label':
            valRetorno = Ext.getCmp(p_elemento).fieldLabel;
            break;            
        default:
            valRetorno = Ext.getCmp(p_elemento).getValue();
    }

    if(p_tipo === "NUM" && valRetorno !== undefined){
        /* ECRC: Eliminando los Caracteres de formato numérico */
        valRetorno = valRetorno.replace("$","");
        valRetorno = valRetorno.split(",").join('');

        if(valRetorno === ''){
            valRetorno = 0;
        }
    }

    if(typeof valRetorno == 'string'){
        valRetorno = valRetorno.trim();
    }
    return valRetorno;
}


function textoBoton(p_idBoton,p_texto){
    Ext.getCmp(p_idBoton).setText(p_texto);
}

function habilitaElemento(p_elemento){
    var elemento = Ext.getCmp(p_elemento);
    if(elemento !== undefined){
        elemento.setDisabled(false);
    }
}

function deshabilitaElemento(p_elemento){
    var elemento = Ext.getCmp(p_elemento);
    if(elemento !== undefined){
        elemento.setDisabled(true);
    }
    else{
        console.error('deshabilitaElemento - No se encontró el Componente o Elemento: ' + p_elemento);
    }
}

function formatoEntero(componente){
    var newValue = componente.value;
    componente.setValue(Ext.util.Format.number(newValue.replace(/[,]/g, ''), '0,0'));
}

function formatoDecimal(componente){
    var newValue = componente.value;
    componente.setValue(Ext.util.Format.number(newValue.replace(/[,]/g, ''), '0,0.00'));
}

function formatoMoneda(componente){
    var newValue = componente.value;
    componente.setValue(Ext.util.Format.number(newValue.replace(/[,]/g, ''), '$0,0.00'));
}

function mensajeUsr(p_tipo,
                     p_titulo,
                     p_mensaje,
                     p_funcion,
                     p_formato,
                     p_funcionNegativa){

    var iconoMensaje;
    var botonMensaje;
    var botonTexto;
    var decodificaUtf8;
    var valorRetorno;

    valorRetorno = false;

    switch(p_tipo){
        case "INFO":
            iconoMensaje = Ext.MessageBox.INFO;
            botonMensaje = Ext.Msg.OK;
            break;
        case "PREGUNTA":
            iconoMensaje = Ext.MessageBox.QUESTION;
            botonMensaje = Ext.Msg.YESNO;
            botonTexto   = {
                yes: 'Confirmar',
                no: 'Cerrar'
            };
            break;
        case "ADVERTENCIA":
            iconoMensaje = Ext.MessageBox.WARNING;
            botonMensaje = Ext.Msg.OK;
            break;
        case "ERROR":
            iconoMensaje = Ext.MessageBox.ERROR;
            botonMensaje = Ext.Msg.OK;
            break;
    }

    if(p_mensaje.indexOf("á") > 0 ||
       p_mensaje.indexOf("é") > 0 ||
       p_mensaje.indexOf("í") > 0 ||
       p_mensaje.indexOf("ó") > 0 ||
       p_mensaje.indexOf("ú") > 0 ||
       p_mensaje.indexOf("ñ") > 0
      ){
        decodificaUtf8 = false;
    }
    else{
        decodificaUtf8 = true;
    }

    if(decodificaUtf8 === true){
        p_mensaje = DecodeUtf8(p_mensaje);
    }

    /*--------------------------------------\
    | ECRC: Formato especial del Mensaje.	|
    \--------------------------------------*/
    var anchoMensaje = 400;
    var altoMensaje  = 150;

    if(p_formato!== undefined && p_formato.ancho !== undefined){
        anchoMensaje = p_formato.ancho;
    }

    if(p_formato!== undefined && p_formato.alto !== undefined){
        altoMensaje = p_formato.alto;
    }

    Ext.Msg.show({
        title     : p_titulo,
        msg       : p_mensaje,
        closable  : false,
        icon      : iconoMensaje,
        buttons   : botonMensaje,
        buttonText: botonTexto,
        fn     : function(btn){
            if(btn=='yes' || btn=='ok'){
                if(p_funcion !== '' && p_funcion !== undefined){

                    valorRetorno = true;
                    if(String(p_funcion).indexOf('function') != -1){
                        p_funcion();
                    }
                    else{
                        eval(p_funcion);
                    }

                }
            }
            if(btn =='no'){
                if(String(p_funcionNegativa).indexOf('function') != -1){
                    p_funcionNegativa();
                }
                else{
                    eval(p_funcionNegativa);
                }
            }
        },
        width  : anchoMensaje,
        height : altoMensaje,
        opt : {
            scrollable: 'vertical',
        }
    });

    return valorRetorno;
}

function mensajeApp(p_tipo,
                     p_titulo,
                     p_mensaje,
                     p_funcion,
                     p_formato,
                     p_funcionNegativa){

    var iconoMensaje;
    var botonMensaje;
    var botonTexto;
    var decodificaUtf8;
    var valorRetorno;

    valorRetorno = false;

    console.warn('p_tipo: ' + p_tipo);

    switch(p_tipo){
        case 'INFO':
            iconoMensaje = Ext.MessageBox.INFO;
            botonMensaje = Ext.Msg.OK;
            break;
        case 'PREGUNTA':
            iconoMensaje = Ext.MessageBox.QUESTION;
            botonMensaje = Ext.Msg.YESNO;
            botonTexto   = {
                yes: 'Confirmar',
                no: 'Cerrar'
            };
            break;
        case 'ADVERTENCIA':
            iconoMensaje = Ext.MessageBox.WARNING;
            botonMensaje = Ext.Msg.OK;
            break;
        case 'ERROR':
            iconoMensaje = Ext.MessageBox.ERROR;
            botonMensaje = Ext.Msg.OK;
            break;
    }

    if(p_mensaje.indexOf("á") > 0 ||
       p_mensaje.indexOf("é") > 0 ||
       p_mensaje.indexOf("í") > 0 ||
       p_mensaje.indexOf("ó") > 0 ||
       p_mensaje.indexOf("ú") > 0 ||
       p_mensaje.indexOf("ñ") > 0
      ){
        decodificaUtf8 = false;
    }
    else{
        decodificaUtf8 = true;
    }

    if(decodificaUtf8 === true){
        p_mensaje = DecodeUtf8(p_mensaje);
    }

    /*--------------------------------------\
    | ECRC: Formato especial del Mensaje.   |
    \--------------------------------------*/
    var anchoMensaje = 200;
    var altoMensaje  = 150;

    if(p_formato!== undefined && p_formato.ancho !== undefined){
        anchoMensaje = p_formato.ancho;
    }

    if(p_formato!== undefined && p_formato.alto !== undefined){
        altoMensaje = p_formato.alto;
    }

    iconoMensaje = Ext.Msg.ERROR;
    botonMensaje = Ext.Msg.OK;

    console.warn('botonMensaje');
    console.warn(botonMensaje);
    console.warn(Ext.Msg.OKC);

    Ext.Msg.show({
        title     : p_titulo,
        message   : p_mensaje,
        //   buttons   : botonMensaje,
        closable  : false,
        //    icon      : iconoMensaje,
        width     : anchoMensaje,
        height    : altoMensaje


        /*
        ,
        fn     : function(btn){
            if(btn=='yes' || btn=='ok'){
                if(p_funcion !== '' && p_funcion !== undefined){

                    valorRetorno = true;
                    if(String(p_funcion).indexOf('function') != -1){
                        p_funcion();
                    }
                    else{
                        eval(p_funcion);
                    }

                }
            }
            if(btn =='no'){
                if(String(p_funcionNegativa).indexOf('function') != -1){
                    p_funcionNegativa();
                }
                else{
                    eval(p_funcionNegativa);
                }
            }
        },
        */
    });

    return valorRetorno;
}

function mensajeRetornoError(p_storage, p_tabla){
    var p_ok = valorCampo(p_storage,
                          p_tabla,
                          "p_ok");

    p_mensaje = valorCampo(p_storage,
                           p_tabla,
                           "p_mensaje");

    if(p_ok == "no"){
        mensajeUsr("ERROR",
                   "Solicitud de Prestamos",
                   p_mensaje);
    }
}

function habilitaCombosMaestros(){
    var codTipoPersona = recuperaDatoSesion("codTipoPersona");
    deshabilitaElemento('cbxUnidadNegocio');
    deshabilitaElemento('cbxSocios');

    if(parseInt(codTipoPersona) < 4 || parseInt(codTipoPersona) == 7){
        habilitaElemento('cbxUnidadNegocio');
        habilitaElemento('cbxSocios');
    }
    else{
        if(parseInt(codTipoPersona) == 5 || parseInt(codTipoPersona) == 6){
            deshabilitaElemento('cbxUnidadNegocio');
            habilitaElemento('cbxSocios');

        }
        else{
            deshabilitaElemento('cbxUnidadNegocio');
            deshabilitaElemento('cbxSocios');

        }
    }
}

function recuperaRegistroComboBox(p_LocalStorage,p_nombreTabla,p_CampoClave,p_Clave){
    var objRetorno;

    datosJson = Ext.decode(recuperaDatosOpenLink(p_LocalStorage));

    var numRegistros = Object.keys(datosJson[p_nombreTabla]).length;

    for(var iCiclo=0; iCiclo < numRegistros; iCiclo++){
        var objRegistro = datosJson[p_nombreTabla][iCiclo];

        if(objRegistro !== undefined){
            valCampoClave = objRegistro[p_CampoClave];

            if(valCampoClave == p_Clave){
                objRetorno = datosJson[p_nombreTabla][iCiclo];
            }
        }
    }

    if(objRetorno === undefined){
        console.error('ERROR::recuperaRegistroComboBox:No se encontró un Registro Valido con Clave ' + p_Clave);
    }
    return objRetorno;
}

function enfocaElemento(p_elemento){
    var elemento = Ext.getCmp(p_elemento);
    if(elemento === undefined){
        console.error('ERROR:enfocaElemento - No se encontró el Elemento o Componente: ' + p_elemento);
        return;
    }

    elemento.focus(false,200);
}

function leeValorCombobox(p_idComboBox){
    var comboBox = Ext.getCmp(p_idComboBox);
    return comboBox.getRawValue();
}

function botonOperacionFrecuente(p_objBoton,p_accion){
    switch(p_accion){
        case 'crear':
            p_objBoton.setText('Quitar de</br>Op. Frecuente');
            p_objBoton.setIconCls('paperclip32');
            break;
        case 'eliminar':
            p_objBoton.setText('Operación</br>Frecuente');
            p_objBoton.setIconCls('attachment32');
            break;
        case 'establecida':
            p_objBoton.setText('Operación</br>Estándar');
            p_objBoton.setIconCls('locked32');
            p_objBoton.establecida = true;
            p_objBoton.setDisabled();
            break;
    }
}

function generaBotonesMenu(p_elementoPadre){
    console.info('generaBotonesMenu::Paso Start 1');
    var preferenciasPersona = recuperaDatosOpenLink('preferenciasPersona');

    console.info('preferenciasPersona');
    console.info(preferenciasPersona);

    if(operacionFrecuente !== undefined && operacionFrecuente !== ''){
        var operacionFrecuente = Ext.decode(preferenciasPersona);
    }

    console.info('generaBotonesMenu::Paso Start 2');

    var elementoPadreVisualiza;
    var datosAplicacionActiva = recuperaDatosOpenLink('aplicacionActiva');

    console.info('generaBotonesMenu::Paso Start 3');

    var objAplicacionActiva;
    var panelActividades = window.parent.Ext.getCmp('panelActividades');

    console.info('generaBotonesMenu::Paso Start 4');

    var grupoInicialActividades;

    console.info('generaBotonesMenu::Paso 0');


    if(operacionFrecuente === null){
        return;
    }

    if(datosAplicacionActiva !== undefined && datosAplicacionActiva !== ''){
        objAplicacionActiva = Ext.decode(datosAplicacionActiva);
    }

    panelActividades.removeAll();

    console.info('generaBotonesMenu::Paso 1');

    if(operacionFrecuente !== undefined && operacionFrecuente !== ''){
        for(var registroObj=0; registroObj < operacionFrecuente.length; registroObj++){

            var btnOperacionFrecuente = operacionFrecuente[registroObj];

            if(operacionFrecuente[registroObj].tipopreferencia === 'vistaArbolMenu'){
                var treePanelMenu = window.parent.Ext.getCmp('treePanelMenu');
                treePanelMenu.collapse();
            }

            if(operacionFrecuente[registroObj].tipopreferencia === 'grupoBoton'){
                var panelGrupoActividades = window.parent.Ext.getCmp('panelGrupoActividades');
                panelGrupoActividades.insertaBotonGrupo(btnOperacionFrecuente);

                if(grupoInicialActividades === undefined){
                    grupoInicialActividades = btnOperacionFrecuente.nombreelemento;
                }
            }

            if(p_elementoPadre !== undefined){
                elementoPadreVisualiza = p_elementoPadre;
            }
            else{
                if(objAplicacionActiva !== undefined){
                    elementoPadreVisualiza = objAplicacionActiva.elementoPadre;
                }
            }

            if(elementoPadreVisualiza === undefined){
                elementoPadreVisualiza = grupoInicialActividades;
            }

            if(operacionFrecuente[registroObj].tipopreferencia === 'botonMenu' &&
               operacionFrecuente[registroObj].elementopadre === elementoPadreVisualiza){
                panelActividades.insertaBoton(btnOperacionFrecuente);
            }

        } //operacionFrecuente        
    }
}

function esOperacionFrecuente(p_objOperacion){
    var objOperacionFrecuente = Ext.decode(recuperaDatosOpenLink('preferenciasPersona'));
    var operacionFrecuente = 0;

    if(objOperacionFrecuente !== null){
        for(var iRegistro=0; iRegistro<objOperacionFrecuente.length ; iRegistro++){
            if(p_objOperacion.nombreElemento == objOperacionFrecuente[iRegistro].nombreelemento){
                operacionFrecuente = 1;

                if(objOperacionFrecuente[iRegistro].estableceadmin == 'yes'){
                    operacionFrecuente = 2;
                }
            }
        }
    }

    return operacionFrecuente;
}

function accionOperacionFrecuente(button){
    var btnOperacionFrecuente = Ext.getCmp('btnOperacionFrecuente');

    if(btnOperacionFrecuente.establecida){
        mensajeTipo       = 'ERROR';
        mensajeTitulo     = 'Actividad Estándar';
        mensajeContenido  = 'El Administrador del Sistema ha establecido ésta Actividad como Estándar para su Perfil de Usuario. </br></br>';
        mensajeContenido += 'No será posible Quitar ésta Actividad.';
        mensajeUsr(mensajeTipo,
                   mensajeTitulo,
                   mensajeContenido);
        return;
    }

    if(button.text.indexOf('Quitar') !== -1){
        btnOperacionFrecuente = Ext.getCmp('btnOperacionFrecuente');
        creaOperacionFrecuente(btnOperacionFrecuente,'botonMenu','eliminar');
    }
    else{
        btnOperacionFrecuente = Ext.getCmp('btnOperacionFrecuente');
        creaOperacionFrecuente(btnOperacionFrecuente,'botonMenu','crear');
    }
}

function procesaColumnaGrid(p_idGrid,p_idColumna,p_accion){
    var gridProceso = Ext.getCmp(p_idGrid);

    for(var index = 0; index < gridProceso.columns.length; index++){
        if(gridProceso.columns[index].dataIndex == p_idColumna || gridProceso.columns[index].itemId == p_idColumna){
            if(p_accion == 'visible'){
                gridProceso.columns[index].setVisible(true);
            }

            if(p_accion == 'oculta'){
                gridProceso.columns[index].setVisible(false);
            }
        }
    }
}

function transformaValorHTML(p_cadenaTexto,p_preparaEnvio){
    var aLiteral = [
        {literal:'&',codigo:"%26"},
        {literal:"'",codigo:"%27"},
        {literal:":",codigo:"%3A"},
        {literal:".",codigo:"%2E"},
        {literal:",",codigo:"%2C"},
        {literal:'"',codigo:"%22"},
        {literal:';',codigo:"%3B"},
        {literal:'<',codigo:"%3C"},
        {literal:'>',codigo:"%3E"},
        {literal:'/',codigo:"%2F"},
        {literal:"\\",codigo:"%5C"}

    ];    

    if(p_cadenaTexto === undefined){
        return '';
    }

    p_cadenaTexto = p_cadenaTexto.toString();

    if(p_preparaEnvio !== undefined){
        for(var iCiclo=0;iCiclo<aLiteral.length;iCiclo++){
            var codigoHtml  = aLiteral[iCiclo].codigo;
            var literalHtml = aLiteral[iCiclo].literal;
            p_cadenaTexto = p_cadenaTexto.split(literalHtml).join(codigoHtml);
        }
    }
    else{
        for(var iCiclo=0;iCiclo<aLiteral.length;iCiclo++){
            var codigoHtml  = aLiteral[iCiclo].codigo;
            var literalHtml = aLiteral[iCiclo].literal;
            p_cadenaTexto = p_cadenaTexto.split(codigoHtml).join(literalHtml);
        }
    }

    var encodeText = encodeURI(p_cadenaTexto);
    var encodeText = decodeURI(encodeText);
    return encodeText;
}

function prepararDatosRegistro(p_paramsApi, p_campoReferencia){
    var prefixObj = ['fi_','dt_','cbx_','ind_','tf_','ta_','fi','dt','cbx','ind','tf','ta'];
    var campoForm;

    for(var prefix in prefixObj){
        var valPrefix = prefixObj[prefix];
        for(var iCiclo=0; iCiclo < p_campoReferencia.length; iCiclo++){
            objCampo = p_campoReferencia[iCiclo];

            var campoReferencia = objCampo.campo

            campoReferencia = campoReferencia.charAt(0).toUpperCase() + campoReferencia.slice(1);

            var idCampo = valPrefix + campoReferencia;
            campoForm = Ext.getCmp(idCampo);

            if(campoForm !== undefined){
                campoReferencia = 'p_' + campoReferencia;
                p_paramsApi[0][campoReferencia] = transformaValorHTML(leeValorElemento(idCampo),true);
            }
        }
    }

    return p_paramsApi;
} //prepararDatosRegistro

function despliegaRegistro(p_datosJson,p_tablaRegistro,p_campoReferencia){
    var fiCampo;
    var prefixObj = ['fi_','dt_','cbx_','ind_','tf_','ta_','fi','dt','cbx','ind','tf','ta'];
    var campoForm;

    objetoJson = p_datosJson[p_tablaRegistro][0];

    for (var key in objetoJson) {
        for(var prefix in prefixObj){
            var valPrefix = prefixObj[prefix];

            var campoReferencia = key;

            if(p_campoReferencia !== undefined){
                var campoBase = p_campoReferencia.filter(function(objReferencia){
                    return objReferencia.referencia == key;
                })

                if(campoBase !== undefined || campoBase.length > 0){
                    if(campoBase[0] !== undefined){
                        campoReferencia = campoBase[0].campo;
                        campoReferencia = campoReferencia.charAt(0).toUpperCase() + campoReferencia.slice(1);
                    }
                }
            }

            fiCampo = valPrefix + campoReferencia;
            campoForm = Ext.getCmp(fiCampo);

            if(campoForm !== undefined){
                try{
                    asignaValorElemento(fiCampo,objetoJson[key]);
                    deshabilitaElemento(fiCampo);
                }
                catch(error){
                    console.error(fiCampo + '(' + objetoJson[key] + ')' + ' >>> ' + error.message);
                }
            }
        } //for - Prefix
    } //for - objetoJson
}

function habilitaRegistroActualiza(p_datosJson, p_tablaRegistro,p_campoReferencia){
    var fiCampo;
    var prefixObj = ['fi_','dt_','cbx_','tf_','ind_','fi','dt','cbx','ind','tf','ta'];
    var campoForm;


    console.info('habilitaRegistroActualiza::Inicia');  
    console.info('habilitaRegistroActualiza::p_datosJson');  
    console.info(p_datosJson);
    objetoJson = p_datosJson[p_tablaRegistro][0];


    console.info('habilitaRegistroActualiza::objetoJson');
    console.info(objetoJson);


    for (var key in objetoJson) {
        for(var prefix in prefixObj){
            var valPrefix = prefixObj[prefix];

            var campoReferencia = key;

            if(p_campoReferencia !== undefined){
                var campoBase = p_campoReferencia.filter(function(objReferencia){
                    return objReferencia.referencia == key;
                })

                if(campoBase !== undefined || campoBase.length > 0){
                    if(campoBase[0] !== undefined){
                        campoReferencia = campoBase[0].campo;
                        campoReferencia = campoReferencia.charAt(0).toUpperCase() + campoReferencia.slice(1);
                    }
                }
            }            

            fiCampo = valPrefix + campoReferencia;
            campoForm = Ext.getCmp(fiCampo);

            if(campoForm !== undefined){
                console.warn('habilitaRegistroActualiza::fiCampo => ',fiCampo);
                if(campoForm.keyField === true){
                    deshabilitaElemento(fiCampo);
                }
                else{
                    habilitaElemento(fiCampo);
                }

            }
        } //for - Prefix
    } //for - objetoJson
}

function habilitaCampos(p_datosJson, p_tablaRegistro,p_campoReferencia){
    var fiCampo;
    var prefixObj = ['fi_','dt_','cbx_','tf_','ind_','fi','dt','cbx','ind','tf','ta'];
    var campoForm;

    objetoJson = p_datosJson[p_tablaRegistro][0];
    for (var key in objetoJson) {
        for(var prefix in prefixObj){
            var valPrefix = prefixObj[prefix];

            var campoReferencia = key;

            if(p_campoReferencia !== undefined){
                var campoBase = p_campoReferencia.filter(function(objReferencia){
                    return objReferencia.referencia == key;
                })

                if(campoBase !== undefined || campoBase.length > 0){
                    if(campoBase[0] !== undefined){
                        campoReferencia = campoBase[0].campo;
                        campoReferencia = campoReferencia.charAt(0).toUpperCase() + campoReferencia.slice(1);
                    }
                }
            }              

            fiCampo = valPrefix + campoReferencia;
            campoForm = Ext.getCmp(fiCampo);

            if(campoForm !== undefined){
                habilitaElemento(fiCampo);
            }
        } //for - Prefix
    } //for - objetoJson
}


function habilitaRegistroCrea(p_campoReferencia){
    var fiCampo;
    var prefixObj = ['fi_','dt_','cbx_','tf_','ind_','fi','dt','cbx','ind','tf','ta'];
    var campoForm;

    for(var prefix in prefixObj){
        var valPrefix = prefixObj[prefix];

        var campoReferencia = key;

        if(p_campoReferencia !== undefined){
            var campoBase = p_campoReferencia.filter(function(objReferencia){
                return objReferencia.referencia == key;
            })

            if(campoBase !== undefined || campoBase.length > 0){
                if(campoBase[0] !== undefined){
                    campoReferencia = campoBase[0].campo;
                    campoReferencia = campoReferencia.charAt(0).toUpperCase() + campoReferencia.slice(1);
                }
            }
        }              

        fiCampo = valPrefix + campoReferencia;
        campoForm = Ext.getCmp(fiCampo);

        if(campoForm !== undefined){
            habilitaElemento(fiCampo);
        }
    } //for - Prefix

}


function deshabilitaCampos(p_datosJson, p_tablaRegistro){
    var fiCampo;
    var prefixObj = ['fi_','dt_','cbx_','ind_'];
    var campoForm;

    objetoJson = p_datosJson[p_tablaRegistro][0];
    for (var key in objetoJson) {
        for(var prefix in prefixObj){
            var valPrefix = prefixObj[prefix];

            fiCampo = valPrefix + key;
            campoForm = Ext.getCmp(fiCampo);

            if(campoForm !== undefined){

                deshabilitaElemento(fiCampo);
            }
        } //for - Prefix
    } //for - objetoJson
}

function recuperaDatosRegistro(p_datosJson, p_tablaRegistro){
    var fiCampo;
    var prefixObj = ['fi_','dt_','cbx_','ind_','tf'];
    var campoForm;
    var valorCampo;
    var campoBase;
    var objetoForm;
    var indFormularioValido = true;
    var camposRequeridos = '';
    var aInfoRegistro = new Array();
    aInfoRegistro[0] = new Object();

    console.info('configForm:recuperaDatosRegistro');

    objetoJson = p_datosJson[p_tablaRegistro][0];

    for (var key in objetoJson) {
        for(var prefix in prefixObj){
            var valPrefix = prefixObj[prefix];

            fiCampo = valPrefix + key;
            campoForm = Ext.getCmp(fiCampo);

            if(campoForm !== undefined){

                valorCampo = leeValorElemento(fiCampo);
                if(typeof valorCampo == 'string'){
                    valorCampo = valorCampo.replace(',','');
                }

                campoBase = fiCampo.substring(3,fiCampo.length);
                campoBase = campoBase.replace('_','');
                objetoForm = Ext.getCmp(fiCampo);

                if(objetoForm !== undefined){
                    //------------------------------------------//
                    // ECRC: Validando los Campos Requeridos.   //	
                    //------------------------------------------//
                    if(objetoForm.allowBlank === false){
                        if(valorCampo === '' && objetoForm.fieldLabel !== undefined){
                            indFormularioValido = false;

                            camposRequeridos += '<font color=blue></br><b>*' + objetoForm.fieldLabel + '</b></font>';
                        }
                    }
                    aInfoRegistro[0][campoBase] = valorCampo;
                }
            }
        } //for - Prefix
    } //for - objetoJson

    var aResultado = new Array();
    aResultado[0] = aInfoRegistro;
    aResultado[1] = camposRequeridos;
    aResultado[2] = indFormularioValido;


    return aResultado;
}

function iniciaRegistro(p_datosJson, p_tablaRegistro){
    var fiCampo;
    var prefixObj = ['fi_','dt_','cbx_','ind_'];
    var campoForm;

    objetoJson = p_datosJson[p_tablaRegistro][0];
    for (var key in objetoJson) {
        for(var prefix in prefixObj){
            var valPrefix = prefixObj[prefix];

            fiCampo = valPrefix + key;
            campoForm = Ext.getCmp(fiCampo);

            if(campoForm !== undefined){

                switch(valPrefix){
                    case 'fi_':
                        campoForm.setValue('');
                        break;
                    case 'dt_':
                        campoForm.setValue('');
                        break;
                }

            }
        } //for - Prefix
    } //for - objetoJson
}