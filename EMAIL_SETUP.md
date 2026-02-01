# Configuración de Notificaciones por Email

## 📧 Sistema de Emails Implementado

El sistema envía emails automáticos a los clientes para:

1. ✅ **Confirmación de orden** - Cuando se crea una orden nueva
2. 📦 **Cambios de estado** - Cuando el admin/cajero actualiza el estado
3. 🔍 **Link de seguimiento** - Para rastrear la orden en tiempo real

## 🎯 Características

### Email de Confirmación
- Se envía inmediatamente al crear la orden
- Incluye número de orden
- Detalle de productos y total
- Link de seguimiento
- Información de entrega

### Email de Cambio de Estado
- Se envía cuando cambia el estado de la orden
- Estados notificados:
  - ⏳ Pendiente → 👍 Aceptada
  - 👍 Aceptada → 👨‍🍳 En Preparación
  - 👨‍🍳 En Preparación → ✅ Lista
  - ✅ Lista → 🎉 Entregada
  - ❌ Rechazada
  - 🚫 Cancelada
- Cada estado tiene su propio diseño y mensaje

## 🚀 Configuración con Gmail (Recomendado)

### Paso 1: Habilitar Verificación en 2 Pasos

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. En el menú izquierdo, selecciona **Seguridad**
3. En "Acceso a Google", habilita **Verificación en 2 pasos**
4. Sigue los pasos para configurarla (SMS, llamada, o app)

### Paso 2: Generar Contraseña de Aplicación

1. Una vez habilitada la verificación en 2 pasos, ve a:
   https://myaccount.google.com/apppasswords

2. En "Seleccionar app", elige **Correo**

3. En "Seleccionar dispositivo", elige **Otro (nombre personalizado)**

4. Escribe: **TabacWeb Notificaciones**

5. Click en **GENERAR**

6. Google te mostrará una contraseña de 16 caracteres (ejemplo: `abcd efgh ijkl mnop`)

7. **⚠️ COPIA ESTA CONTRASEÑA** (sin espacios: `abcdefghijklmnop`)

### Paso 3: Configurar en el Backend

1. Abre el archivo `.env` en la carpeta `backend`

2. Actualiza estas líneas:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

3. Guarda el archivo

4. **Reinicia el servidor backend** (Ctrl+C y luego `npm start`)

### Paso 4: Probar

1. Crea una orden de prueba desde el frontend
2. Usa un email real al que tengas acceso
3. Deberías recibir el email de confirmación

## 📝 Modo de Prueba (Sin Configuración)

Si no configuras `EMAIL_USER` y `EMAIL_PASSWORD`, el sistema funcionará en **modo de prueba**:

- ✅ La orden se crea normalmente
- ✅ Las notificaciones WebSocket funcionan
- ℹ️ Los emails NO se envían
- 📋 Los logs muestran qué email se enviaría:

```
📧 [MODO PRUEBA] Email que se enviaría:
   Para: cliente@example.com
   Asunto: Tu orden #1234 ha sido recibida
   Link de seguimiento: http://localhost:5173/orden-tracking/1234
```

## 🔧 Otras Opciones de Email

### Outlook/Hotmail

```env
EMAIL_SERVICE=hotmail
EMAIL_USER=tu_email@outlook.com
EMAIL_PASSWORD=tu_contraseña
```

### SMTP Personalizado

```env
EMAIL_SERVICE=custom
EMAIL_HOST=smtp.tuservidor.com
EMAIL_PORT=587
EMAIL_USER=tu_email@tudominio.com
EMAIL_PASSWORD=tu_contraseña
```

## ✅ Validación de Emails

El sistema valida automáticamente el formato del email antes de enviar:

- ✅ `cliente@gmail.com` → Válido
- ✅ `usuario.nombre@empresa.com.ar` → Válido
- ❌ `cliente@` → Inválido (no se envía)
- ❌ `cliente` → Inválido (no se envía)
- ❌ `@gmail.com` → Inválido (no se envía)

Si el email es inválido:
- La orden se crea igual
- No se envía el email
- Se registra en logs: `⚠️ Email inválido, no se enviará notificación`

## 📊 Logs del Sistema

Cada acción de email genera logs para debugging:

```
✅ Email de confirmación enviado: <message-id>
❌ Error enviando email: [detalle del error]
📧 [MODO PRUEBA] Email que se enviaría: ...
```

## 🎨 Diseño de los Emails

Los emails tienen:
- 📱 Diseño responsive (se ve bien en móvil y desktop)
- 🎨 Colores corporativos (naranja #ff6b00)
- 📧 HTML profesional
- 🔗 Botones llamativos
- 📦 Resumen visual de la orden

## 🔒 Seguridad

### ⚠️ IMPORTANTE: No Compartir Credenciales

- ✅ El archivo `.env` está en `.gitignore`
- ✅ Nunca subas tu `.env` a GitHub
- ✅ Usa contraseñas de aplicación (no tu contraseña real)
- ✅ Cada desarrollador debe tener su propio `.env`

### Revocar Acceso

Si crees que tu contraseña de aplicación fue comprometida:

1. Ve a: https://myaccount.google.com/apppasswords
2. Busca "TabacWeb Notificaciones"
3. Click en **Eliminar**
4. Genera una nueva

## 🐛 Solución de Problemas

### "Error enviando email: Invalid login"
- **Causa**: Email o contraseña incorrectos
- **Solución**: Verifica que copiaste bien la contraseña de aplicación

### "Error enviando email: 535 Authentication failed"
- **Causa**: No habilitaste verificación en 2 pasos
- **Solución**: Sigue el Paso 1 de la configuración

### No llegan los emails
1. Verifica que el servidor backend esté corriendo
2. Revisa los logs: `✅ Email de confirmación enviado`
3. Revisa la carpeta de SPAM del email
4. Verifica que el email del cliente sea válido

### "Error: getaddrinfo ENOTFOUND smtp.gmail.com"
- **Causa**: Sin conexión a internet
- **Solución**: Verifica tu conexión

## 📈 Mejoras Futuras

- [ ] Templates de email personalizables
- [ ] Emails HTML más elaborados con imágenes
- [ ] Notificaciones SMS (Twilio)
- [ ] Webhooks para integrar con otros sistemas
- [ ] Analytics de emails (tasa de apertura)
- [ ] Emails en diferentes idiomas

## ✅ Checklist de Configuración

### Para Desarrollo (Opcional)
- [ ] Modo prueba activado (sin EMAIL_USER)
- [ ] Logs visibles en consola
- [ ] Órdenes se crean correctamente

### Para Producción (Recomendado)
- [ ] Cuenta de Gmail configurada
- [ ] Verificación en 2 pasos activada
- [ ] Contraseña de aplicación generada
- [ ] Variables en `.env` configuradas
- [ ] Servidor reiniciado
- [ ] Email de prueba enviado y recibido
- [ ] Verificar carpeta SPAM
- [ ] Emails con diseño correcto

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs del backend
2. Verifica la configuración en `.env`
3. Prueba con otro email
4. Consulta la documentación de Nodemailer: https://nodemailer.com/

---

**Nota**: El sistema funciona perfectamente SIN configurar emails. Los emails son una característica opcional que mejora la experiencia del cliente.
