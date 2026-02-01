# Recuperación de Contraseña

Si olvidaste la contraseña del administrador, puedes recuperarla usando los siguientes scripts:

## 1. Listar todos los usuarios

Para ver todos los usuarios registrados en el sistema:

```bash
cd backend
node listUsers.js
```

O usando npm:
```bash
npm run list-users
```

Esto mostrará:
- Nombre
- Email
- Rol
- ID
- Fecha de creación

## 2. Resetear contraseña

Para cambiar la contraseña de cualquier usuario:

```bash
cd backend
node resetAdminPassword.js <email> <nueva-contraseña>
```

### Ejemplos:

```bash
# Resetear contraseña del admin
node resetAdminPassword.js admin@tabac.com miNuevaContraseña123

# Usando npm script
npm run reset-password admin@tabac.com miNuevaContraseña123
```

### Requisitos:
- La nueva contraseña debe tener **al menos 6 caracteres**
- Debes conocer el **email** del usuario
- El script se conecta a la base de datos automáticamente

## 3. Crear nuevo admin (si no existe ninguno)

Si no tienes ningún usuario admin, puedes usar el script `createAdmin.js`:

```bash
cd backend
node createAdmin.js
```

Este script creará un usuario admin por defecto con:
- Email: admin@tabac.com
- Contraseña: admin123

## Notas de seguridad:

⚠️ **Importante:**
- Cambia la contraseña por defecto inmediatamente después de iniciar sesión
- No compartas las credenciales
- Usa contraseñas seguras (mínimo 8 caracteres, combina letras, números y símbolos)
- Estos scripts solo funcionan desde el servidor con acceso directo a la base de datos

## Troubleshooting:

Si obtienes un error de conexión:
1. Verifica que el archivo `.env` tenga la variable `MONGO_URI` configurada
2. Asegúrate de que MongoDB esté corriendo
3. Verifica que las credenciales de MongoDB sean correctas
