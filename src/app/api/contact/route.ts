import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, service, message } = body;

    // Validación básica de campos
    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios (*) deben ser completados." },
        { status: 400 }
      );
    }

    // Registro visual en la consola del servidor (Server logs)
    console.log("\n=======================================================");
    console.log("📨 NUEVO REGISTRO DE CONSULTORÍA RECIBIDO - NEXORA AI");
    console.log(`👤 Nombre:     ${name}`);
    console.log(`📧 Correo:     ${email}`);
    console.log(`🏢 Empresa:    ${company || "No especificada"}`);
    console.log(`💼 Servicio:   ${service}`);
    console.log(`💬 Mensaje:    ${message}`);
    console.log("=======================================================\n");

    // 1. Guardar la consulta en la base de datos de Supabase si está configurada
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("reemplazar-con-tu-id");

    if (isSupabaseConfigured) {
      const { error: dbError } = await supabase
        .from("consultas")
        .insert([{ name, email, company, service, message }]);

      if (dbError) {
        console.error("[SUPABASE_INSERT_ERROR]", dbError);
        throw new Error("Fallo al guardar el registro en Supabase.");
      } else {
        console.log("[SUPABASE_INSERT_SUCCESS] Registro guardado en Supabase exitosamente.");
      }
    } else {
      console.warn("[SUPABASE_BYPASS] Supabase no configurado en .env.local. Saltando inserción.");
    }

    // 2. Definición de los cuerpos de correo detallados en formato HTML
    const targetEmail = process.env.CONTACT_EMAIL_TARGET || "nexoraia2@gmail.com";
      
    const adminHtml = `
      <div style="font-family: sans-serif; background-color: #fafafa; color: #1f2937; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb;">
        <div style="border-bottom: 3px solid #7c3aed; padding-bottom: 15px; margin-bottom: 20px;">
          <span style="font-size: 11px; font-weight: 800; color: #7c3aed; letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 4px;">NEXORA AI OPERACIONES</span>
          <h2 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0;">🚨 NUEVA OPORTUNIDAD DE CONSULTORÍA</h2>
        </div>
        
        <p style="font-size: 14px; color: #4b5563; line-height: 1.5; margin-bottom: 20px;">
          Se ha recibido una nueva solicitud de consultoría desde el formulario de la landing page. A continuación se detallan los datos del cliente potencial:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <tbody>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px 0; font-size: 13px; font-weight: bold; color: #374151; width: 150px;">Nombre Completo:</td>
              <td style="padding: 10px 0; font-size: 13px; color: #4b5563;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px 0; font-size: 13px; font-weight: bold; color: #374151;">Correo Electrónico:</td>
              <td style="padding: 10px 0; font-size: 13px; color: #4b5563;"><a href="mailto:${email}" style="color: #06b6d4; text-decoration: none; font-weight: 600;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px 0; font-size: 13px; font-weight: bold; color: #374151;">Compañía / Proyecto:</td>
              <td style="padding: 10px 0; font-size: 13px; color: #4b5563;">${company || "No especificada"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px 0; font-size: 13px; font-weight: bold; color: #374151;">Servicio de Interés:</td>
              <td style="padding: 10px 0; font-size: 13px; font-weight: bold; color: #7c3aed;">${service}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-size: 13px; font-weight: bold; color: #374151; vertical-align: top;">Mensaje:</td>
              <td style="padding: 10px 0; font-size: 13px; color: #4b5563; line-height: 1.5;">${message.replace(/\n/g, "<br />")}</td>
            </tr>
          </tbody>
        </table>

        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; text-align: center;">
          <a href="mailto:${email}?subject=Re: Consulta de Nexora AI&body=Hola ${name}, gracias por escribirnos..." style="display: inline-block; background-color: #7c3aed; color: white; padding: 10px 20px; font-weight: bold; border-radius: 8px; text-decoration: none; font-size: 13px;">
            Responder directamente por Email
          </a>
          <span style="display: block; font-size: 11px; color: #9ca3af; margin-top: 8px;">
            Los datos también se han insertado en la base de datos de Supabase.
          </span>
        </div>
      </div>
    `;

    const clientHtml = `
      <div style="font-family: Arial, sans-serif; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
          <h1 style="color: #7c3aed; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">NEXORA AI</h1>
          <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase; font-weight: bold; letter-spacing: 2px;">Soluciones de Inteligencia Artificial</p>
        </div>

        <p style="font-size: 16px; margin-top: 0;">Hola <strong>${name}</strong>,</p>
        
        <p style="font-size: 15px;">
          Gracias por ponerte en contacto con **Nexora AI**. Hemos recibido tu solicitud de consultoría tecnológica y es un placer saludarte.
        </p>

        <div style="background-color: #f8fafc; border-left: 4px solid #7c3aed; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Resumen de tu Consulta:</h4>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Servicio Solicitado:</strong> ${service}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Empresa / Proyecto:</strong> ${company || "No especificada"}</p>
        </div>

        <h3 style="color: #1e293b; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 25px;">¿Cuáles son los siguientes pasos?</h3>
        <ul style="padding-left: 20px; margin: 15px 0; font-size: 14px;">
          <li style="margin-bottom: 10px;">
            <strong>1. Análisis Técnico:</strong> Nuestro equipo de ingeniería analizará los detalles de tu solicitud para evaluar la viabilidad de la solución.
          </li>
          <li style="margin-bottom: 10px;">
            <strong>2. Llamada de Diagnóstico:</strong> Un ingeniero especialista se pondrá en contacto contigo en las próximas 24 horas hábiles.
          </li>
          <li style="margin-bottom: 10px;">
            <strong>3. Propuesta Conceptual:</strong> Elaboraremos una propuesta de arquitectura y estimación de tiempos sin costo.
          </li>
        </ul>

        <div style="background-color: #f1f5f9; border: 1px dashed #cbd5e1; padding: 20px; border-radius: 6px; text-align: center; margin: 30px 0;">
          <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 15px;">¿Deseas agilizar el proceso?</h4>
          <p style="margin: 0 0 15px 0; font-size: 13px; color: #475569;">
            Puedes agendar directamente una llamada corta de 15 minutos en nuestro calendario para revisar tus objetivos:
          </p>
          <a href="${process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/nexoraia2/15min"}" target="_blank" style="display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 12px 24px; font-weight: bold; border-radius: 6px; text-decoration: none; font-size: 14px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.15);">
            Reservar Fecha y Hora
          </a>
        </div>

        <p style="font-size: 14px; margin-bottom: 25px;">
          Si tienes alguna duda adicional, puedes responder directamente a este correo electrónico.
        </p>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #64748b;">
          <p style="margin: 0;">Atentamente,</p>
          <p style="margin: 5px 0 0 0; font-weight: bold; color: #475569;">El Equipo de Ingeniería de Nexora AI</p>
          <p style="margin: 5px 0 0 0;"><a href="https://nexora.ai" style="color: #7c3aed; text-decoration: none;">nexora.ai</a> | nexoraia2@gmail.com</p>
        </div>
      </div>
    `;

    // 3. Evaluar motores de envío
    const isSmtpConfigured = 
      process.env.SMTP_USER && 
      process.env.SMTP_PASSWORD && 
      !process.env.SMTP_PASSWORD.includes("reemplazar-con-tu-contraseña");

    if (isSmtpConfigured) {
      console.log("[EMAIL_ENGINE] Iniciando envío de correos vía Gmail SMTP...");
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        // Enviamos ambos correos en paralelo usando la conexión SMTP de Gmail
        await Promise.all([
          transporter.sendMail({
            from: `"Nexora AI Notificaciones" <${process.env.SMTP_USER}>`,
            to: targetEmail,
            subject: `Nueva Consulta de Consultoría: ${name}`,
            html: adminHtml,
          }),
          transporter.sendMail({
            from: `"Nexora AI" <${process.env.SMTP_USER}>`,
            to: email, // Correo del cliente natural
            subject: `¡Hemos recibido tu solicitud de consultoría! - Nexora AI`,
            html: clientHtml,
          })
        ]);

        console.log("[SMTP_EMAIL_SEND_SUCCESS] Correos de notificación y confirmación de cliente enviados exitosamente.");
      } catch (smtpError) {
        console.error("[SMTP_EMAIL_SEND_ERROR] Error al procesar el envío mediante SMTP de Gmail:", smtpError);
      }
    } 
    // Fallback a Resend API si SMTP no está configurado
    else if (process.env.RESEND_API_KEY) {
      console.log("[EMAIL_ENGINE] Iniciando envío de correos vía Resend API (Modo Fallback)...");
      const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
      const isSandbox = fromEmail.includes("onboarding@resend.dev");
      const adminSender = isSandbox ? fromEmail : `Nexora AI Notificaciones <${fromEmail}>`;
      const clientSender = isSandbox ? fromEmail : `Nexora AI <${fromEmail}>`;

      // Enviamos ambos correos en paralelo para óptimo rendimiento
      const [adminRes, clientRes] = await Promise.all([
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: adminSender,
            to: targetEmail,
            subject: `Nueva Consulta de Consultoría: ${name}`,
            html: adminHtml,
          }),
        }),
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: clientSender,
            to: email, // Correo del cliente
            subject: `¡Hemos recibido tu solicitud de consultoría! - Nexora AI`,
            html: clientHtml,
          }),
        })
      ]);

      // Evaluamos el éxito de los envíos de forma individual para evitar caídas en el sandbox de pruebas.
      if (!adminRes.ok) {
        try {
          const errData = await adminRes.json();
          console.warn("[RESEND_ADMIN_WARNING] No se pudo enviar el correo de notificación a la agencia:", JSON.stringify(errData, null, 2));
        } catch {
          console.warn("[RESEND_ADMIN_WARNING] No se pudo enviar el correo de notificación a la agencia. Status:", adminRes.status);
        }
      } else {
        try {
          const successData = await adminRes.json();
          console.log("[RESEND_ADMIN_SUCCESS] Correo de notificación enviado a la agencia con ID:", successData.id);
        } catch {
          console.log("[RESEND_ADMIN_SUCCESS] Correo de notificación enviado a la agencia. Status:", adminRes.status);
        }
      }

      if (!clientRes.ok) {
        try {
          const errData = await clientRes.json();
          console.warn(`[RESEND_CLIENT_WARNING] No se pudo enviar el correo de confirmación al cliente (${email}):`, JSON.stringify(errData, null, 2));
        } catch {
          console.warn(`[RESEND_CLIENT_WARNING] No se pudo enviar el correo de confirmación al cliente (${email}). Status:`, clientRes.status);
        }

        // Si el fallo es por restricción del Sandbox de Resend (403), reenviamos una copia del correo del cliente
        // a la dirección de la agencia para que se pueda ver cómo llegará la confirmación en producción.
        if (clientRes.status === 403) {
          console.log("[RESEND_SANDBOX_REDIRECT] Detectada restricción Sandbox. Reenviando copia de confirmación del cliente a la agencia...");
          try {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              },
              body: JSON.stringify({
                from: adminSender,
                to: targetEmail,
                subject: `[VISTA PREVIA DE CLIENTE] ¡Hemos recibido tu solicitud de consultoría! - Nexora AI`,
                html: clientHtml,
              }),
            });
            console.log("[RESEND_SANDBOX_REDIRECT_SUCCESS] Copia de vista previa enviada exitosamente a la agencia.");
          } catch (redirectErr) {
            console.error("[RESEND_SANDBOX_REDIRECT_ERROR] Fallo al enviar la copia de vista previa:", redirectErr);
          }
        }
      } else {
        try {
          const successData = await clientRes.json();
          console.log(`[RESEND_CLIENT_SUCCESS] Correo de confirmación enviado al cliente (${email}) con ID:`, successData.id);
        } catch {
          console.log(`[RESEND_CLIENT_SUCCESS] Correo de confirmación enviado al cliente (${email}). Status:`, clientRes.status);
        }
      }
      
      console.log("[RESEND_EMAIL_SEND_COMPLETED] Proceso de envío finalizado.");
    }

    return NextResponse.json(
      { success: true, message: "Consulta procesada exitosamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API_CONTACT_ROUTE_ERROR]", error);
    return NextResponse.json(
      { error: "Ocurrió un error interno en el servidor al procesar la consulta." },
      { status: 500 }
    );
  }
}
