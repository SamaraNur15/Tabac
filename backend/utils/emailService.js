const nodemailer = require('nodemailer');

/**
 * Servicio de Email para notificaciones de órdenes
 * Usa Gmail SMTP o servicio configurado en .env
 */

// Crear transportador de email
const createTransporter = () => {
  // Configuración desde variables de entorno
  const emailConfig = {
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  };

  // Si no hay configuración, usar ethereal (servicio de prueba)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('⚠️ No se configuró EMAIL_USER/EMAIL_PASSWORD, usando modo de prueba');
    return null; // Retornar null para modo de prueba
  }

  return nodemailer.createTransport(emailConfig);
};

/**
 * Validar que un email existe (verificación básica de formato)
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Enviar email de confirmación de orden
 * @param {Object} order - Datos de la orden
 * @param {Object} cliente - Datos del cliente
 */
const sendOrderConfirmationEmail = async (order, cliente) => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.log('📧 [MODO PRUEBA] Email que se enviaría:');
      console.log(`   Para: ${cliente.email}`);
      console.log(`   Asunto: Tu orden #${order.numero} ha sido recibida`);
      console.log(`   Link de seguimiento: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/orden-tracking/${order.numero}`);
      return { success: true, test: true };
    }

    if (!validateEmail(cliente.email)) {
      throw new Error('Email inválido');
    }

    const trackingUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/orden-tracking/${order.numero}`;
    
    const mailOptions = {
      from: `"Tabac Restaurant" <${process.env.EMAIL_USER}>`,
      to: cliente.email,
      subject: `✅ Tu orden #${order.numero} ha sido recibida`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #fb9e48 0%, #ff6b00 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #fff;
              padding: 30px;
              border: 2px solid #f0f0f0;
              border-top: none;
            }
            .order-number {
              font-size: 32px;
              font-weight: bold;
              margin: 10px 0;
            }
            .info-box {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #fb9e48 0%, #ff6b00 100%);
              color: white;
              text-decoration: none;
              padding: 15px 30px;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 14px;
            }
            .item {
              border-bottom: 1px solid #eee;
              padding: 10px 0;
            }
            .total {
              font-size: 20px;
              font-weight: bold;
              color: #ff6b00;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div style="font-size: 40px; margin-bottom: 10px;">☕</div>
            <h1 style="margin: 0;">¡Orden Recibida!</h1>
            <div class="order-number">#${order.numero}</div>
          </div>
          
          <div class="content">
            <p>Hola <strong>${cliente.nombre}</strong>,</p>
            
            <p>¡Gracias por tu pedido! Hemos recibido tu orden y la estamos preparando con mucho cariño.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #ff6b00;">📦 Detalles de tu orden</h3>
              ${order.items.map(item => `
                <div class="item">
                  <strong>${item.cantidad}x</strong> ${item.nombre} - $${item.precio * item.cantidad}
                </div>
              `).join('')}
              <div class="total">
                Total: $${order.totales.total}
              </div>
            </div>
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #ff6b00;">🚚 ${order.entrega.modo === 'delivery' ? 'Entrega a domicilio' : 'Retiro en local'}</h3>
              ${order.entrega.modo === 'delivery' ? `
                <p><strong>Dirección:</strong> ${order.entrega.direccion}</p>
              ` : `
                <p><strong>Dirección del local:</strong> Av. Principal 123, San Salvador de Jujuy</p>
              `}
              <p><strong>Estado actual:</strong> <span style="color: #fb9e48;">Pendiente</span></p>
            </div>
            
            <p style="text-align: center;">
              <a href="${trackingUrl}" class="button">
                🔍 Seguir mi orden
              </a>
            </p>
            
            <p style="font-size: 14px; color: #666; text-align: center;">
              También puedes seguir tu orden ingresando el número #${order.numero} en nuestra página web
            </p>
          </div>
          
          <div class="footer">
            <p>📧 ¿Necesitas ayuda? Responde a este email o contáctanos</p>
            <p>Tabac Restaurant - San Salvador de Jujuy, Argentina</p>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmación enviado:', info.messageId);
    
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error enviando email de confirmación:', error);
    // No fallar la orden si el email falla
    return { success: false, error: error.message };
  }
};

/**
 * Enviar email de cambio de estado
 * @param {Object} order - Datos de la orden
 * @param {Object} cliente - Datos del cliente
 * @param {string} estadoAnterior - Estado anterior
 * @param {string} estadoNuevo - Nuevo estado
 */
const sendOrderStatusEmail = async (order, cliente, estadoAnterior, estadoNuevo) => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.log('📧 [MODO PRUEBA] Email de cambio de estado:');
      console.log(`   Para: ${cliente.email}`);
      console.log(`   Orden: #${order.numero}`);
      console.log(`   Estado: ${estadoAnterior} → ${estadoNuevo}`);
      return { success: true, test: true };
    }

    if (!validateEmail(cliente.email)) {
      return { success: false, error: 'Email inválido' };
    }

    const trackingUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/orden-tracking/${order.numero}`;
    
    // Emojis y mensajes según el estado
    const estadoInfo = {
      pendiente: { emoji: '⏳', titulo: 'Orden Recibida', color: '#fb9e48' },
      aceptada: { emoji: '👍', titulo: 'Orden Aceptada', color: '#3498db' },
      en_preparacion: { emoji: '👨‍🍳', titulo: 'En Preparación', color: '#f39c12' },
      lista: { emoji: '✅', titulo: 'Orden Lista', color: '#27ae60' },
      entregada: { emoji: '🎉', titulo: 'Orden Entregada', color: '#2ecc71' },
      rechazada: { emoji: '❌', titulo: 'Orden Rechazada', color: '#e74c3c' },
      cancelada: { emoji: '🚫', titulo: 'Orden Cancelada', color: '#95a5a6' }
    };

    const info = estadoInfo[estadoNuevo] || { emoji: '📝', titulo: 'Estado Actualizado', color: '#3498db' };

    const mailOptions = {
      from: `"Tabac Restaurant" <${process.env.EMAIL_USER}>`,
      to: cliente.email,
      subject: `${info.emoji} Tu orden #${order.numero} - ${info.titulo}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: ${info.color};
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #fff;
              padding: 30px;
              border: 2px solid #f0f0f0;
              border-top: none;
            }
            .status-badge {
              display: inline-block;
              background: ${info.color};
              color: white;
              padding: 10px 20px;
              border-radius: 20px;
              font-weight: bold;
              margin: 10px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #fb9e48 0%, #ff6b00 100%);
              color: white;
              text-decoration: none;
              padding: 15px 30px;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div style="font-size: 50px; margin-bottom: 10px;">${info.emoji}</div>
            <h1 style="margin: 0;">${info.titulo}</h1>
            <p style="margin: 10px 0 0 0; font-size: 20px;">Orden #${order.numero}</p>
          </div>
          
          <div class="content">
            <p>Hola <strong>${cliente.nombre}</strong>,</p>
            
            <p>Tu orden ha sido actualizada:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div class="status-badge">${estadoNuevo.replace('_', ' ').toUpperCase()}</div>
            </div>
            
            ${estadoNuevo === 'lista' ? `
              <p style="font-size: 18px; color: #27ae60; text-align: center; font-weight: bold;">
                ${order.entrega.modo === 'delivery' 
                  ? '🚚 Tu pedido está en camino!' 
                  : '🏪 Tu pedido está listo para retirar!'}
              </p>
            ` : ''}
            
            ${estadoNuevo === 'en_preparacion' ? `
              <p style="font-size: 16px; color: #f39c12; text-align: center;">
                👨‍🍳 Nuestro equipo está preparando tu pedido con mucho cuidado
              </p>
            ` : ''}
            
            <p style="text-align: center;">
              <a href="${trackingUrl}" class="button">
                🔍 Ver detalles de mi orden
              </a>
            </p>
          </div>
          
          <div class="footer">
            <p>Tabac Restaurant - San Salvador de Jujuy, Argentina</p>
          </div>
        </body>
        </html>
      `
    };

    const emailInfo = await transporter.sendMail(mailOptions);
    console.log('✅ Email de estado enviado:', emailInfo.messageId);
    
    return { success: true, messageId: emailInfo.messageId };

  } catch (error) {
    console.error('❌ Error enviando email de estado:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  validateEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail
};
