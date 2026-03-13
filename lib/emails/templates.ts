export function welcomeTemplate(name = "there") {
  return {
    subject: "Welcome to YISOS CIGARS",
    html: `<div style="font-family:Arial,sans-serif;background:#0f0f0d;color:#e8dcc2;padding:24px"><h1 style="font-family:Georgia,serif;color:#d6aa5e">Welcome, ${name}</h1><p>You are now inside the YISOS private list for exclusive drops and lounge invitations.</p></div>`
  };
}

export function orderConfirmationTemplate(orderNumber: string, total: number) {
  return {
    subject: `Order Confirmed: ${orderNumber}`,
    html: `<div style="font-family:Arial,sans-serif;background:#0f0f0d;color:#e8dcc2;padding:24px"><h1 style="font-family:Georgia,serif;color:#d6aa5e">Order confirmed</h1><p>Order <strong>${orderNumber}</strong> is now in our fulfillment queue.</p><p>Total: $${total.toFixed(2)}</p></div>`
  };
}

export function shippingUpdateTemplate(orderNumber: string, trackingUrl: string) {
  return {
    subject: `Shipping Update: ${orderNumber}`,
    html: `<div style="font-family:Arial,sans-serif;background:#0f0f0d;color:#e8dcc2;padding:24px"><h1 style="font-family:Georgia,serif;color:#d6aa5e">Your order is on the move</h1><p>Track shipment here: <a href="${trackingUrl}" style="color:#d6aa5e">Track package</a></p></div>`
  };
}

export function abandonedCartTemplate(recoveryUrl: string) {
  return {
    subject: "Your selection is waiting",
    html: `<div style="font-family:Arial,sans-serif;background:#0f0f0d;color:#e8dcc2;padding:24px"><h1 style="font-family:Georgia,serif;color:#d6aa5e">Your cart is still reserved</h1><p>Complete checkout before inventory shifts.</p><a href="${recoveryUrl}" style="color:#d6aa5e">Return to cart</a></div>`
  };
}

export function membershipWelcomeTemplate(tierName: string) {
  return {
    subject: `Welcome to ${tierName}`,
    html: `<div style="font-family:Arial,sans-serif;background:#0f0f0d;color:#e8dcc2;padding:24px"><h1 style="font-family:Georgia,serif;color:#d6aa5e">Membership Activated</h1><p>Your ${tierName} access is live with drop priority and lounge invitations.</p></div>`
  };
}

export function promoTemplate(title: string, body: string, ctaUrl: string) {
  return {
    subject: title,
    html: `<div style="font-family:Arial,sans-serif;background:#0f0f0d;color:#e8dcc2;padding:24px"><h1 style="font-family:Georgia,serif;color:#d6aa5e">${title}</h1><p>${body}</p><a href="${ctaUrl}" style="color:#d6aa5e">Explore now</a></div>`
  };
}
