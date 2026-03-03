function mensajeReporteNOK(){
    var mensajeError = 'No se encontraron registros para generar el Reporte.';
    
    console.log(mensajeError);
    
    Ext.Msg.show({
        title      : 'Reporte sin datos',
        msg        : mensajeError,
        width      : 400,
        buttons    : Ext.MessageBox.OK,
        icon       : Ext.MessageBox.INFO
    });    
}

function despliegaArchivo(p_urlFileDisplay,p_datosFileDisplay){
    var winReporte = Ext.getCmp('winReporte');
    var botonesWindow = new Array();
    
    if(p_datosFileDisplay.fileSalida == 'xls'){
        ejecutaURL(p_urlFileDisplay);
    }
    else{
        if(p_datosFileDisplay.fileBtnEtiqueta !== undefined){

            let fileIconCls = 'information32';

            if(p_datosFileDisplay.fileBtnIcono !== undefined){
                fileIconCls = p_datosFileDisplay.fileBtnIcono;
            }

            botonesWindow.push({
                id        : p_datosFileDisplay.fileBtnId,
                text      : p_datosFileDisplay.fileBtnEtiqueta,
                textAlign : 'left',
                width     : 130,
                height    : 40,
                iconCls   : fileIconCls,
                iconAlign : 'right',
                badgeText : 'right',
                handler: function(){
                    eval(p_datosFileDisplay.fileBtnFuncion);
                }
            });        
        }
        
        botonesWindow.push({xtype: 'tbfill'});

        botonesWindow.push({
            text      : 'Salir',
            textAlign : 'left',
            width     : 130,
            height    : 40,
            iconCls   : 'book_next32',
            iconAlign : 'left',
            handler: function(){
                if(p_datosFileDisplay.fileFuncionCierre !== undefined){
                    eval(p_datosFileDisplay.fileFuncionCierre);
                }
                cierraReporte(); 
            }
        });
        
        if(!winReporte){
            console.log('Creando la ventana');
            
            winReporte = new Ext.Window({
                width    : 850,
                height   : 500,
                closable : false,
                modal    : true,
                id       : 'winReporte',
                layout   : 'fit',
                items    : [{
                    xtype : "component",
                    id: "contenidoReporte",
                    autoEl : {
                        tag : "iframe",
                        src : p_urlFileDisplay
                    }
                }],
                               dockedItems: [{
                    xtype: 'toolbar',
                    cls: 'colorToolbarLite',
                    dock: 'bottom',
                    items: botonesWindow
                }]

                //buttons:botonesWindow
            });
        }
        else{
            winReporte.src = p_urlFileDisplay;
        }
        
        abreReporte(p_urlFileDisplay);        
    } /* Cualquier tipo de Reporte */
}

function generaReporte(p_urlJasperReport,p_datosJasperReport){
    var winReporte = Ext.getCmp('winReporte');
    var botonesWindow = new Array();
    
    if(p_datosJasperReport.jasperSalida == 'xls'){
        ejecutaURL(p_urlJasperReport);
    }
    else{
        if(p_datosJasperReport.jasperBtnEtiqueta !== undefined){

            let jasperIconCls = 'information32';

            if(p_datosJasperReport.jasperBtnIcono !== undefined){
                jasperIconCls = p_datosJasperReport.jasperBtnIcono;
            }

            botonesWindow.push({
                id        : p_datosJasperReport.jasperBtnId,
                text      : p_datosJasperReport.jasperBtnEtiqueta,
                textAlign : 'left',
                width     : 130,
                height    : 40,
                iconCls   : jasperIconCls,
                iconAlign : 'right',
                badgeText : 'right',
                handler: function(){
                    eval(p_datosJasperReport.jasperBtnFuncion);
                }
            });        
        }
        
        botonesWindow.push({xtype: 'tbfill'});

        botonesWindow.push({
            text      : 'Salir',
            textAlign : 'left',
            width     : 130,
            height    : 40,
            iconCls   : 'book_next32',
            iconAlign : 'left',
            handler: function(){
                if(p_datosJasperReport.jasperFuncionCierre !== undefined){
                    eval(p_datosJasperReport.jasperFuncionCierre);
                }
                cierraReporte(); 
            }
        });
        
        if(!winReporte){
            console.log('Creando la ventana');
            
            winReporte = new Ext.Window({
                width    : 850,
                height   : 500,
                closable : false,
                modal    : true,
                id       : 'winReporte',
                layout   : 'fit',
                items    : [{
                    xtype : "component",
                    id: "contenidoReporte",
                    autoEl : {
                        tag : "iframe",
                        src : p_urlJasperReport
                    }
                }],
                               dockedItems: [{
                    xtype: 'toolbar',
                    cls: 'colorToolbarLite',
                    dock: 'bottom',
                    items: botonesWindow
                }]

                //buttons:botonesWindow
            });
        }
        else{
            winReporte.src = p_urlJasperReport;
        }
        
        abreReporte(p_urlJasperReport);        
    } /* Cualquier tipo de Reporte */
}

function ejecutaURL(p_url){
    window.location.href = p_url;
}

function actualizaURLReporte(p_urlContenido){
    var winReporte = Ext.getCmp('winReporte');
    Ext.getDom('contenidoReporte').src = p_urlContenido;
    winReporte.update();
}

function abreReporte(p_urlJasperReport){
    var winReporte = Ext.getCmp('winReporte');
    
    winReporte.update(p_urlJasperReport);
    winReporte.show();
}

function cierraReporte(){
    var winReporte = Ext.getCmp('winReporte');
    winReporte.hide();
    winReporte.destroy();
    
}

function creaUrlJasper(p_datosJasper,p_idTransUsr){
    
    console.log("creaUrlJasper >>>");
    console.log("p_datosJasper");
    console.log(p_datosJasper);    
    console.log('jasperOpenLink: ' + recuperaDatoSesion('jasperOpenLink'));
    
    
    var serverJasper   = recuperaDatoSesion('jasperURLServer');
    var parentFolder   = '&ParentFolderUri=' + recuperaDatoSesion('jasperParentFolder');
    var reportUnit     = '&reportUnit=' + recuperaDatoSesion('jasperReportUnit') + p_datosJasper.jasperReporte; 
    var decorate       = "&decorate=no";
    var username       = '&j_username=' + recuperaDatoSesion('jasperUsername');
    var password       = '&j_password=' + recuperaDatoSesion('jasperPassword');
    var jasperOpenLink = "&jasperOpenLink=" + recuperaDatoSesion('jasperOpenLink');
    var salida         = "&output=pdf";
    var idTrans        = 0;
    var idSesion       = 0;
    
    var paramIdSesion    = '';
    var paramIdTrans     = '';
    var paramCodEmpresa  = '';
    var paramCodSistema  = '';
    var datosJson        = '';
    var openLinkServidor = '';
    var openLinkServicio = '';
    var openLinkPrograma = '';
    
    /*----------------------------------------------------------------------\
    | ECRC: Recuperando el ID de la Transacción que respalda al Reporte.	|
    \----------------------------------------------------------------------*/
    idSesion = recuperaDatoSesion('idSesion');
    if(idSesion === undefined){
        idSesion = recuperaDatoSesion('idsesion');
    }
    
    
    if(p_idTransUsr !== undefined){
        idTrans = p_idTransUsr;
    }
    else{
        idTrans  = valorCampo(p_datosJasper.jasperStorage,
                              p_datosJasper.jasperTablaLocal,
                              'p_idtrans'); 
    }
    
    console.info('*** Reporte Jasper ***');
    console.info('ID Sesion      : ' + idSesion);
    console.info('ID Transacción : ' + idTrans);

    /*----------------------------------------------------------------------\
    | ECRC: Adicionando Parametros Extra para paso hacia Jasper y OpenLink	|
    \----------------------------------------------------------------------*/
    paramIdSesion    = '%22p_idsesion%22:%22'    + idSesion + '%22';
    paramIdTrans     = '%22p_idtrans%22:%22'     + idTrans  + '%22';
    paramCodEmpresa  = '%22p_codEmpresa%22:%22'  + recuperaDatoSesion('codEmpresa') + '%22';
    paramCodSistema  = '%22p_codSistema%22:%22'  + recuperaDatoSesion('codSistema') + '%22';
    datosJson        = '&datosJson=%5B%7B'    + 
                        paramIdSesion   + ',' + 
                        paramIdTrans    + ',' + 
                        paramCodEmpresa + ',' + 
                        paramCodSistema ;
    
    var extraParams  = [
        datosJson
    ].join('');
    
    //ECRC: Cargando los Parámetros Adicionales en el Reporte
    console.info('Cargando Parámetros');    
    
    if (typeof p_datosJasper.jasperParamsReport !== 'undefined') {
        objParamasReport = p_datosJasper.jasperParamsReport;
        for(var paramReport in objParamasReport){
            var addParam = paramReport + 
                           ':' + 
                           objParamasReport[paramReport];
            
            console.info(addParam);
            extraParams = extraParams + ',' + addParam;
        }
    }
    else{
        console.warn('Parametros Adicionales no existen');
    }
    
    //ECRC: Finaliza los Datos JSON
    extraParams = extraParams + '%7D%5D';
    
    
    if(p_datosJasper.jasperSalida == 'xls'){
        salida       = "&output=xls";
    }
    
    if(p_datosJasper.jasperSalida == 'jasper'){
        salida       = "";
    }    

    openLinkServidor = '&openLinkServidor=' + recuperaDatoSesion('servidor');
    openLinkServicio = '&openLinkServicio=' + recuperaDatoSesion('servicio');
    openLinkPrograma = '&openLinkPrograma=' + recuperaDatoSesion('programa');

    var urlJasper = [
        serverJasper,
        parentFolder,
        reportUnit,
        decorate,
        username,
        password,
        salida, 
        jasperOpenLink,
        openLinkServidor,
        openLinkServicio,
        openLinkPrograma,
        extraParams
    ].join('');
    


    console.info('URL Jasper Generada>>> ');
    console.info(urlJasper);
    
    return urlJasper;
}
