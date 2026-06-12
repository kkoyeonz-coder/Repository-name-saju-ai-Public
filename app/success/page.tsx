"use client"

import { useEffect, useState } from "react"

export default function SuccessPage() {
  const [status, setStatus] = useState("confirming")
  const [message, setMessage] = useState("결제를 승인하고 있습니다...")

  useEffect(() => {
    async function confirmPayment() {
      const params = new URLSearchParams(window.location.search)

      const paymentKey = params.get("paymentKey")
      const orderId = params.get("orderId")
      const amount = params.get("amount")

      if (!paymentKey || !orderId || !amount) {
        setStatus("error")
        setMessage("결제 정보가 올바르지 않습니다.")
        return
      }

      const res = await fetch("/api/toss/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: Number(amount),
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage("결제가 완료되었습니다.")
        localStorage.setItem("premium-paid", "true")
      } else {
        setStatus("error")
        setMessage(data.message || "결제 승인 중 문제가 발생했습니다.")
      }
    }

    confirmPayment()
  }, [])

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.18),transparent_35%)]" />

      <div className="max-w-md w-full rounded-3xl border border-yellow-500/30 bg-white/[0.04] backdrop-blur-xl p-8 text-center">
        <p className="text-yellow-500 tracking-[0.3em] text-sm mb-4">
          PAYMENT RESULT
        </p>

        <h1 className="text-4xl font-bold mb-5">
          {status === "success" ? "결제 완료" : "결제 확인 중"}
        </h1>

        <p className="text-zinc-300 leading-7 mb-8">
          {message}
        </p>

        {status === "success" ? (
          <a
            href="/result"
            className="block w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-4 text-black font-bold"
          >
            프리미엄 리포트 확인하기
          </a>
        ) : (
          <a
            href="/premium"
            className="block w-full rounded-2xl border border-zinc-700 px-8 py-4 text-zinc-300"
          >
            결제 페이지로 돌아가기
          </a>
        )}
      </div>
    </main>
  )
}