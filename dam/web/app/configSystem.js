function configuracionSistema(p_dato){
    var valorRetorno = '';
    switch(p_dato){
        case 'nombreSistema':
            valorRetorno = 'UTILITY GO - Digital Assets Management';
            break;
        case 'portal':
            valorRetorno = '../basicWorkspace/index.html';
            break;
        case 'codEmpresa':
            valorRetorno = 'UTILITY';
            break;
        case 'codSistema':
            valorRetorno = 'DAM';
            break;
        case 'codEmpresaActiva':
            valorRetorno = 'UTILITY';
            break;
        case 'codSucursalActiva':
            valorRetorno = '';
            break;
        case 'versionFramework':
            valorRetorno = '1.0';
            break;
        case 'serverIp':
            valorRetorno = '192.168.100.179';
            break;
        case 'serverPort':
            valorRetorno = ':5001';
            break;
        default:
            valorRetorno = '';
    }
    return valorRetorno;
}