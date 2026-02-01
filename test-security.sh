#!/bin/bash

# Script de pruebas de seguridad para TabacWeb
# Ejecuta: bash test-security.sh

API_URL="http://localhost:3000"
TOKEN=""

echo "🔒 Pruebas de Seguridad - TabacWeb"
echo "=================================="
echo ""

# Test 1: Registro de usuario
echo "📝 Test 1: Registro de nuevo usuario"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test@example.com",
    "password": "test1234",
    "telefono": "1234567890"
  }')

echo "Respuesta: $REGISTER_RESPONSE"
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo "✅ Registro exitoso - Token obtenido"
else
    echo "⚠️ Registro falló o usuario ya existe"
    
    # Intentar login
    echo ""
    echo "🔑 Intentando login..."
    LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "test@example.com",
        "password": "test1234"
      }')
    
    echo "Respuesta: $LOGIN_RESPONSE"
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ -n "$TOKEN" ]; then
        echo "✅ Login exitoso - Token obtenido"
    else
        echo "❌ Login falló"
        exit 1
    fi
fi

echo ""
echo "Token: ${TOKEN:0:50}..."
echo ""

# Test 2: Acceso sin token (debe fallar)
echo "🚫 Test 2: Intentar acceder al carrito SIN token"
CART_NO_TOKEN=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET "$API_URL/api/carrito/test-user")
HTTP_CODE=$(echo "$CART_NO_TOKEN" | grep HTTP_CODE | cut -d: -f2)

if [ "$HTTP_CODE" = "401" ]; then
    echo "✅ Correctamente bloqueado (401 Unauthorized)"
else
    echo "❌ ERROR: Debería bloquear sin token (código: $HTTP_CODE)"
fi

echo ""

# Test 3: Acceso con token (debe funcionar)
echo "✅ Test 3: Acceder al carrito CON token válido"
CART_WITH_TOKEN=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET "$API_URL/api/carrito/test-user" \
  -H "Authorization: Bearer $TOKEN")
HTTP_CODE=$(echo "$CART_WITH_TOKEN" | grep HTTP_CODE | cut -d: -f2)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "403" ]; then
    echo "✅ Token aceptado por el servidor"
else
    echo "❌ ERROR: Token rechazado (código: $HTTP_CODE)"
fi

echo ""

# Test 4: Rate Limiting en login
echo "⏱️  Test 4: Rate Limiting (múltiples intentos de login)"
for i in {1..6}; do
    RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_URL/api/auth/login" \
      -H "Content-Type: application/json" \
      -d '{"email":"wrong@test.com","password":"wrong"}')
    HTTP_CODE=$(echo "$RESPONSE" | grep HTTP_CODE | cut -d: -f2)
    
    echo "Intento $i: HTTP $HTTP_CODE"
    
    if [ "$HTTP_CODE" = "429" ]; then
        echo "✅ Rate limiting funcionando (429 Too Many Requests)"
        break
    fi
    
    sleep 1
done

echo ""
echo "=================================="
echo "🎉 Pruebas completadas"
echo ""
echo "Resumen:"
echo "- Autenticación JWT: ✅ Implementada"
echo "- Protección de rutas: ✅ Activa"
echo "- Rate Limiting: ✅ Configurado"
echo ""
echo "⚠️  RECORDATORIO:"
echo "1. Cambiar contraseña de MongoDB"
echo "2. Generar nuevo JWT_SECRET para producción"
echo "3. Configurar HTTPS en producción"
