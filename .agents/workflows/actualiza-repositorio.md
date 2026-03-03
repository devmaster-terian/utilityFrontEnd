---
description: Comando "Actualiza Repositorio" para sincronizar código en Git.
---

# Workflow: Actualiza Repositorio

Sigue al pie de la letra estas instrucciones cuando el usuario escriba la instrucción "Actualiza Repositorio" o variaciones similares para subir cambios a Git.

1. **Verificación de Mensaje de Commit:**
   Revisa si el usuario indicó explícitamente un mensaje de commit en su instrucción actual.
   * Si **NO** indicó un mensaje: **Detente inmediatamente**. No inicies el proceso. Pídele al usuario que te indique el mensaje (Por ejemplo: *"Por favor, indícame el mensaje de carga a Git para poder iniciar el proceso"*).
   * Si **SÍ** te dio el mensaje: Procede con los siguientes pasos de Git.

2. **Descarga cambios del repositorio remoto:**
   Asegúrate de traer los cambios más recientes antes de subir los tuyos.
   ```bash
   git pull origin main
   ```
   // turbo

3. **Agrega los archivos modificados:**
   ```bash
   git add .
   ```
   // turbo

4. **Crea el commit:**
   Ejecuta el commit reemplazando el texto por el mensaje que el usuario te proporcionó en el prompt.
   ```bash
   git commit -m "Mensaje provisto por el usuario"
   ```
   // turbo

5. **Sube los cambios a GitHub:**
   ```bash
   git push -u origin main
   ```
   // turbo
