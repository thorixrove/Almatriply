type PushMessage = {
    to: string
    title: string
    body: string
    data?: Record<string, unknown>
}

export async function sendPushNotifications(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, unknown>
) {
    const validTokens = tokens.filter((t) => t && t.startsWith("ExponentPushToken"))
    if (validTokens.length === 0) return

    const messages: PushMessage[] = validTokens.map((token) => ({
        to: token,
        title,
        body,
        data,
    }))

  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    })
  } catch (error) {
    console.log("Push notification send error:", error)
  }
}