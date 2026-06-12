export async function POST(req: Request) {
  const { paymentKey, orderId, amount } = await req.json()

  const secretKey = process.env.TOSS_SECRET_KEY

  if (!secretKey) {
    return Response.json(
      { message: "TOSS_SECRET_KEY가 설정되지 않았습니다." },
      { status: 500 }
    )
  }

  const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString("base64")

  const response = await fetch(
    "https://api.tosspayments.com/v1/payments/confirm",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    }
  )

  const data = await response.json()

  return Response.json(data, {
    status: response.status,
  })
}