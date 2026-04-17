import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey && process.env.NODE_ENV === 'production') {
  console.warn('RESEND_API_KEY is not set. Email features will not work.');
}

const resend = new Resend(resendApiKey || 're_placeholder');

const FROM_EMAIL = process.env.EMAIL_FROM || 'Logistic Visions <noreply@logisticvisions.com>';
const APP_NAME = 'Logistic Visions';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.logisticvisions.com';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Email send error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

// Welcome email for new workspace owners
export async function sendWelcomeEmail(email: string, name: string, companyName: string) {
  return sendEmail({
    to: email,
    subject: `Welcome to ${APP_NAME}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${APP_NAME}</h1>
        </div>
        <div style="padding: 32px; background: #ffffff; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937;">Welcome aboard, ${name}!</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Your workspace <strong>${companyName}</strong> is all set up. You are on the <strong>Starter</strong> plan with a <strong>14-day free trial</strong> of our Professional features.
          </p>
          <p style="color: #4b5563; line-height: 1.6;">Here is what you can do next:</p>
          <ul style="color: #4b5563; line-height: 1.8;">
            <li>Add your fleet vehicles and drivers</li>
            <li>Create your first trip</li>
            <li>Invite team members</li>
            <li>Explore AI-powered maintenance predictions</li>
          </ul>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${APP_URL}/dashboard" style="background: #2563eb; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600;">Go to Dashboard</a>
          </div>
          <p style="color: #9ca3af; font-size: 14px;">
            Need help? Reply to this email or visit our support center.
          </p>
        </div>
        <div style="padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
          <p>${APP_NAME} - Smart Logistics Management</p>
        </div>
      </div>
    `,
  });
}

// Team invitation email
export async function sendInviteEmail(
  email: string,
  inviterName: string,
  companyName: string,
  inviteToken: string,
  role: string
) {
  const inviteUrl = `${APP_URL}/join/${inviteToken}`;
  return sendEmail({
    to: email,
    subject: `You have been invited to join ${companyName} on ${APP_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${APP_NAME}</h1>
        </div>
        <div style="padding: 32px; background: #ffffff; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937;">You are invited!</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            <strong>${inviterName}</strong> has invited you to join <strong>${companyName}</strong> as a <strong>${role}</strong> on ${APP_NAME}.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${inviteUrl}" style="background: #2563eb; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600;">Accept Invitation</a>
          </div>
          <p style="color: #9ca3af; font-size: 14px;">
            This invitation expires in 7 days. If you did not expect this, you can safely ignore it.
          </p>
        </div>
        <div style="padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
          <p>${APP_NAME} - Smart Logistics Management</p>
        </div>
      </div>
    `,
  });
}

// Subscription confirmation email
export async function sendSubscriptionEmail(
  email: string,
  name: string,
  planName: string,
  amount: string
) {
  return sendEmail({
    to: email,
    subject: `Subscription Confirmed - ${planName} Plan`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${APP_NAME}</h1>
        </div>
        <div style="padding: 32px; background: #ffffff; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937;">Subscription Confirmed!</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Hi ${name}, your subscription to the <strong>${planName}</strong> plan has been activated.
          </p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 4px 0; color: #374151;"><strong>Plan:</strong> ${planName}</p>
            <p style="margin: 4px 0; color: #374151;"><strong>Amount:</strong> ${amount}</p>
          </div>
          <p style="color: #4b5563; line-height: 1.6;">
            You can manage your subscription at any time from the billing page.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${APP_URL}/billing" style="background: #2563eb; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600;">Manage Billing</a>
          </div>
        </div>
        <div style="padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
          <p>${APP_NAME} - Smart Logistics Management</p>
        </div>
      </div>
    `,
  });
}

// Payment failed notification
export async function sendPaymentFailedEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: `Action Required: Payment Failed - ${APP_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626, #ef4444); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${APP_NAME}</h1>
        </div>
        <div style="padding: 32px; background: #ffffff; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937;">Payment Failed</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Hi ${name}, we were unable to process your subscription payment. Please update your payment method to avoid service interruption.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${APP_URL}/billing" style="background: #dc2626; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600;">Update Payment Method</a>
          </div>
        </div>
        <div style="padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
          <p>${APP_NAME} - Smart Logistics Management</p>
        </div>
      </div>
    `,
  });
}

export { sendEmail };
