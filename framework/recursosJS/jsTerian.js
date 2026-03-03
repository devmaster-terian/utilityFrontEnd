var ipAddress  = configuracionSistema('serverIp'); 
var port       = configuracionSistema('serverPort'); 
var protocol   = configuracionSistema('serverProtocol'); 
var codEmpresa = configuracionSistema('codEmpresa'); 

const jsTerian = {
    basicCall: function (pMessage) {
        console.info('This is a basicCall', pMessage);
    },

    // Quita las barras / del inicio y final
    trimEdges: function (s) {
        return String(s || '').replace(/^\/+|\/+$/g, '');
    },

    // Limpia los segmentos de simbolos
    encodeSegs: function(arr) {
        return arr.map(x => encodeURIComponent(String(x)));
    },

    joinUrl: function (base, parts) {
        const all = [base].concat(parts).map(this.trimEdges).filter(Boolean);
        return all.join('/').replace(/^http:\//, 'http://').replace(/^https:\//, 'https://');
    },

    getUrl: function (name, param) {
        console.info('ipAddress:',ipAddress);
        console.info('ipAddress:',port);
        console.info('protocol:',protocol);
        
        var urlReturn = protocol + '://' + ipAddress +  port;
        urlReturn += '/' + name;

        if (param !== undefined && param !== null) {
            urlReturn += '/' + encodeURIComponent(param);
        }

        return urlReturn;
    },

    makeUrl: function (name, ...args) {
        // Valor por defecto
        let isStatic = false;

        // Si el último argumento es booleano, se toma como isStatic
        if (args.length && typeof args[args.length - 1] === 'boolean') {
            isStatic = args.pop();
        }

        // URL base tomando en cuenta si es contenido estatico o no
        const base = isStatic
            ? protocol + ':/' + ipAddress
            : protocol + ':/' + ipAddress + port;

        // Se arman los segmentos 
        const pathSegments = [this.trimEdges(name)]
            .concat(
                args.flatMap(seg =>
                    String(seg).split('/').map(s => s.trim()).filter(Boolean)
                )
            );

        // Unir el URL final
        return this.joinUrl(base, pathSegments);
    },


    previewFileFromUrl: function (url, cfg) {
        cfg = cfg || {};

        Ext.getBody().mask(cfg.maskText || 'Cargando vista previa...');

        Ext.Ajax.request({
            url   : url,
            method: 'GET',
            binary: true,

            success: function (resp) {
                Ext.getBody().unmask();

                var ct    = resp.getResponseHeader('Content-Type') || 'application/pdf';
                var bytes = resp.responseBytes || resp.responseArrayBuffer || null;

                if (!bytes) {
                    this.toastAlert('Respuesta binaria no disponible', 'error');
                    if (typeof cfg.onFail === 'function') cfg.onFail(resp);
                    return;
                }

                var blob    = new Blob([new Uint8Array(bytes)], { type: ct });
                var blobUrl = (window.URL || window.webkitURL).createObjectURL(blob);

                var vpW = Ext.Element.getViewportWidth();
                var vpH = Ext.Element.getViewportHeight();

                var cd   = resp.getResponseHeader('Content-Disposition');
                var name = cfg.filename || 'archivo.pdf';

                var win = Ext.create('Ext.window.Window', {
                    title : cfg.title || 'Vista previa',
                    modal : true,
                    layout: 'fit',
                    width : Math.min(cfg.width || 1000, vpW - 40),
                    height: Math.min(cfg.height || 700, vpH - 40),
                    items: [{
                        xtype : 'component',
                        autoEl: {
                            tag  : 'iframe',
                            src  : blobUrl,
                            style: 'border:0; width:100%; height:100%;'
                        }
                    }],
                    listeners: {
                        close: function () {
                            setTimeout(function () {
                                (window.URL || window.webkitURL).revokeObjectURL(blobUrl);
                            }, 1000);
                        }
                    }
                });

                win.show();

                if (typeof cfg.onDone === 'function') cfg.onDone({ ok: true });
            },

            failure: function (resp) {
                Ext.getBody().unmask();
                jsTerian.toastAlert(cfg.failMsg || 'No se pudo cargar el archivo', 'error');
                if (typeof cfg.onFail === 'function') cfg.onFail(resp);
            }
        });
    },


    downloadFileFromUrl: function (url, cfg) {
        cfg = cfg || {};

        Ext.getBody().mask(cfg.maskText || 'Descargando...');

        Ext.Ajax.request({
            url: url,
            method: 'GET',
            binary: true,

            success: function (resp) {
            Ext.getBody().unmask();

            var ct    = resp.getResponseHeader('Content-Type') || 'application/octet-stream';
            var bytes = resp.responseBytes || resp.responseArrayBuffer || null;

            if (!bytes) {
                jsTerian.toastAlert('Respuesta binaria no disponible', 'error');
                if (cfg.onFail) cfg.onFail(resp);
                return;
            }

            var blob = new Blob([new Uint8Array(bytes)], { type: ct });
            var objUrl = (window.URL || window.webkitURL).createObjectURL(blob);

            var cd = resp.getResponseHeader('Content-Disposition');
            var name = cfg.filename || 'archivo';

            // extensión pdf
            if (ct.indexOf('pdf') !== -1 && !/\.pdf$/i.test(name)) name += '.pdf';

            var a = document.createElement('a');
            a.href = objUrl;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            a.remove();

            setTimeout(function () {
                (window.URL || window.webkitURL).revokeObjectURL(objUrl);
            }, 1500);

            if (cfg.onDone) cfg.onDone({ ok: true });
            },

            failure: function (resp) {
            Ext.getBody().unmask();
            jsTerian.toastAlert(cfg.failMsg || 'No se pudo descargar el archivo', 'error');
            if (cfg.onFail) cfg.onFail(resp);
            }
        });
    },

    
    toastAlert: function (msg, type = 'information', customTitle) {
        var backgroundColor, textColor, defaultTitle;

        // Tu lógica de colores (está perfecta, la mantenemos igual)
        switch ((type || '').toString().toLowerCase()) {
            case 'success':
                backgroundColor = '#4CAF50'; // Verde
                textColor = '#fff';
                defaultTitle = 'Éxito';
                break;
            case 'error':
                backgroundColor = '#F44336'; // Rojo
                textColor = '#fff';
                defaultTitle = 'Error';
                break;
            case 'information':
                backgroundColor = '#2196F3'; // Azul
                textColor = '#fff';
                defaultTitle = 'Información';
                break;
            case 'warning':
                backgroundColor = 'darkred'; // Amarillo
                textColor = '#FFC107';
                defaultTitle = 'Advertencia';
                break;
            default:
                backgroundColor = '#9e9e9e'; // Gris
                textColor = '#fff';
                defaultTitle = 'Mensaje';
                break;
        }

        var title = (customTitle && String(customTitle).trim()) ? String(customTitle).trim() : defaultTitle;
        var messageHtml = '';
        messageHtml += '<div style="background:' + backgroundColor + '; color:' + textColor + '">"';
        messageHtml += '<span style="font-weight:bold; font-size:1.4em">' + title + '</span><br>' + msg + '</div>';

        // --- AQUÍ EMPIEZA LA ADAPTACIÓN A MODERN ---
        Ext.toast({
            // En Modern no suele haber título separado, lo unimos con HTML
            message: messageHtml,

            timeout: 2000,

            // Estilos directos al componente (style es válido en Modern para el contenedor)
            style: {
                backgroundColor: backgroundColor,
                color: textColor,
                border: '0px solid ' + backgroundColor,
                borderRadius: '7px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                textAlign: 'center' // Para centrar el texto
            },
            
            bodyStyle: {
                backgroundColor: backgroundColor,
                color: textColor
            },            

            // Animaciones correctas para Modern
            showAnimation: {
                type: 'slideIn',
                direction: 'down',
                duration: 400
            },
            hideAnimation: {
                type: 'slideOut',
                direction: 'up',
                duration: 250
            },

            // Posicionamiento manual para simular "align: 't'" (Top)
            // Si lo quieres abajo, quita 'top' y pon 'bottom: 20'
            top: 50,     
            left: 25,
            right: 25,   // Esto hará que ocupe el ancho menos los márgenes

            // Importante para que el mensaje no se vea aplastado
            minHeight: 70,
            zIndex: 9999 // Asegura que quede encima de todo
        });
    },

    msgSystem: function (type, title, msg, fnConfirm, format, fnCancel) {
        // 1. Configurar los botones manualmente para Modern
        var botones = [];
        var valorRetorno = false;
        
        // Definimos los botones según el tipo
        if (type === 'question') {
            botones = [
                { text: 'Cerrar', itemId: 'no', align: 'left' },
                { text: 'Confirmar', itemId: 'yes', ui: 'action', align: 'right' }
            ];
        } else {
            // Para info, warning, error
            botones = [
                { text: 'Aceptar', itemId: 'ok', ui: 'action', align: 'center' }
            ];
        }

        var anchoMensaje = 400; // Puedes ajustar o dejar null para que sea responsive

        // 2. Ext.Msg.show en Modern
        Ext.Msg.show({
            title: title,
            message: msg,       // En Modern se recomienda 'message' en lugar de 'msg'
            buttons: botones,   // Pasamos el array de botones explícito
            width: format && format.ancho ? format.ancho : anchoMensaje,
            // Eliminamos 'icon', 'buttonText' y 'closable' que causan conflictos o no existen igual

            fn: function (btnId) {
                // btnId será el 'itemId' que definimos arriba ('yes', 'no', 'ok')
                if (btnId == 'yes' || btnId == 'ok') {
                    if (fnConfirm && typeof fnConfirm === 'function') {
                        valorRetorno = true;
                        fnConfirm();
                    }
                } else if (btnId == 'no') {
                    if (fnCancel && typeof fnCancel === 'function') {
                        fnCancel();
                    }
                }
            }
        });

        // 3. ADVERTENCIA: Esto siempre devolverá false.
        // En JS (y Ext JS Modern), la ejecución NO se detiene aquí.
        return valorRetorno; 
    },

    parseHttpError: function (errOrResp) {
        
        var status = 0, statusText = 'Request Failed', respText = '';

        // Caso Ext.Ajax failure(response) o XHR-like
        if (errOrResp && typeof errOrResp.status !== 'undefined') {
            status     = errOrResp.status;
            statusText = errOrResp.statusText || statusText;
            respText   = errOrResp.responseText || '';
        }
        // Caso Ext.data.Operation
        else if (errOrResp && typeof errOrResp.getError === 'function') {
            try {
            var opErr = errOrResp.getError();
            if (opErr && opErr.response) {
                status     = opErr.response.status;
                statusText = opErr.response.statusText || statusText;
                respText   = opErr.response.responseText || '';
            }
            } catch (_) {}
        }

        var code = String(status || 'ERROR');
        var message = statusText;

        if (respText) {
            try {
            var j = Ext.decode(respText);
            if (j) {
                code    = String(j.error || j.code || code);
                message = String(j.message || j.msg || message);
            }
            } catch (_) {}
        }

        // Sugerencia de nivel (ajústala a tu gusto)
        // - 403: 'error' (permisos)
        // - 400-499: 'warning' (fallo del usuario/validación) excepto 401/402/403 -> 'error'
        // - 500+: 'error'
        // - 0: 'error' (red/CORS)
        var level = 'error';
        if (status >= 400 && status < 500) {
            if (status === 401 || status === 402 || status === 403) level = 'error';
            else level = 'warning';
        } else if (status === 0) {
            level = 'error';
        } else if (status >= 500) {
            level = 'error';
        }

        return { status: status, code: code, message: message, level: level };
    },

    showLoadingBox: function (msg, progressText) {
        return Ext.Msg.wait({
            msg: msg || 'Please wait...',
            progressText: progressText || 'Loading data',
        });
    },

    formatDate: function (date) {
        var parts = date.split('-');
        var day = parts[2];
        var month = parts[1];
        var year = parts[0];
        return day + '/' + month + '/' + year;
    },

    handleHttpError: function (errorCode) {
        var errorMessage;

        switch (errorCode) {
            case 400:
                errorMessage = 'La solicitud contiene sintaxis incorrecta o no puede procesarse.';
                break;
            case 401:
                errorMessage = 'No estás autorizado para realizar esta acción. Por favor, inicia sesión.';
                break;
            case 403:
                errorMessage = 'No tienes permiso para acceder a este recurso.';
                break;
            case 404:
                errorMessage = 'Registro/s no encontrado/s.';
                break;
            case 409:
                errorMessage = 'Error de integridad en la base de datos.';
                break;
            case 500:
                errorMessage = 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.';
                break;
            case 601:
                errorMessage = 'la imagen se encuentra en la última posición.';
                break;
            case 602:
                errorMessage = 'La imagen se encuentra en la primera posición.';
                break;
            default:
                errorMessage = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.';
                break;
        }

        this.toastAlert(errorMessage, 'error', true);
    },

    makeRequest: function (method, url, dataJson, successCallback, failureCallback, requiresToken = true) {

        // Configurar la petición
        var requestConfig = {
            url: url,
            method: method,
            timeout: 300000,
            success: function (response) {
                var jsonData = Ext.decode(response.responseText);
                console.info(jsonData);
                if (successCallback && typeof successCallback === 'function') {
                    successCallback(response);
                }
            },
            failure: function (response) {
                var jsonData = null;

                try {
                    jsonData = Ext.decode(response.responseText);
                    console.info(jsonData);
                } catch (e) {
                    console.warn('La respuesta no es un JSON válido:', response.responseText);
                }

                if (failureCallback && typeof failureCallback === 'function') {
                    failureCallback(response);
                }

                if (response.status) {
                    if (jsonData && jsonData.error) {
                        console.info(jsonData.error, 'error', true);
                    } else {
                        console.info('Error HTTP ' + response.status, 'error', true);
                    }
                } else {
                    console.info('Ocurrió un error inesperado.', 'error', true);
                }
            },
            scope: this
        };

        // Si el método es POST o PUT, incluir los datos
        if (method === 'POST' || method === 'PUT') {
            requestConfig.jsonData = dataJson;
            requestConfig.headers = {
                'Content-Type': 'application/json'
            };
        }

        // Verificar si se requiere el token
        if (requiresToken) {
            var token = sessionStorage.getItem('access_token');
            if (token) {
                requestConfig.headers = requestConfig.headers || {};
                requestConfig.headers.Authorization = 'Bearer ' + token;
            } else {
                this.msgSystem('error', 'Permiso denegado', 'Inicie sesión para obtener credenciales válidas.');
                return;
            }
        }

        // Realizar la petición
        Ext.Ajax.request(requestConfig);
    },

    makeFormRequest: function (url, formData, successCallback, failureCallback) {
        //Obtener el token de seguridad de la session storage
        var token = sessionStorage.getItem('access_token');
        var waitMsgBox = Ext.Msg.wait('Cargando...', 'Por favor espere');
        // Configurar la petición
        var requestConfig = {
            url: url,
            method: 'POST',
            success: function (response) {
                waitMsgBox.hide()
                var jsonData = Ext.decode(response.responseText);
                console.info(jsonData);
                if (successCallback && typeof successCallback === 'function') {
                    successCallback(response);
                }
            },
            failure: function (response) {
                waitMsgBox.hide()
                var jsonData = Ext.decode(response.responseText);
                console.info(jsonData);
                if (failureCallback && typeof failureCallback === 'function') {
                    failureCallback(response);
                }
                if (response.status) {
                    this.handleHttpError(response.status);
                } else {
                    console.info('Ocurrió un error inesperado.', 'error', true);
                }
            },
            scope: this,
            headers: {
                'Content-Type': null // Configurar el encabezado Content-Type
            },
        };

        // Crear un objeto FormData y agregar los datos y el archivo
        var formDataObj = new FormData();
        for (var key in formData) {
            formDataObj.append(key, formData[key]);
        }

        // Agregar el objeto FormData a la configuración de la solicitud
        requestConfig.rawData = formData;

        //Agregar el token de seguridad
        if (token) {
            requestConfig.headers = requestConfig.headers || {};
            requestConfig.headers.Authorization = 'Bearer ' + token;
        } else {
            this.msgSystem('error', 'Permiso denegado', 'Inicie sessión para obtener credenciales válidas.');
            return;
        }

        // Enviar la solicitud
        Ext.Ajax.request(requestConfig);

    },

    downloadFile: function (method, url, dataJson, fallbackFilename, requiresToken = true) {
        // Construir headers
        var headers = {};
        if (requiresToken) {
            var token = sessionStorage.getItem('access_token');
            if (token) {
                headers['Authorization'] = 'Bearer ' + token;
            } else {
                this.msgSystem('error', 'Permiso denegado', 'Inicie sesión para obtener credenciales válidas.');
                return;
            }
        }
        if (method === 'POST' || method === 'PUT') {
            headers['Content-Type'] = 'application/json';
        }

        fetch(url, {
            method: method,
            headers: headers,
            body: (method === 'POST' || method === 'PUT') ? JSON.stringify(dataJson) : undefined,
        })
        .then(response => {
            if (!response.ok) throw new Error("No fue posible descargar el archivo.");
            const disposition = response.headers.get("Content-Disposition") || response.headers.get("content-disposition");
            let filename = fallbackFilename || "archivo.pdf";
            // Buscar filename en el header
            if (disposition && disposition.includes("filename=")) {
                // Extraer el nombre entre comillas o después de igual
                let match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match && match[1]) {
                    filename = match[1].replace(/['"]/g, "");
                }
            }
            return response.blob().then(blob => ({ blob, filename }));
        })
        .then(({ blob, filename }) => {
            // Crear link para descargar
            const urlBlob = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = urlBlob;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(urlBlob);
        })
        .catch(error => {
            this.msgSystem('error', 'Descarga fallida', error.message || 'Error inesperado');
            console.error(error);
        });
    },

    refreshPageStore: function (storeName) {
        var store = Ext.getStore(storeName);
        var currentPage = store.currentPage;
        var pageSize = store.pageSize;
        var count = store.getCount();
        var totalCount = store.getTotalCount();

        if (count === 1 && currentPage > 1) {
            store.loadPage(currentPage - 1);
        } else if (totalCount === 1) {
            store.removeAll();
            store.reload();
        } else {
            store.reload();
        }
    },

    reloadStore: function (storeName, cfg) {
        cfg = cfg || {};
        var store = Ext.getStore(storeName);
        if (!store) {
            console.error('reloadStore: Store not found ->', storeName);
            return;
        }

        var page = store.currentPage || 1;

        store.reload({
            callback: function (records, operation, success) {
            if (!success) {
                if (cfg.onFail && typeof cfg.onFail === 'function') {
                cfg.onFail(operation);
                }
                return;
            }

            // Si la recarga dejó la página vacía y no es la primera, retrocede 1
            if (records && records.length === 0 && page > 1) {
                store.loadPage(page - 1, {
                callback: function () {
                    if (cfg.onDone && typeof cfg.onDone === 'function') {
                    cfg.onDone();
                    }
                }
                });
                return;
            }

            if (cfg.onDone && typeof cfg.onDone === 'function') {
                cfg.onDone();
            }
            }
        });
    },


    lockFieldText: function (textFieldId, lock) {
        var textField = Ext.getCmp(textFieldId);

        if (!Ext.isEmpty(textField)) {
            textField.setReadOnly(lock);
        } else {
            return console.log('No se encontro el elemento');
        }
    },

    disableField: function (textFieldId) {
        var textField = Ext.getCmp(textFieldId);

        if (!Ext.isEmpty(textField)) {
            textField.setEditable(false);
        } else {
            return console.log('disableField - No se encontro el elemento');
        }
    },

    enableField: function (textFieldId) {
        var textField = Ext.getCmp(textFieldId);

        if (!Ext.isEmpty(textField)) {
            textField.setEditable(true);
        } else {
            return console.log('enableField - No se encontro el elemento');
        }
    },

    closeWindow: function (nameWindow) {
        var window = Ext.getCmp(nameWindow);

        if (window !== undefined) {
            window.close();
        }
        else {
            console.warn('configForm::No existe la Ventana ' + nameWindow);
        }
    },

    openWindow: function (id, isHide, cfg) {
        var win = Ext.getCmp(id);

        if (isHide) {
            if (win) {
            if (cfg) {
                if (win.setConfig) win.setConfig(cfg);
                else Ext.apply(win, cfg);
                if (win.syncMode) win.syncMode();
            }
            win.show();
            return win;
            }
            win = Ext.create('widget.' + id, Ext.apply({
            id: id,
            closeAction: 'hide'
            }, cfg));
            win.show();
            return win;
        }

        win = Ext.create('widget.' + id, Ext.apply({
            id: id,
            closeAction: 'destroy'
        }, cfg));
        win.show();
        return win;
    },

    focusElement: function (id) {
        var element = Ext.getCmp(id);
        if (element === undefined) {
            console.error('focusElement - No se encontró el Elemento o Componente: ' + id);
            return;
        }
        element.focus(false, 200);
    },

    hideElement: function (id) {
        var element = Ext.getCmp(id);
        if (element !== undefined) {
            element.setVisible(false);
        }
        else {
            console.error('hideElement - No se encontro el elemento ' + id);
        }
    },

    hideTab: function (idTabPanel, idTab) {
        var tabPanel = Ext.getCmp(idTabPanel);

        if (!tabPanel) {
            console.error('hideTab - No se encontro el elemento ' + idTabPanel);
        }

        var tab = tabPanel.getComponent(idTab);

        if (tab) {
            tab.tab.hide();
        } else {
            console.error('hideTab - No se encontro el elemento ' + idTab);
        }
    },

    showElement: function (id) {
        var element = Ext.getCmp(id);
        if (element !== undefined) {
            element.setVisible(true);
        }
        else {
            console.error('showElement - No se encontro el elemento ' + id);
        }
    },

    disableElement: function (id) {
        var element = Ext.getCmp(id);
        if (element !== undefined) {
            element.setDisabled(true);
        } else {
            console.error('disableElement - No se encontró el elemento ' + id);
        }
    },

    enableElement: function (id) {
        var element = Ext.getCmp(id);
        if (element !== undefined) {
            element.setDisabled(false);
        } else {
            console.error('eableElement - No se encontró el elemento ' + id);
        }
    },

    readElementValue: function (elementId, type) {
        var returnValue = "";
        var element = Ext.getCmp(elementId);

        if (element === undefined) {
            console.error('readElementValue:: Element or Component not found: ' + elementId);
            return;
        }


        var elementType = element.getXType ? element.getXType() : element.xtype;

        switch (elementType) {
            case 'datefield':
                returnValue = Ext.getCmp(elementId).getSubmitValue();

                if (type === "DATE") {
                    console.info('returnValue:' + returnValue);

                    var day = returnValue.substring(0, 2);
                    var month = returnValue.substring(3, 5);
                    var year = returnValue.substring(6, 10);

                    returnValue = day + "-" + month + "-" + year;
                }
                break;
            case 'timefield':
                returnValue = Ext.getCmp(elementId).getValue();
                if (returnValue !== undefined) {
                    returnValue = Ext.Date.format(returnValue, 'H:i');
                    returnValue = returnValue.replace(':', '|');
                }
                break;
            case 'radiogroup':
                var radioGroup = Ext.getCmp(elementId).getValue();
                returnValue = radioGroup[elementId];
                break;
            case 'checkbox':
                returnValue = Ext.getCmp(elementId).getValue().toString();
                break;
            case 'label':
                returnValue = Ext.getCmp(elementId).fieldLabel;
                break;
            default:
                returnValue = Ext.getCmp(elementId).getValue();
        }

        if (type === "NUM" && returnValue !== undefined) {
            /* ECRC: Removing numeric format characters */
            returnValue = returnValue.replace("$", "");
            returnValue = returnValue.split(",").join('');

            if (returnValue === '') {
                returnValue = 0;
            }
        }

        if (typeof returnValue == 'string') {
            returnValue = returnValue.replace(/^\s+/, '');
        }
        return returnValue;
    },

    assignElementValue: function (elementId, value) {

        value = this.transformHTMLValue(value);

        let elementValue = value;
        let element = Ext.getCmp(elementId);

        if (element === undefined) {
            console.error('assignElementValue - Component or Element not found: ' + elementId);
            return;
        }

        if (value === 'NULL' ||
            value === undefined ||
            value === null) {
            value = '';
        }

        if (value !== '' || value !== null) {
            if (element.xtype !== 'datefield') {
                if (value !== undefined) {
                    value = Ext.util.Format.htmlDecode(value);
                }
            }
        }

        if (element !== undefined) {
            switch (element.xtype) {
                case 'combobox':
                    element.setValue(value);
                    break;
                case 'textfield':
                    element.setValue(value);
                    break;
                case 'tbtext':
                    element.update(value);
                    break;
                case 'label':
                    element.update(value);
                    break;
                case 'datefield':
                    let dateElement = Ext.getCmp(elementId);

                    if (value !== 'NULL' &&
                        value !== '' &&
                        value !== null &&
                        value !== undefined) {

                        if (typeof (value) == 'object') {
                            dateElement.setValue(value);
                        } else {
                            var valDay = value.substring(0, 2);
                            var valMonth = value.substring(3, 5) - 1;
                            var valYear = value.substring(6, 10);
                            var valDate = new Date(valYear, valMonth, valDay);
                            dateElement.setValue(valDate);
                        }
                    } else {
                        dateElement.setValue(null);
                    }
                    break;
                case 'checkboxfield':
                    if (typeof value === 'string') {
                        var normalizedValue = value.toLowerCase().trim();
                        if (normalizedValue === 'true' || normalizedValue === 'yes' || normalizedValue === 'si') {
                            element.setValue(true);
                        } else {
                            element.setValue(false);
                        }
                    } else if (typeof value === 'boolean') {
                        element.setValue(value);
                    } else {
                        element.setValue(false);
                    }
                    break;
                default:
                    element.setValue(value);
            }
        } else {
            var message = 'assignElementValue::Element with Id or itemId not found in Interface: ' + elementId;
            console.error(message);
        }
    },

    assingWindowTitle: function (windowId, title1, title2) {

        var window = Ext.getCmp(windowId);

        if (window === undefined) {
            console.error('assingWindowTitle - Component or Element not found: ' + windowId);
            return;
        };

        var title = '';

        if (title1) {
            title = title1;
            if (title2) {
                title += ': ' + title2;
            }
        } else {
            console.error('assignWindowTitle - title not found');
            return;
        }

        window.setTitle(title)
    },

    transformHTMLValue: function (text, prepareToSend) {
        var literalCodes = [
            { literal: '&', code: "%26" },
            { literal: "'", code: "%27" },
            { literal: ":", code: "%3A" },
            { literal: ".", code: "%2E" },
            { literal: ",", code: "%2C" },
            { literal: '"', code: "%22" },
            { literal: ';', code: "%3B" },
            { literal: '<', code: "%3C" },
            { literal: '>', code: "%3E" },
            { literal: '/', code: "%2F" },
            { literal: "\\", code: "%5C" }
        ];

        if (text === undefined || text === null) {
            return '';
        }

        text = text.toString();

        if (prepareToSend !== undefined) {
            for (var i = 0; i < literalCodes.length; i++) {
                var htmlCode = literalCodes[i].code;
                var htmlLiteral = literalCodes[i].literal;
                text = text.split(htmlLiteral).join(htmlCode);
            }
        } else {
            for (var i = 0; i < literalCodes.length; i++) {
                var htmlCode = literalCodes[i].code;
                var htmlLiteral = literalCodes[i].literal;
                text = text.split(htmlCode).join(htmlLiteral);
            }
        }

        var encodeText = encodeURI(text);
        var decodeText = decodeURI(encodeText);
        return decodeText;
    },

    loadComboData: function (comboId, data, additionalFields) {
        var combo = Ext.getCmp(comboId);
        if (combo === undefined) {
            console.error('loadComboData - Component or Element not found: ' + comboId);
            return;
        }

        if (!data.columns.includes("Sin informacion")) {
            data.columns.push("Sin informacion");
        }
        var columnsCopy = data.columns.slice();

        if (additionalFields) {
            columnsCopy.unshift(...Object.keys(additionalFields));
        }

        var storeCombo = Ext.create('Ext.data.Store', {
            fields: ['text', 'value'],
            data: columnsCopy.map(function (column) {
                return { text: column, value: column };
            })
        });
        combo.setStore(storeCombo);
    },

    loadImage: function (src) {
        var url = protocol + '://' + ipAddress + port + '/images/';
        return Ext.define('MyApp.view.MyImage', {
            extend: 'Ext.Img',
            alias: 'widget.myimage',

            config: {
                height: 200,
                id: 'galimage',
                src: url + src
            }
        });
    },

    loadTinyImage: function (src) {
        var url = protocol + '://' + ipAddress + port + '/images/';
        return Ext.create('Ext.Img', {
            height: 75,
            id: src,
            src: url + src
        });
    },

    saveDataSS: function (key, value) {
        sessionStorage.setItem(key, value);
    },

    saveDataObjSS: function (group, key, value) {
        let data = JSON.parse(sessionStorage.getItem(group)) || {};
        data[key] = value;
        sessionStorage.setItem(group, JSON.stringify(data));
    },

    getDataSS: function (key) {
        return sessionStorage.getItem(key);
    },

    getDataObjSS: function (group, key) {
        let data = JSON.parse(sessionStorage.getItem(group));
        return data ? data[key] : null;
    },

    getPriceWithIncrement: function (price) {

        // Convertir el precio a flotante
        price = parseFloat(price);

        // Obtener los valores del sessionStorage
        const incLv1 = this.getDataObjSS('TMP_CFG_PRODUCT', 'PRM_PRICE_INC_LV1');
        const incLv2 = this.getDataObjSS('TMP_CFG_PRODUCT', 'PRM_PRICE_INC_LV2');
        const incLv3 = this.getDataObjSS('TMP_CFG_PRODUCT', 'PRM_PRICE_INC_LV3');

        if (isNaN(price)) {
            this.toastAlert('Precio no válido', 'error');
            return;
        }

        // Verificar que los valores existan
        if (incLv1 === null || incLv2 === null || incLv3 === null) {
            this.toastAlert('Error al encontrar el parámetro, vuelva a iniciar sesión', 'error');
            return;
        }

        // Aplicar el incremento según el precio
        let newPrice;
        if (price >= 0 && price <= 100) {
            newPrice = price + (price * incLv1 / 100);
        } else if (price > 100 && price <= 3500) {
            newPrice = price + (price * incLv2 / 100);
        } else if (price > 3500) {
            newPrice = price + (price * incLv3 / 100);
        } else {
            this.toastAlert('Precio fuera de rango', 'error');
            return;
        }

        return Math.round(newPrice * 100) / 100;
    },

    addAuthorizationHeader: function (store) {
        var token = sessionStorage.getItem('access_token');
        if (token) {
            store.getProxy().setHeaders({
                'Authorization': 'Bearer ' + token
            });
        } else {
            console.error('No security token available');
            try { sessionStorage.clear(); } catch (e) {}
            window.location.replace('../basicAccess/index.html');
            return false;
        }
    },

    setInterface: function (grid) {
        Ext.getCmp('formBase').updateLayout();
        var alturaBody = Ext.getBody().getViewSize().height;
        alturaBody = alturaBody - 60;

        Ext.getCmp(grid).setHeight(alturaBody);
    },

    setInterface_product: function (grid) {
        Ext.getCmp('formBase').updateLayout();
        var alturaBody = Ext.getBody().getViewSize().height;
        alturaBody = alturaBody - 95;

        Ext.getCmp(grid).setHeight(alturaBody);
    },

    loadStore: function (storeName, param) {
        var store = Ext.getStore(storeName);
        if (param !== null && param !== undefined && param !== '') {
            store.onLoad(store, param)
        } else {
            store.onLoad(store);
        }
    },

    reloadStore: function (storeName) {

        // Obtebner el store a través del nombre
        var store = Ext.getStore(storeName);

        // Obtén los parámetros actuales del store
        var extraParams = store.getProxy().getExtraParams();
        var currentPage = store.currentPage;

        // Recarga el store con los mismos parámetros
        store.load({
            params: extraParams,
            callback: function () {
                // Vuelve a la página actual después de recargar
                store.loadPage(currentPage);
            }
        });
    },

    cleanStore: function (storeName) {
        var store = Ext.getStore(storeName);
        if (store) {
            store.removeAll();
        } else {
            msg = 'No existe el store: ' + storeName;
            this.toastAlert(msg, 'error')
        }
    },

    setButtonTextAndIcon: function (buttonId, text, icon) {
        var button = Ext.getCmp(buttonId);

        if (!button) {
            console.warn('El botón con ID "' + buttonId + '" no se encontró.');
            return;
        }

        if (text !== null && text !== undefined && text !== '') {
            button.setText(text)
        }
        if (icon !== null && icon !== undefined && icon !== '') {
            button.setIconCls(icon)
        }
    },

    showImageWindow: function (imageUrl, fallbackUrl, title) {
        const img = new Image();

        img.onload = function () {
            const maxWidth = 800;
            const maxHeight = 600;

            let width = img.width;
            let height = img.height;
            const aspectRatio = width / height;

            if (width > maxWidth) {
                width = maxWidth;
                height = width / aspectRatio;
            }

            if (height > maxHeight) {
                height = maxHeight;
                width = height * aspectRatio;
            }

            Ext.create('Ext.window.Window', {
                title: title || 'Vista de Imagen',
                modal: true,
                resizable: false,
                width: width + 20,
                height: height + 60,
                layout: 'fit',
                items: [{
                    xtype: 'component',
                    autoEl: {
                        tag: 'img',
                        src: imageUrl,
                        style: 'width: 100%; height: 100%; object-fit: contain;',
                        onerror: `this.onerror=null; this.src='${fallbackUrl}'`
                    }
                }]
            }).show();
        };

        img.onerror = function () {
            Ext.create('Ext.window.Window', {
                title: title || 'Imagen no disponible',
                modal: true,
                width: 300,
                height: 300,
                layout: 'fit',
                items: [{
                    xtype: 'component',
                    autoEl: {
                        tag: 'img',
                        src: fallbackUrl,
                        style: 'width: 100%; height: 100%; object-fit: contain;'
                    }
                }]
            }).show();
        };

        img.src = imageUrl;
    },

    closeActiveApp: function () {
        var panel = Ext.getCmp('panelActividades');
        console.log(Ext.getCmp('panelActividades'));
        console.log(Ext.getCmp('pnlNotifications'));
        if (!panel) return;
        console.log('2');
        Ext.suspendLayouts();

        // 1) Asegura tarjetas base (botones + iframe)
        var ensured = ensureActivitiesCards(panel); // { btnsCt, frame }

        // 2) Limpia el iframe
        var el = ensured.frame.getEl && ensured.frame.getEl();
        if (el && el.dom && el.dom.tagName === 'IFRAME') {
            el.dom.src = 'about:blank';
            el.dom.removeAttribute('srcdoc');
            console.log('3');
        }

        // 3) Activa la tarjeta de botones
        var ly = panel.getLayout();
        if (ly && ly.setActiveItem) {
            ly.setActiveItem(ensured.btnsCt);
        }

        // 4) Restaura UI base
        if (window.jsTerian && typeof jsTerian.showElement === 'function') {
            jsTerian.showElement('treePanelMenu');
            jsTerian.showElement('formEncabezado');
            jsTerian.showElement('panelGrupoActividades');
        } else {
            ['treePanelMenu','formEncabezado','panelGrupoActividades'].forEach(function(id){
                var cmp = Ext.getCmp(id); if (cmp) cmp.show();
            });
        }

        var notif = Ext.getCmp('pnlNotifications');
        if (notif && notif.collapsed) notif.expand();

        Ext.resumeLayouts(true);

        if (Ext.toast) Ext.toast('Aplicación cerrada. Vista inicial restaurada.');
    },

    vTypes: function() {
        // Reglas globales reutilizables
        Ext.apply(Ext.form.VTypes, {

            // Nombre (letras, acentos, espacios, apóstrofe, guion corto)
            namex: function(v) {
                return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'’-]+$/.test((v || '').trim());
            },
            namexText: 'Sólo letras, espacios, acentos, apóstrofe y guion.',
            
            // Nombre de personas morales (letras, números, espacios, acentos, apóstrofe, guion, punto, coma y &)
            companyx: function (v) {
                v = (v || '').trim();
                return /^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ\s'’\-&.,]+$/.test(v);
            },
            companyxText: 'Sólo letras, números, espacios, acentos, apóstrofe, guion, punto, coma y &.',

            skuDescx: function (v) {
                v = (v || '').trim();
                if (v === '') return true;
                return /^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ\s.,'"°º\/+\-_=#()&%:;]+$/.test(v);
            },
            skuDescxText: 'Sólo letras (incluye acentos), números, espacios y algunos símbolos.',

            // Teléfono MX: exactamente 10 dígitos (sin +52); ajusta si aceptas más
            phonemx: function(v) {
                return /^\d{10}$/.test((v || '').trim());
            },
            phonemxText: 'Debe contener 10 dígitos (ej. 5551234567).',

            // RFC MX (persona física o moral): 3-4 letras (incluye Ñ y &), 6 dígitos de fecha, 3 homoclave alfanum.
            rfcmx: function(v) {
                v = (v || '').toUpperCase().trim();
                if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(v)) return false;

                // Validación rápida de la fecha (posición 4-9 para PM, 5-10 para PF)
                var isMoral = /^[A-ZÑ&]{3}\d/.test(v); // 3 letras = moral, 4 = física
                var y = parseInt(v.substr(isMoral ? 3 : 4, 2), 10);
                var m = parseInt(v.substr(isMoral ? 5 : 6, 2), 10);
                var d = parseInt(v.substr(isMoral ? 7 : 8, 2), 10);
                if (m < 1 || m > 12 || d < 1 || d > 31) return false;
                return true;
            },
            rfcmxText: 'RFC inválido. Formato esperado: ABCDYYMMDDXXX (letras/ñ/& + fecha + homoclave).'
        });
    },

    // 1. Descargar Archivo (Fuerza la descarga)
    downloadAsset: function(record) {
        var url = record.get('url'); // Asumiendo que 'url' es la ruta al archivo
        var link = document.createElement('a');
        link.href = url;
        // El atributo download sugiere al navegador bajarlo en vez de abrirlo
        link.download = record.get('name') || 'descarga'; 
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // 2. Enviar por Email
    sendByEmail: function(record) {
        var subject = encodeURIComponent("Compartiendo recurso: " + record.get('name'));
        var body = encodeURIComponent("Hola,\n\nTe comparto este archivo de Terian:\n" + record.get('url'));
        window.location.href = "mailto:?subject=" + subject + "&body=" + body;
    },

    // 3. Enviar por WhatsApp
    sendToWhatsApp: function(record) {
        console.info('sendToWhatsApp');
        
        var subject = encodeURIComponent("Compartiendo recurso: " + record.get('name'));
        var messageWS = "> " + codEmpresa + " \n" + 
                        "*" + record.get('text') + "*\n" + 
                        "```" + jsTerian.makeUrl('asset/download',record.data.id_asset) + '```';
        var urlAsset = encodeURIComponent(messageWS);
        
        urlAsset = urlAsset.replace("///", "//");
        
        console.info('urlAsset:',urlAsset);
        
        // Usamos api.whatsapp.com para máxima compatibilidad (móvil y web)
        window.open('https://api.whatsapp.com/send?text=' + urlAsset, '_blank');
    },

    // 4. Copiar Link (Attach)
    copyLinkToClipboard: function(record) {
        var url = record.get('url');

        // API moderna del portapapeles (funciona en S20+ y navegadores actuales)
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function() {
                Ext.toast('Enlace copiado al portapapeles', 2000);
            }, function(err) {
                Ext.toast('No se pudo copiar el enlace', 2000);
            });
        } else {
            // Fallback antiguo si fuera necesario
            Ext.Msg.alert('Enlace', url);
        }
    },
    getFileExtension: function(filaNameExt){
        // Extraemos la parte después del último punto
        const extension = filaNameExt.slice(((filaNameExt.lastIndexOf(".") - 1) >>> 0) + 2);

        return extension.toUpperCase();
    }    
    
};

