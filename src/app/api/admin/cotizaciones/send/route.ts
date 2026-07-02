import { NextResponse } from "next/server";
import { supabase, supabaseUrlClean, supabaseAnonKey, hasValidServiceKey } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

interface QuoteItem {
  description: string;
  hours: number;
  rate: number;
  total: number;
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "El ID de la cotización es requerido." }, { status: 400 });
    }

    let supabaseClient = supabase;

    if (!hasValidServiceKey && token && token !== "nexora-admin-session-active-2026") {
      supabaseClient = createClient(supabaseUrlClean, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        auth: { persistSession: false }
      });
    }

    // 1. Obtener la cotización de Supabase
    const { data: cotizacion, error: selectError } = await supabaseClient
      .from("cotizaciones")
      .select("*")
      .eq("id", id)
      .single();

    if (selectError || !cotizacion) {
      console.error("[SUPABASE_SELECT_QUOTE_ERROR]", selectError);
      return NextResponse.json({ success: false, error: "No se encontró la cotización especificada." }, { status: 404 });
    }

    const {
      client_name,
      client_email,
      client_company,
      service_type,
      items,
      subtotal,
      tax,
      total_amount,
      notes
    } = cotizacion;

    // 2. Generar el cuerpo del email HTML
    const itemsList: QuoteItem[] = Array.isArray(items) ? (items as QuoteItem[]) : [];
    const itemsHtml = itemsList.map(item => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 10px; font-size: 13px; color: #334155; text-align: left;">${item.description}</td>
        <td style="padding: 12px 10px; font-size: 13px; color: #475569; text-align: center;">${item.hours} h</td>
        <td style="padding: 12px 10px; font-size: 13px; color: #475569; text-align: right;">$${Number(item.rate).toLocaleString("es-CO")}</td>
        <td style="padding: 12px 10px; font-size: 13px; color: #0f172a; font-weight: bold; text-align: right;">$${Number(item.total).toLocaleString("es-CO")}</td>
      </tr>
    `).join("");

    const targetEmail = client_email;
    const adminCopyEmail = process.env.CONTACT_EMAIL_TARGET || "nexoraia2@gmail.com";

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 15px; color: #1e293b;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          
          <!-- Banner Header -->
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 1px;">NEXORA AI</h1>
            <p style="margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 2px; opacity: 0.9;">Propuesta de Servicios Tecnológicos</p>
          </div>

          <!-- Contenido Principal -->
          <div style="padding: 30px;">
            
            <div style="margin-bottom: 25px;">
              <span style="font-size: 11px; font-weight: bold; color: #7c3aed; text-transform: uppercase; tracking: 1px;">Cotización Comercial</span>
              <h2 style="margin: 2px 0 10px 0; font-size: 20px; color: #0f172a; font-weight: 800;">Hola, ${client_name}</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0;">
                Agradecemos tu interés en colaborar con **Nexora AI**. De acuerdo con nuestra conversación y el diagnóstico técnico de tus objetivos, te presentamos la cotización formal detallada para el servicio de <strong>${service_type}</strong>:
              </p>
            </div>

            <!-- Tabla de Detalles de Cliente -->
            <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 25px; font-size: 13px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #64748b; font-weight: bold; padding: 3px 0;">Cliente:</td>
                  <td style="color: #334155; font-weight: bold; padding: 3px 0;">${client_name}</td>
                </tr>
                ${client_company ? `
                <tr>
                  <td style="color: #64748b; font-weight: bold; padding: 3px 0;">Empresa:</td>
                  <td style="color: #334155; padding: 3px 0;">${client_company}</td>
                </tr>
                ` : ""}
                <tr>
                  <td style="color: #64748b; font-weight: bold; padding: 3px 0;">Código Cotización:</td>
                  <td style="color: #7c3aed; font-family: monospace; font-weight: bold; padding: 3px 0;">${id.substring(0, 8).toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: bold; padding: 3px 0;">Fecha de Emisión:</td>
                  <td style="color: #334155; padding: 3px 0;">${new Date().toLocaleDateString("es-CO")}</td>
                </tr>
              </table>
            </div>

            <!-- Tabla de Conceptos -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <thead>
                <tr style="border-bottom: 2px solid #cbd5e1; background-color: #f8fafc;">
                  <th style="padding: 10px; font-size: 12px; font-weight: bold; color: #475569; text-align: left; text-transform: uppercase;">Concepto / Requerimiento</th>
                  <th style="padding: 10px; font-size: 12px; font-weight: bold; color: #475569; text-align: center; text-transform: uppercase; width: 60px;">Esfuerzo</th>
                  <th style="padding: 10px; font-size: 12px; font-weight: bold; color: #475569; text-align: right; text-transform: uppercase; width: 100px;">Tarifa</th>
                  <th style="padding: 10px; font-size: 12px; font-weight: bold; color: #475569; text-align: right; text-transform: uppercase; width: 100px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Resumen de Costos -->
            <div style="width: 250px; margin-left: auto; margin-bottom: 30px; font-size: 14px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0; color: #64748b; text-align: left;">Subtotal:</td>
                  <td style="padding: 5px 0; color: #334155; text-align: right;">$${Number(subtotal).toLocaleString("es-CO")}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 5px 0; color: #64748b; text-align: left;">IVA (19%):</td>
                  <td style="padding: 5px 0; color: #334155; text-align: right;">$${Number(tax).toLocaleString("es-CO")}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 0 0; color: #0f172a; font-weight: bold; text-align: left; font-size: 16px;">Total General:</td>
                  <td style="padding: 10px 0 0 0; color: #7c3aed; font-weight: bold; text-align: right; font-size: 18px;">$${Number(total_amount).toLocaleString("es-CO")}</td>
                </tr>
              </table>
            </div>

            <!-- Notas Comerciales -->
            ${notes ? `
            <div style="border-left: 3px solid #06b6d4; padding-left: 15px; margin-bottom: 30px;">
              <h4 style="margin: 0 0 5px 0; color: #0f172a; font-size: 13px; text-transform: uppercase;">Notas y Alcance Comercial:</h4>
              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #475569; font-style: italic;">
                ${notes.replace(/\n/g, "<br />")}
              </p>
            </div>
            ` : ""}

            <!-- Call to Action -->
            <div style="text-align: center; margin: 35px 0 20px 0;">
              <a href="mailto:${adminCopyEmail}?subject=Aceptacion de Cotizacion ${id.substring(0, 8).toUpperCase()}&body=Hola Nexora AI, confirmo la aceptacion de la propuesta de servicio ${service_type} con ID ${id}." style="display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 14px 30px; font-weight: bold; border-radius: 8px; text-decoration: none; font-size: 14px; box-shadow: 0 4px 10px rgba(124,58,237,0.25);">
                Aceptar Propuesta Comercial
              </a>
              <span style="display: block; font-size: 11px; color: #94a3b8; margin-top: 10px;">
                Al hacer clic, se redactará un correo de aceptación dirigido a nuestro equipo de operaciones.
              </span>
            </div>

          </div>

          <!-- Footer de Email -->
          <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center; font-size: 12px; color: #64748b;">
            <p style="margin: 0 0 5px 0; font-weight: bold; color: #475569;">Nexora AI • Soluciones de Automatización e IA</p>
            <p style="margin: 0 0 10px 0;"><a href="https://nexora.ai" style="color: #7c3aed; text-decoration: none; font-weight: 600;">nexora.ai</a> | nexoraia2@gmail.com</p>
            <p style="margin: 10px 0 0 0; font-size: 10px; color: #94a3b8; border-top: 1px dashed #e2e8f0; padding-top: 8px; line-height: 1.5;">
              Nexora AI, Cra 45 # 12-34, Medellín, Colombia.<br />
              Recibiste este correo de cotización formal de servicios a solicitud de tu compañía.
            </p>
          </div>

        </div>
      </div>
    `;

    // 2.2 Texto plano alternativo (Anti-Spam)
    const emailText = `
NEXORA AI
Soluciones de Automatización e IA

Hola ${client_name},

Agradecemos tu interés en colaborar con Nexora AI. De acuerdo con nuestra conversación y el diagnóstico técnico de tus objetivos, te presentamos la cotización formal detallada para el servicio de ${service_type}.

Detalles de la Cotización:
- Cliente: ${client_name}
- Empresa: ${client_company || "No especificada"}
- Código Cotización: ${id.substring(0, 8).toUpperCase()}
- Fecha de Emisión: ${new Date().toLocaleDateString("es-CO")}

Conceptos de Servicio:
${itemsList.map((item: QuoteItem) => `- ${item.description}: ${item.hours}h x $${Number(item.rate).toLocaleString("es-CO")} = $${Number(item.total).toLocaleString("es-CO")}`).join("\n")}

Subtotal: $${Number(subtotal).toLocaleString("es-CO")}
IVA (19%): $${Number(tax).toLocaleString("es-CO")}
Total General: $${Number(total_amount).toLocaleString("es-CO")}

Notas y Alcance Comercial:
${notes || "Sin notas comerciales adicionales."}

Para aceptar formalmente esta propuesta comercial, por favor responde a este correo electrónico con tu conformidad.

Atentamente,
El Equipo de Operaciones de Nexora AI
nexora.ai | nexoraia2@gmail.com

Nexora AI, Cra 45 # 12-34, Medellín, Colombia.
Recibiste este correo de cotización formal de servicios a solicitud de tu compañía.
    `;

    // 3. Despachar el correo (Gmail SMTP o Resend API)
    const isSmtpConfigured = 
      process.env.SMTP_USER && 
      process.env.SMTP_PASSWORD && 
      !process.env.SMTP_PASSWORD.includes("reemplazar-con-tu-contraseña");

    let emailSent = false;

    if (isSmtpConfigured) {
      console.log("[EMAIL_ENGINE_QUOTE] Enviando cotización vía Gmail SMTP...");
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: `"Nexora AI Cotizaciones" <${process.env.SMTP_USER}>`,
          to: targetEmail,
          cc: adminCopyEmail,
          subject: `Propuesta de Servicios Comerciales: ${service_type} - Nexora AI`,
          text: emailText,
          html: emailHtml,
        });
        emailSent = true;
      } catch (smtpError) {
        console.error("[SMTP_EMAIL_QUOTE_SEND_ERROR]", smtpError);
      }
    } 
    // Fallback a Resend API si SMTP no está configurado
    else if (process.env.RESEND_API_KEY) {
      console.log("[EMAIL_ENGINE_QUOTE] Enviando cotización vía Resend API...");
      const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
      const isSandbox = fromEmail.includes("onboarding@resend.dev");
      const senderEmail = isSandbox ? fromEmail : `Nexora AI Cotizaciones <${fromEmail}>`;

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: senderEmail,
          to: targetEmail,
          cc: isSandbox ? undefined : adminCopyEmail, // Resend sandbox rejects arbitrary CCs
          subject: `Propuesta de Servicios Comerciales: ${service_type} - Nexora AI`,
          text: emailText,
          html: emailHtml,
        }),
      });

      if (response.ok) {
        emailSent = true;
      } else {
        const errDetails = await response.text();
        console.error("[RESEND_QUOTE_SEND_ERROR]", errDetails);
      }
    }

    if (emailSent) {
      // 4. Actualizar el estado de la cotización a 'Enviada' y sent_at en Supabase
      const { error: updateError } = await supabaseClient
        .from("cotizaciones")
        .update({
          status: "Enviada",
          sent_at: new Date().toISOString()
        })
        .eq("id", id);

      if (updateError) {
        console.error("[SUPABASE_UPDATE_QUOTE_STATUS_ERROR]", updateError);
        // Retornamos éxito de envío pero avisamos que no se guardó el estado
        return NextResponse.json({ success: true, warning: "El correo fue enviado, pero no se pudo actualizar el estado en la base de datos." }, { status: 200 });
      }

      return NextResponse.json({ success: true, message: "La cotización fue enviada exitosamente al cliente." }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: "No se pudo despachar el correo electrónico. Verifica la configuración de Gmail SMTP y Resend." }, { status: 500 });
    }

  } catch (error) {
    console.error("[API_SEND_QUOTE_ROUTE_ERROR]", error);
    return NextResponse.json({ success: false, error: "Error interno del servidor al enviar la cotización." }, { status: 500 });
  }
}
