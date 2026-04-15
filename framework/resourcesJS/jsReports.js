const jsReports = (function() {

    /**
     * Función PRIVADA: Convierte una imagen a Base64 (PNG) 
     * y devuelve sus dimensiones originales para calcular el Aspect Ratio
     */
    async function getUrlAsPngBase64(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous'; 
            img.onload = () => {
                const canvas = document.createElement('canvas');
                // Tomamos las dimensiones reales de la imagen
                const originalWidth = img.width || 200; 
                const originalHeight = img.height || 100;
                
                canvas.width = originalWidth; 
                canvas.height = originalHeight;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Devolvemos un objeto con el Base64 y sus dimensiones
                resolve({
                    base64: canvas.toDataURL('image/png'),
                    width: originalWidth,
                    height: originalHeight
                });
            };
            img.onerror = () => reject(new Error('Error al cargar la imagen.'));
            img.src = url;
        });
    }

    return {
        /**
         * Función PÚBLICA: Genera y descarga el reporte en Excel
         */
        async generarReporteExcel(msg, logoUrl, companyName, reportName) {
            try {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Reporte');

                // 1. Procesar logotipo y obtener dimensiones
                let logoData = null;
                try {
                    logoData = await getUrlAsPngBase64(logoUrl);
                } catch (e) {
                    console.warn("Logo no cargado. Reporte sin imagen.", e);
                }

                // 2. Insertar logotipo manteniendo la relación de aspecto
                if (logoData && logoData.base64) {
                    // Definimos un alto máximo deseado para el logo en el Excel (ej. 60px)
                    const targetHeight = 60; 
                    // Calculamos el ancho proporcional
                    const aspectRatio = logoData.width / logoData.height;
                    const targetWidth = targetHeight * aspectRatio;

                    const logoId = workbook.addImage({ base64: logoData.base64, extension: 'png' });
                    worksheet.addImage(logoId, {
                        tl: { col: 0, row: 0 },
                        ext: { width: targetWidth, height: targetHeight }
                    });
                }

                // 3. Encabezados (Movidos a la columna B)
                const fechaEjecucion = new Date().toLocaleString('es-MX');
                
                worksheet.getCell('B1').value = companyName;
                worksheet.getCell('B1').font = { size: 14, bold: true };
                
                worksheet.getCell('B2').value = reportName;
                worksheet.getCell('B2').font = { size: 12, bold: true, color: { argb: 'FF555555' } };
                
                worksheet.getCell('B3').value = `Fecha de Ejecución: ${fechaEjecucion}`;
                worksheet.getCell('B3').font = { size: 10, italic: true };

                // 4. Configurar columnas de datos
                worksheet.columns = [
                    { header: 'Empresa', key: 'company', width: 25 },
                    { header: 'Puesto', key: 'job_title', width: 25 }, 
                    { header: 'Nombre del Prospecto', key: 'name', width: 25 },
                    { header: 'Correo del Prospecto', key: 'email', width: 30 },
                    { header: 'Teléfono', key: 'telephone', width: 15 }, 
                    { header: 'Notas', key: 'notes', width: 40 },        
                    { header: 'Estatus', key: 'status', width: 15 },
                    { header: 'Nombres de Usuarios', key: 'users_names', width: 35 },
                    { header: 'Correos de Usuarios', key: 'users_emails', width: 40 },
                    { header: 'Fecha de Creación', key: 'created_at', width: 25 }
                ];

                // Limpiar fila 1 que toma por defecto el header
                worksheet.getRow(1).values = []; 
                
                // 5. Insertar encabezados de la tabla en la FILA 5 (dejando la 4 vacía)
                const headerRow = worksheet.getRow(5);
                headerRow.values = [
                    'Empresa', 
                    'Puesto', 
                    'Nombre del Prospecto', 
                    'Correo del Prospecto', 
                    'Teléfono', 
                    'Notas', 
                    'Estatus', 
                    'Nombres de Usuarios', 
                    'Correos de Usuarios', 
                    'Fecha de Creación'
                ];
                
                headerRow.eachCell((cell) => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004080' } };
                    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                });

                // 6. Poblar datos
                const prospectos = msg.prospects || [];
                
                prospectos.forEach((prospect, index) => {
                    const usuariosArray = prospect.users || [];
                    const usersNamesStr = usuariosArray.length > 0 ? usuariosArray.map(u => u.name || 'Sin nombre').join('\n') : 'N/A';
                    const usersEmailsStr = usuariosArray.length > 0 ? usuariosArray.map(u => u.email || 'Sin correo').join('\n') : 'N/A';

                    const row = worksheet.addRow({
                        company: prospect.company,
                        job_title: prospect.job_title || 'N/A',
                        name: prospect.name,
                        email: prospect.email || 'N/A',
                        telephone: prospect.telephone || 'N/A',
                        notes: prospect.notes || '',
                        status: prospect.is_active ? 'Activo' : 'Inactivo',
                        users_names: usersNamesStr,
                        users_emails: usersEmailsStr,
                        created_at: new Date(prospect.created_at).toLocaleString('es-MX')
                    });

                    // WrapText
                    row.getCell('users_names').alignment = { wrapText: true, vertical: 'top' };
                    row.getCell('users_emails').alignment = { wrapText: true, vertical: 'top' };
                    row.getCell('notes').alignment = { wrapText: true, vertical: 'top' }; 

                    if (index % 2 === 0) {
                        row.eachCell((cell) => {
                            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
                        });
                    }
                });

                // 7. Generar archivo
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const fileName = `${reportName.replace(/\s+/g, '_')}_${new Date().getTime()}.xlsx`;
                saveAs(blob, fileName);

            } catch (error) {
                console.error("Error al generar el documento Excel:", error);
            }
        }
    };
})();