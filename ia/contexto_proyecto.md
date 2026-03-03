# Contexto del Proyecto DAM (FrontEnd)

Este documento registra el ecosistema y estado actual del proyecto para referencia futura en interacciones con asistentes de IA (como Antigravity).

## Arquitectura Principal
- **Framework:** ExtJS versión 7.1 Modern Toolkit (Tema Triton).
- **Herramienta de Construcción:** Proyectos `.xds` creados con Sencha Architect 4.2.7.
- **Estructura Modular:** El código NO es un SPA (Single Page Application) único, sino un ecosistema de **micro-aplicaciones independientes**.
- **Directorio base del código:** `dam/web/app/`

### Submódulos Identificados
Cada subcarpeta es un proyecto de Sencha Architect independiente con su propia estructura MVC:
- **Core / Administrativos:** `basicAccess`, `basicRole`, `basicTemplate`, `basicUser`.
- **Negocio (DAM):** `damProspect`, `damResource`, `damSearch`, `damWorkspace`.
- **Punto de Entrada / Portal:** `damWorkspace/index.html`.
- **Respaldos:** Históricos de versiones guardados comúnmente en la carpeta `_cabinet`.

## Componentes Compartidos y Lógica
- **Configuración Global:** `dam/web/app/configSystem.js` define las variables globales del sistema, incluyendo la ruta de conexión al backend (`192.168.100.179:5001`).
- **Helpers de Red:** Gran parte del FrontEnd no utiliza los proxies integrados de ExtJS. En su lugar, depende fuertemente de los utilitarios en `framework/recursosJS/jsTerian.js` y `configuraciones de jsDam` para realizar las operaciones `GET`, `POST`, `PUT`, `DELETE`.
- **Gestor de Previsualización:** Extensa lógica personalizada incrustada en las vistas de los componentes (particularmente en `damWorkspace`) para invocar iframes. Los documentos de Microsoft Office se visualizan a través del visor web gratuito (view.officeapps.live.com).
- **Librerías de Terceros Clave:** `iziToast` para alertas, `FontAwesome` para la iconografía, dependencias que residen en `webapps/framework/plugins`.

## Limpieza de Repositorio (Marzo 2026)
Se realizó un análisis de dependencias estáticas en el directorio `webapps/framework`, removiendo todo código "muerto" no utilizado en importaciones ni archivos `.css`:
- **Carpetas innecesarias eliminadas:** `extjs-touch` (tecnología obsoleta), `extjs-7.1` (toolkit clásico ignorado a favor del toolkit modern), `documentacion`, `media`, `recursosFonts`, `resourcesMedia` y `snapshots`.
- **Carpetas requeridas mantenidas:** `ambiente`, `extjs-7.1-modern`, `plugins`, `recursosCSS`, `recursosIMG`, `recursosJS`, `resourcesCSS`, `resourcesJS`.
