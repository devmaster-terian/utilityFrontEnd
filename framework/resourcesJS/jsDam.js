const jsDam = {
    confirmDelete: function(pObjConfig,pFnDelete){
        var msgTitle = 'Eliminar ' + pObjConfig.recordName;
        var msgQuestion = '¿Desea eliminar el Registro de ' + pObjConfig.recordDescription + '?';
        
        Ext.Viewport.mask({ xtype: 'loadmask', message: 'Eliminar registro...' });
        Ext.Msg.show({
            title: msgTitle,
            message: msgQuestion,
            width: 300,
            buttons: [
                {
                    text: 'Sí',
                    itemId: 'yes',
                    ui: 'confirm' // Esto le da el color azul principal
                },
                {
                    text: 'No',
                    itemId: 'no',
                    ui: 'decline'
                }
            ],
            fn: function(buttonId) {
                if (buttonId === 'yes') {
                    pFnDelete(pObjConfig.recordId);

                    Ext.Viewport.unmask();
                }
                else{
                    Ext.Viewport.unmask();
                }
            }
        });        
    },
    toast: function(pObjMessage){
        
        function doToast(){
            
            switch (pObjMessage.type) {
                case 'warning':
                    colorTextMessage = '#bd2608';
                    colorMessage = 'yellow';
                    iconMessage = 'fas fa-warning';
                    break;
                case 'error':
                    colorTextMessage = 'yellow';
                    colorMessage = '#8B0000';
                    iconMessage = 'fas fa-circle-xmark';
                    break;
                case 'info':
                    colorTextMessage = '#f3f2fa';
                    colorMessage = '#200dd1';
                    iconMessage = 'fas fa-circle-info';
                    break;
                case 'success':
                    colorTextMessage = '#ecf5eb';
                    colorMessage = '#118c03';
                    iconMessage = 'fas fa-check';
                    break;
                default:
                    colorTextMessage = '#f3f2fa';
                    colorMessage = '#200dd1';
                    iconMessage = 'fas fa-circle-info';
                   break;
            }            
            
            console.log('pObjMessage:',pObjMessage);
            window.iziToast.show({ 
                layout: 2,
                backgroundColor: colorMessage,
                titleColor: colorTextMessage,
                messageColor: colorTextMessage,
                iconColor: colorTextMessage,
                position: 'center',
                theme: 'light', 
                ballon: true,
                icon: pObjMessage.icon, 
                title: pObjMessage.title, 
                message: pObjMessage.message});
        }
        
        if (typeof window.iziToast !== 'undefined') {
            doToast(); //window.iziToast.show({ theme: 'dark', title: pObjMessage.title, message: pObjMessage.message});
            return;
        }

        Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Desempaquetando Webpack...' });

        Ext.Ajax.request({
            url: '../../../../../framework/plugins/iziToast-master/dist/js/iziToast.min.js',
            success: function(response) {
                Ext.Viewport.setMasked(false);

                var hackCode = response.responseText.replace(
                    'return $iziToast;',
                    'window.iziToast = $iziToast; return $iziToast;'
                );

                try {
                    eval(hackCode);

                    setTimeout(function() {
                        if (typeof window.iziToast !== 'undefined') {
                            doToast();
                            /*
                            window.iziToast.show({
                                theme: 'dark',
                                title: pObjMessage.title,
                                message: pObjMessage.message
                            });
                            */
                        } else {
                            console.error("El reemplazo falló.");
                        }
                    }, 50);

                } catch (err) {
                    console.error('Error al evaluar el script modificado:', err);
                }
            },
            failure: function() {
                Ext.Viewport.setMasked(false);
                console.error('No se pudo descargar el archivo JS.');
            }
        });        
    },
	information: function(){
		var version = 'dam.20260223';
		return version;
	},
	previewFileFromURL: function(url, cfg, record){
		cfg = cfg || {};
		var me = this;

		console.log('url=>>',url);
        console.log('cfg=>>',cfg);

		Ext.Ajax.request({
		    url   : url,
		    method: 'GET',
		    binary: true,

		    success: function (resp) {


		        console.log('mask cargadnod..');
		        Ext.Viewport.mask({ xtype: 'loadmask', message: 'Cargando...' });
		        setTimeout(function(){
		            var ct    = resp.getResponseHeader('Content-Type') || 'application/pdf';
		            var bytes = resp.responseBytes || resp.responseArrayBuffer || null;

		            if (!bytes) {
		                (me.toastAlert || Ext.toast).call(me, 'Respuesta binaria no disponible');
		                if (typeof cfg.onFail === 'function') cfg.onFail(resp);
		                return;
		            }

		            var blob    = new Blob([new Uint8Array(bytes)], { type: ct });
		            var blobUrl = (window.URL || window.webkitURL).createObjectURL(blob);
		            var isImage = /^image\//i.test(ct);
		            //var isPDF = /.pdf/i.test(ct);
		            var isPDF = /application\/pdf/i.test(ct) || /\.pdf$/i.test(url);

                    var pdfJsPath = '../../../../framework/plugins/pdfjs-5.4.624-dist/web/viewer.html';

                    console.log('blobUrl:',blobUrl);
                    
                    var html = '<div>' +
                        '<iframe src="' + blobUrl + '" ' +
                        'style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;display:block;"></iframe>' +
                        '</div>';

                    if(isImage){
                        // Cambiamos a position:absolute y fondo negro
                        html = '<div style="position:absolute; top:0; left:0; width:100%; height:100%; ' +
                            'display:flex; align-items:center; justify-content:center; ' +
                            'background:#000;">' + // Fondo negro (#000) o gris oscuro (#111)
                            '<img src="' + blobUrl + '" ' +
                            'style="max-width:100%; max-height:100%; width:auto; height:auto; ' +
                            'object-fit:contain; display:block;" />' +
                            '</div>';
                    }

                    if(isPDF){
                        html = '<div>' +
                            '<iframe src="' + pdfJsPath + '?file=' + encodeURIComponent(blobUrl) + '" ' +
                            'style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;display:block;"></iframe>' +
                            '</div>';
		            }

                    /*
		            var sheet = Ext.create('Ext.Sheet', {
		                title: cfg.title || 'Vista Previa',
		                modal: true,
		                centered: true,
		                hideOnMaskTap: true,
		                width: cfg.width || '95%',
		                height: cfg.height || '95%',
		                layout: 'fit',
		                tools: [{
		                    type: 'close',
		                    iconCls: 'fas fa-close',
		                    handler: function() {
		                        sheet.hide();
		                    }
		                }],
		                items: [{
		                    xtype: 'component',
		                    scrollable: false,
		                    html : html
		                }],
		                listeners: {
		                    show: function(sender) {
		                        // 3. Quitamos la máscara en cuanto la hoja se muestra
		                        Ext.Viewport.unmask();
		                    },
		                    hide: function () {
		                        setTimeout(function () {
		                            (window.URL || window.webkitURL).revokeObjectURL(blobUrl);
		                        }, 300);
		                        sheet.destroy();
		                    }
		                }
		            });
                    */

                    var sheet = Ext.create('Ext.Sheet', {
                        modal: true,
                        centered: true,
                        hideOnMaskTap: true,
                        width: cfg.width || '95%',
                        height: cfg.height || '95%',
                        layout: 'fit',
                        // Eliminamos 'title' y 'tools' de la raíz y los pasamos a un TitleBar
                        items: [
                            {
                                xtype: 'titlebar',
                                docked: 'top',
                                title: cfg.title || 'Vista Previa',
                                items: [
                                    {
                                        xtype: 'button',
                                        align: 'right', // Coloca el botón a la derecha
                                        iconCls: 'fas fa-times', // Ícono de cerrar (X)
                                        text: 'Cerrar', // Opcional: puedes quitar esta línea si solo quieres el ícono
                                        ui: 'decline', // Le da un estilo de acción destructiva/cerrar (suele ser rojo)
                                        handler: function() {
                                            sheet.hide(); // Oculta el sheet, lo cual detonará tu listener 'hide' y lo destruirá
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'component',
                                scrollable: false,
                                html: html
                            }
                        ],
                        listeners: {
                            show: function(sender) {
                                // Quitamos la máscara en cuanto la hoja se muestra
                                Ext.Viewport.unmask();
                            },
                            hide: function () {
                                setTimeout(function () {
                                    (window.URL || window.webkitURL).revokeObjectURL(blobUrl);
                                }, 300);
                                sheet.destroy();
                            }
                        }
                    });                    
                    
		            sheet.show();

		            if (typeof cfg.onDone === 'function') cfg.onDone({ ok: true, contentType: ct });
		        }, 50); //setTimeout


		    },

		    failure: function (resp) {
		        if (me.toastAlert) me.toastAlert(cfg.failMsg || 'No se pudo cargar el archivo', 'error');
		        else Ext.toast(cfg.failMsg || 'No se pudo cargar el archivo');

		        if (typeof cfg.onFail === 'function') cfg.onFail(resp);
		    }
		});
	}
};