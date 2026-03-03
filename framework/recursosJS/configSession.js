var appNombreAplicacion = '';
var configSession = {
    estableceAplicacion: function(pAplicacion){
        appNombreAplicacion = pAplicacion;
        return pAplicacion;
    },
    obtieneAplicacion: function(){
        return appNombreAplicacion;
    },
    grabaInstancia: function(pInstanciaNombre,pObjInstanciaValores){
        var sessionInstancia  = 'session_' + pInstanciaNombre;

        if(pObjInstanciaValores !== undefined){
            sessionStorage.setItem(sessionInstancia,JSON.stringify(pObjInstanciaValores));    
        }
        else{
            sessionStorage.setItem(sessionInstancia,undefined);
        }
    },
    recuperaInstancia: function(pInstanciaNombre){
        var sessionInstancia  = 'session_' + pInstanciaNombre;
        var valInstancia = sessionStorage.getItem(sessionInstancia);

        if(valInstancia !== undefined){
            valInstancia = JSON.parse(valInstancia);
            return valInstancia;
        }
        else{
            return undefined;
        }
    } 
};