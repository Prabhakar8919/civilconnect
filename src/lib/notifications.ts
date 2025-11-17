// Notification Service for In-App, Email and SMS
// This file provides functions to send notifications via multiple channels

import { supabase } from "@/integrations/supabase/client";

/**
 * Create in-app notification in database
 */
export const createInAppNotification = async (
  userId: string,
  title: string,
  message: string,
  link?: string,
  type?: string
) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title,
        message,
        link,
        type,
        read: false,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("In-app notification error:", error);
    return { success: false, error };
  }
};

/**
 * Send email notification using Supabase Edge Functions
 * You'll need to set up a Supabase Edge Function for this
 */
export const sendEmailNotification = async (
  to: string,
  subject: string,
  body: string
) => {
  try {
    // Call Supabase Edge Function for email
    const { data, error } = await supabase.functions.invoke("send-email", {
      body: {
        to,
        subject,
        body,
      },
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Email notification error:", error);
    return { success: false, error };
  }
};

/**
 * Send SMS notification using Supabase Edge Functions
 * You'll need to set up a Supabase Edge Function with Twilio integration
 */
export const sendSMSNotification = async (to: string, message: string) => {
  try {
    // Call Supabase Edge Function for SMS
    const { data, error } = await supabase.functions.invoke("send-sms", {
      body: {
        to,
        message,
      },
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("SMS notification error:", error);
    return { success: false, error };
  }
};

/**
 * Send connection notification (in-app + email + SMS)
 */
export const notifyConnection = async (
  userId: string,
  type: "request" | "accepted",
  fromUserName: string,
  fromUserId: string,
  userEmail?: string,
  userPhone?: string
) => {
  const messages = {
    request: {
      title: "New Connection Request",
      body: `${fromUserName} wants to connect with you`,
      link: "/dashboard",
      email: `You have a new connection request from ${fromUserName}. Log in to CivilConnect to respond.`,
      sms: `${fromUserName} wants to connect with you on CivilConnect. Check your account!`,
    },
    accepted: {
      title: "Connection Accepted",
      body: `${fromUserName} accepted your connection request`,
      link: "/dashboard",
      email: `Great news! ${fromUserName} has accepted your connection request. You can now chat with them on CivilConnect.`,
      sms: `${fromUserName} accepted your connection on CivilConnect. Start chatting now!`,
    },
  };

  const message = messages[type];

  // Create in-app notification
  await createInAppNotification(
    userId,
    message.title,
    message.body,
    message.link,
    type === "request" ? "connection_request" : "connection_accepted"
  );

  // Send email if available
  if (userEmail) {
    await sendEmailNotification(userEmail, message.title, message.email);
  }

  // Send SMS if available
  if (userPhone) {
    await sendSMSNotification(userPhone, message.sms);
  }
};

/**
 * Send new message notification
 */
export const notifyNewMessage = async (
  userId: string,
  fromUserName: string,
  fromUserId: string,
  messagePreview: string,
  connectionId: string,
  userEmail?: string,
  userPhone?: string
) => {
  // Create in-app notification
  await createInAppNotification(
    userId,
    "New Message",
    `${fromUserName}: ${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? '...' : ''}`,
    `/chat/${connectionId}`,
    "new_message"
  );
  
  // Send email if available
  if (userEmail) {
    await sendEmailNotification(
      userEmail,
      "New Message on CivilConnect",
      `${fromUserName} sent you a message: "${messagePreview}". Log in to reply.`
    );
  }

  // Send SMS if available
  if (userPhone) {
    await sendSMSNotification(
      userPhone,
      `New message from ${fromUserName} on CivilConnect. Check your account!`
    );
  }
};
