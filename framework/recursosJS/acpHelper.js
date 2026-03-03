var acp ={
	estadoEtiqueta: function(pEstado){
		var valorRetorno = '';
		switch(parseInt(pEstado)){
		    case 0:
		        valorRetorno = 'En Piso';
		        break;
		    case 1:
		        valorRetorno = 'Registrada';
		        break;
		    case 2:
		        valorRetorno = 'En Maquina';
		        break;
		    case 3:
		        valorRetorno = 'En Proceso';
		        break;
		    case 4:
		        valorRetorno = 'Consumida';
		        break;
		    case 5:
		        valorRetorno = 'Transferida Confinadog';
		        break;
		    case 6:
		        valorRetorno = 'Confinado Trans. (Pendiente)';
		        break;
		    case 7:
		        valorRetorno = 'Confinado en Transito';
		        break;
		    case 8:
		        valorRetorno = 'Recibido en Confinado';
		        break;
		    case 9:
		        valorRetorno = 'Pendiente';
		        break;
		    case 10:
		        valorRetorno = 'Enviado a Merma';
		        break;
		    case 11:
		        valorRetorno = 'Enviado a Embalaje';
		        break;
		    case 12:
		        valorRetorno = 'Enviado a Pedido';
		        break;
		    }	

	    return valorRetorno;	
	}, //estadoEtiqueta

	hola: function(){
		console.warn('acp:: Hola!');
	} //hola
};