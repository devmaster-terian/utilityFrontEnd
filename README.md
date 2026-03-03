# Utility DAM FrontEnd

Este repositorio contiene el código fuente del FrontEnd del proyecto **Utility DAM**, desarrollado por **Terian / Devmaster**. Es una plataforma web estructurada de manera modular para la gestión de acceso, roles, recursos y búsquedas del sistema.

## 🛠️ Tecnologías Utilizadas

*   **Framework Principal:** ExtJS 7.1 (Modern Toolkit, Tema Triton)
*   **Herramienta Visual:** Sencha Architect 4.2.7
*   **Iconografía:** FontAwesome (v5 y v7)
*   **Alertas y UI:** iziToast
*   **Lectura de Documentos:** PDF.js y visor de Microsoft Office embebido.

## 🏗️ Arquitectura del Sistema

Esta aplicación FrontEnd está diseñada para funcionar en conjunto con una arquitectura Backend robusta en Python:

*   **Backend API:** Construido con Python **Flask** y servido mediante **Gunicorn**.
*   **Servidor Web / Proxy:** **Nginx** se encarga de servir todos estos archivos estáticos del FrontEnd y actúa como proxy inverso hacia Gunicorn para las peticiones API.

### Modularidad (Micro-Aplicaciones)
El código **no** es un SPA monolítico. Se divide en varios proyectos independientes de Sencha Architect ubicados en `dam/web/app/`, facilitando el mantenimiento y despliegue por componentes:

*   **Administrativos:** `basicAccess` (Login), `basicRole`, `basicUser`, `basicTemplate`.
*   **Gestión DAM:** `damWorkspace` (Portal Principal), `damSearch`, `damResource`, `damProspect`.

### Configuración y Peticiones API
*   Las variables globales de conexión (IP, puertos) se definen en `dam/web/app/configSystem.js`.
*   Las peticiones HTTP (`GET`, `POST`, `PUT`, `DELETE`) hacia Flask no usan los *proxies* por defecto de ExtJS, sino que están centralizadas a través de un helper customizado llamado `jsTerian.js` ubicado en `framework/recursosJS/`.

## ⚙️ Estructura de Directorios

```text
├── dam/
│   └── web/
│       └── app/
│           ├── basicAccess/   # Módulo de Login
│           ├── damWorkspace/  # Workspace Principal
│           ├── configSystem.js# Variables de entorno
│           └── ... (otros submódulos MVC)
├── framework/
│   ├── ambiente/              # Assets específicos del cliente/entorno
│   ├── extjs-7.1-modern/      # Core de Sencha ExtJS
│   ├── plugins/               # Librerías de terceros (FontAwesome, pdfjs, iziToast)
│   ├── recursosCSS/           # Estilos globales y utilitarios
│   ├── recursosJS/            # Scripts globales (jsTerian.js)
│   └── ...
├── ia/                        # Contexto del repositorio para la IA (Antigravity)
└── .gitignore                 # Reglas de exclusión para Git y Sencha
```

## 🚀 Flujo de Trabajo y Despliegue

1.  **Desarrollo:** El diseño de vistas, controladores y modelos se mantiene activamente desde el software **Sencha Architect**. Los archivos `.xds` dirigen la estructura de cada módulo.
2.  **Mantenimiento:** Herramientas de Inteligencia Artificial (AI Assistants o Antigravity) pueden utilizarse para tareas de refactorización general directamente sobre los controladores generados o los scripts ubicados en `framework/`.
3.  **Producción:** La carpeta completa se sube al servidor donde **Nginx** la servirá directamente a los clientes como contenido estático.
