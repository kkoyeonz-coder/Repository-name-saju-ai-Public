"use client"

import { useState } from "react"
import { ANONYMOUS, loadTossPayments } from "@tosspayments/tosspayments-sdk"

export default function PremiumPage() {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    try {
      setLoading(true)

      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY

      if (!clientKey) {
        alert("토스 클라이언트 키가 설정되지 않았습니다.")
        setLoading(false)
        return
      }

      const tossPayments = await loadTossPayments(clientKey)

      const payment = tossPayments.payment({
        customerKey: ANONYMOUS,
      })

      const orderId = `saju_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 10)}`

      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: 9900,
        },
        orderId,
        orderName: "프리미엄 사주 상세 리포트",
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
        customerName: "사주 고객",
      })
    } catch (error) {
      console.error(error)
      alert("결제창을 여는 중 문제가 발생했습니다.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-20">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.18),transparent_35%)]" />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-yellow-500 tracking-[0.35em] text-sm mb-4">
            PREMIUM REPORT
          </p>

          <h1 className="text-5xl font-bold mb-5">
            프리미엄 상세 리포트
          </h1>

          <p className="text-zinc-400 leading-7">
            핵심 인사이트보다 더 깊고 구체적인 연애, 결혼, 재물,
            직업, 올해 운세 분석을 확인하세요.
          </p>
        </div>

        <div className="rounded-3xl border border-yellow-500/30 bg-white/[0.04] backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(234,179,8,0.08)]">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6">
            프리미엄 리포트에 포함되는 내용
          </h2>

          <div className="space-y-4 text-zinc-300 leading-7">
            <p>✅ 연애운 심층 분석</p>
            <p>✅ 결혼운과 배우자 성향</p>
            <p>✅ 재물운과 돈의 흐름</p>
            <p>✅ 직업운과 커리어 방향</p>
            <p>✅ 올해 운세와 중요한 전환점</p>
            <p>✅ 오행 균형에 따른 현실 조언</p>
          </div>

          <div className="mt-8 rounded-3xl bg-black/60 border border-zinc-800 p-6 text-center">
            <p className="text-zinc-400 mb-2">
              프리미엄 상세 리포트
            </p>

            <p className="text-4xl font-bold text-yellow-400 mb-6">
              ₩9,900
            </p>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-4 text-black font-bold shadow-[0_0_30px_rgba(234,179,8,0.25)] disabled:opacity-50"
            >
              {loading ? "결제창을 여는 중..." : "₩9,900 결제하고 리포트 열기"}
            </button>

            <p className="text-xs text-zinc-500 mt-4">
              테스트 결제 단계입니다. 실제 운영 전에는 토스페이먼츠 심사 및 실결제 키 전환이 필요합니다.
            </p>
          </div>
        </div>

        <a
          href="/"
          className="block text-center text-zinc-500 mt-8 hover:text-yellow-400"
        >
          처음으로 돌아가기
        </a>
      </div>
    </main>
  )
}