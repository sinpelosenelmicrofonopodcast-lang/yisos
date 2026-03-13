export async function sendOneSignalNotification({
  headings,
  contents,
  includedSegments,
  externalUserIds
}: {
  headings: Record<string, string>;
  contents: Record<string, string>;
  includedSegments?: string[];
  externalUserIds?: string[];
}) {
  const appId = process.env.ONESIGNAL_APP_ID || process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  const apiKey = process.env.ONESIGNAL_REST_API_KEY;

  if (!appId || !apiKey) {
    return { ok: false, message: "OneSignal env vars missing" };
  }

  const payload: Record<string, unknown> = {
    app_id: appId,
    headings,
    contents,
    target_channel: "push"
  };

  if (externalUserIds?.length) {
    payload.include_aliases = { external_id: externalUserIds };
  } else {
    payload.included_segments = includedSegments || ["Subscribed Users"];
  }

  const response = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      Authorization: `Key ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    return { ok: false, message: `OneSignal error: ${errorBody}` };
  }

  return { ok: true, message: "Notification queued" };
}
