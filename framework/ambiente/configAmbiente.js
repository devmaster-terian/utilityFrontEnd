function datosOpenLink(p_dato){
    var datoRetorno ='';

    if(p_dato == 'servidorWeb'){
        datoRetorno = 'http://10.11.21.19/';
    }

    if(p_dato == 'servidor'){
        datoRetorno = '10.11.21.19';
    }

    if(p_dato == 'servicio'){
        datoRetorno = 'OPENLINK_WS_PRUEBAS';
    }

    if(p_dato == 'programa'){
        datoRetorno = 'openLink.html';
    }

    if(p_dato == 'ambiente'){
        datoRetorno = 'Portal SAC</br></br>Pruebas';
    }

    if(p_dato == 'tituloAplicacion'){
        datoRetorno = 'Portal SAC | Pruebas';
    }

    return datoRetorno;
}
