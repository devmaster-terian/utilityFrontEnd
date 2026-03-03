function leeValorStore(p_idStore,p_campoStore){
    var valRetorno;
    var storeLocal = Ext.getStore(p_idStore);
    
    if(storeLocal === undefined){
        return undefined;
    }
    
    storeLocal.load(function(records,op,success){
        var datosFiltro, iCiclo;
        
        for (iCiclo=0; iCiclo<records.length; iCiclo++){
            datosFiltro = records[iCiclo].data;
            valRetorno = datosFiltro[p_campoStore];
            
        }
    });
    return valRetorno;
}

function asignaValoresStore(p_idStore,p_datosStore){
    var storeLocal = Ext.getStore(p_idStore);

    storeLocal.getProxy().clear();
    storeLocal.add(p_datosStore);
    storeLocal.sync();
}

function limpiaSesionStore(p_idStore){
    var storeLocal = Ext.getStore(p_idStore);

    storeLocal.getProxy().clear();
    storeLocal.sync();
}

function creaSesionStore(p_nombreStore,p_modelo){
    var idModelo = 'mod' + p_nombreStore;
    var idStore  = 'store' + p_nombreStore;
    
    Ext.define(idModelo,
    {
        extend: 'Ext.data.Model',
        fields: p_modelo
    });
    
    Ext.define(idStore,
    {
        extend: 'Ext.data.Store',
        model: idModelo,
        proxy:{
            type: 'sessionstorage',
            id: idStore
        }
    });    
    
    var storeSesion = Ext.create(idStore);
    storeSesion.getProxy().clear();    
    storeSesion.sync();
    
    
    return idStore;
}

function registraAppLocal(p_nombreApp){
    var nombreStore = 'applocal';
    var datosStore = {nombre:p_nombreApp};
    datosStore = Ext.encode(datosStore);
    
    generaDatosOpenLink(nombreStore, datosStore);
}

function creaOperacionFrecuente(p_objOperacion,p_tipoObjeto,p_accion){

    /*------------------------------------------\
    | ECRC: Definición de Funciones OpenLink.	|
    \------------------------------------------*/
    var funcionSuccess = function(){
        
        var datosOpenLink = Ext.decode(recuperaDatosOpenLink('procesoPreferencia'));
        
        var temp_output_resultado   = datosOpenLink.temp_output_resultado;
        var temp_output_preferencia = datosOpenLink.temp_output_preferencia;
        
        var mensajeApi = '<font color=darkblue>';
        for(var iRegistro=0; iRegistro < Object.keys(temp_output_resultado).length; iRegistro++){
            mensajeApi += temp_output_resultado[iRegistro].mensaje + '</br>';
            
        }
        
        var mensajeTipo      = 'INFO';
        var mensajeTitulo    = 'Operacion Frecuente.';
        var mensajeContenido = mensajeApi;
        
        mensajeUsr(mensajeTipo,
                   mensajeTitulo,
                   mensajeContenido);
        
        switch(p_tipoObjeto){
            case 'botonMenu':
                botonOperacionFrecuente(p_objOperacion,p_accion);
                generaDatosOpenLink('preferenciasPersona',Ext.encode(temp_output_preferencia));

                var panelActividades      = window.parent.Ext.getCmp('panelActividades');
                var panelGrupoActividades = window.parent.Ext.getCmp('panelGrupoActividades');

                panelActividades.removeAll();
                panelGrupoActividades.removeAll();
                generaBotonesMenu();
                
                var aplicacionActiva = recuperaDatosOpenLink('aplicacionActiva');
                if(aplicacionActiva !== undefined){
                    aplicacionActiva = Ext.decode(aplicacionActiva);
                }
                
                switch(p_accion){
                    case 'crear':
                        var idBoton = 'btnGrupo_' + aplicacionActiva.elementoPadre;    
                        
                        console.log('idBoton:');
                        console.log(idBoton);
                        
                        var botonGrupoInicial = window.parent.Ext.getCmp(idBoton);
                        botonGrupoInicial.removeCls('botonGrupoEsperaExt');
                        botonGrupoInicial.addCls('botonGrupoExt');
                        
                        generaBotonesMenu(botonGrupoInicial.nombreElemento);                         
                        break;
                    case 'eliminar':
                        break;
                }
                
                break;
            case 'vistaArbolMenu':
                console.log('opción Libre');
                break;
            default:
                console.log('No se recibio el Objeto');
        }
        
        return true;
    };
    
    var funcionFailure = function(){
        var datosOpenLink = Ext.decode(recuperaDatosOpenLink('procesoPreferencia'));
        var temp_output_resultado = datosOpenLink.temp_output_resultado;
        
        var mensajeApi = '<font color=darkred>';
        for(var iRegistro=0; iRegistro < Object.keys(temp_output_resultado).length; iRegistro++){
            mensajeApi += '- ' + temp_output_resultado[iRegistro].mensaje + '</br>';
            
        }
        
        var mensajeTipo      = 'ERROR';
        var mensajeTitulo    = 'Operacion Frecuente no se pudo establecer.';
        var mensajeContenido = mensajeApi;
        
        mensajeUsr(mensajeTipo,
                   mensajeTitulo,
                   mensajeContenido);
        
        return false;
    };    
    
    
    var aplicacionActiva = Ext.decode(recuperaDatosOpenLink('aplicacionActiva'));
    
    var aInfoApi = new Array();
    aInfoApi[0] = new Object();
    aInfoApi[0].codEmpresa      = recuperaDatoSesion('codEmpresa');
    aInfoApi[0].codSistema      = recuperaDatoSesion('codSistema');
    aInfoApi[0].clavePersona    = recuperaDatoSesion('clavePersona');
    aInfoApi[0].codMenu         = recuperaDatoSesion('codMenu');    
    aInfoApi[0].elementoPadre   = aplicacionActiva.elementoPadre;
    aInfoApi[0].nombreElemento  = aplicacionActiva.nombreElemento;
    aInfoApi[0].urlWebApp       = aplicacionActiva.urlWebApp;
    aInfoApi[0].descripcion     = aplicacionActiva.descripcion;
    aInfoApi[0].iconCls         = aplicacionActiva.iconCls;
    
    aInfoApi[0].tipoPreferencia = 'botonMenu';
    aInfoApi[0].accion          = p_accion;
    
    var strJson = JSON.stringify(aInfoApi);
    
    datosJsonFormulario = {codPrograma      : 'api_PreferenciaPersona',
                           codProcedimiento : 'procesoPreferencia',
                           tipoLlamada      : "formulario",
                           datosJson        : strJson};
    
    
    ejecutaOpenLink(datosJsonFormulario,
                   funcionSuccess,
                   undefined,
                   funcionFailure,
                   undefined);      
}

function winAplicacionActivaAbre(){
    winAplicacionActiva.show();

}

function winAplicacionActivaCierra(){
    winAplicacionActiva.close();

}

function validaOperacionFrecuente(){
    var winAplicacionActiva = window.parent.Ext.getCmp('winAplicacionActiva');
    if(winAplicacionActiva){
        
        var objAplicacion = {
            nombreElemento : winAplicacionActiva.nombreElemento
        };
            var objBoton = Ext.getCmp('btnOperacionFrecuente');
        
        switch(esOperacionFrecuente(objAplicacion)){
            case 0:
                botonOperacionFrecuente(objBoton,'eliminar');
                break;
            case 1:
                botonOperacionFrecuente(objBoton,'crear');
                break;
            case 2:
                botonOperacionFrecuente(objBoton,'establecida');
                break;
        }
        
    }
}