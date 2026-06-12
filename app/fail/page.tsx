"use client"

import { useEffect, useState } from "react"

export default function FailPage() {
  const [message, setMessage] = useState("결제가 완료되지 않았습니다.")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const errorMessage = params.get("message")

    if (errorMessage) {
      setMessage(errorMessage)
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-3xl border border-red-500/30 bg-white/[0.04] backdrop-blur-xl p-8 text-center">
        <p className="text-red-400 tracking-[0.3em] text-sm mb-4">
          PAYMENT FAILED
        </p>

        <h1 className="text-4xl font-bold mb-5">
          결제 실패
        </h1>

        <p className="text-zinc-300 leading-7 mb-8">
          {message}
        </p>

        <a
          href="/premium"
          className="block w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-4 text-black font-bold"
        >
          다시 결제하기
        </a>
      </div>
    </main>
  )
}