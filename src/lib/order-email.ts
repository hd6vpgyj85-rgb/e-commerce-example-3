import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export async function sendOrderNotificationEmail(
  message: string,
  customerName: string,
  customerPhone: string,
  total: string
): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) return;

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      customer_name: customerName || "Sin nombre",
      customer_phone: customerPhone,
      total,
      message,
    },
    { publicKey: PUBLIC_KEY }
  );
}
