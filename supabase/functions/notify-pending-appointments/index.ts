import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type Appointment = {
  id: string;
  client_name: string;
  service: string;
  professional: string;
  appointment_date: string;
  appointment_time: string;
  client_phone: string;
  value: number;
  notification_count: number;
};

type SendResult = {
  ok: boolean;
  status?: number;
  body?: string;
  error?: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const provider = (Deno.env.get("WHATSAPP_PROVIDER") ?? "evolution").toLowerCase();
const adminPhone = Deno.env.get("ADMIN_WHATSAPP_PHONE") ?? "";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function buildMessage(appointment: Appointment) {
  const attempt = appointment.notification_count + 1;

  return [
    "🔔 Novo agendamento pendente - Salão Larissa",
    "",
    `Cliente: ${appointment.client_name}`,
    `Telefone: ${appointment.client_phone}`,
    `Serviço: ${appointment.service}`,
    `Profissional: ${appointment.professional}`,
    `Data: ${appointment.appointment_date}`,
    `Hora: ${appointment.appointment_time}`,
    `Valor: ${money(Number(appointment.value))}`,
    "",
    `Tentativa de aviso: ${attempt}/6`,
    "A notificação para quando o status sair de pendente.",
  ].join("\n");
}

async function sendViaEvolution(message: string): Promise<SendResult> {
  const baseUrl = Deno.env.get("EVOLUTION_API_URL") ?? "";
  const apiKey = Deno.env.get("EVOLUTION_API_KEY") ?? "";
  const instance = Deno.env.get("EVOLUTION_INSTANCE") ?? "";

  if (!baseUrl || !apiKey || !instance) {
    return { ok: false, error: "Evolution API não configurada." };
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/message/sendText/${instance}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": apiKey,
    },
    body: JSON.stringify({
      number: adminPhone,
      text: message,
    }),
  });

  const body = await response.text();
  return { ok: response.ok, status: response.status, body };
}

async function sendViaMeta(message: string): Promise<SendResult> {
  const token = Deno.env.get("META_WHATSAPP_TOKEN") ?? "";
  const phoneNumberId = Deno.env.get("META_PHONE_NUMBER_ID") ?? "";

  if (!token || !phoneNumberId) {
    return { ok: false, error: "Meta Cloud API não configurada." };
  }

  const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: adminPhone,
      type: "text",
      text: { body: message },
    }),
  });

  const body = await response.text();
  return { ok: response.ok, status: response.status, body };
}

async function sendViaUltraMsg(message: string): Promise<SendResult> {
  const instanceId = Deno.env.get("ULTRAMSG_INSTANCE_ID") ?? "";
  const token = Deno.env.get("ULTRAMSG_TOKEN") ?? "";

  if (!instanceId || !token) {
    return { ok: false, error: "UltraMSG não configurado." };
  }

  const form = new URLSearchParams();
  form.set("token", token);
  form.set("to", adminPhone);
  form.set("body", message);

  const response = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });

  const body = await response.text();
  return { ok: response.ok, status: response.status, body };
}

async function sendWhatsApp(message: string): Promise<SendResult> {
  if (!adminPhone) {
    return { ok: false, error: "ADMIN_WHATSAPP_PHONE não configurado." };
  }

  if (provider === "meta") return sendViaMeta(message);
  if (provider === "ultramsg") return sendViaUltraMsg(message);
  return sendViaEvolution(message);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json(
      { error: "SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausente." },
      { status: 500, headers: corsHeaders },
    );
  }

  const batchLimit = Number(new URL(req.url).searchParams.get("limit") ?? "20");
  const { data: appointments, error } = await supabase.rpc("get_pending_admin_notifications", {
    batch_limit: Number.isFinite(batchLimit) ? batchLimit : 20,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }

  const results = [];

  for (const appointment of (appointments ?? []) as Appointment[]) {
    const message = buildMessage(appointment);
    const result = await sendWhatsApp(message);

    await supabase.rpc("register_admin_notification_attempt", {
      appointment_uuid: appointment.id,
      provider_name: provider,
      admin_phone_number: adminPhone || "not-configured",
      was_sent: result.ok,
      http_status: result.status ?? null,
      http_body: result.body?.slice(0, 4000) ?? null,
      error_text: result.error ?? null,
    });

    results.push({
      appointmentId: appointment.id,
      sent: result.ok,
      status: result.status,
      error: result.error,
    });
  }

  return Response.json(
    {
      provider,
      checked: appointments?.length ?? 0,
      results,
    },
    { headers: corsHeaders },
  );
});