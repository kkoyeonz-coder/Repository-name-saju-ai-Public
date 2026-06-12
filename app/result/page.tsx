"use client"

import { useEffect, useState } from "react"

export default function ResultPage() {
  const [data, setData] = useState<any>(null)
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("saju-input")

    if (!saved) {
      setLoading(false)
      return
    }

    const input = JSON.parse(saved)

    async function getResult() {
      const res = await fetch("/api/saju", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      })

      const json = await res.json()

      setData({
        ...input,
        saju: json.saju,
        elements: json.elements,
      })

      setResult(json.result)
      setLoading(false)
    }

    getResult()
  }, [])

  if (!data && !loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        입력 정보가 없습니다.
      </main>
    )
  }

  const elementItems = data?.elements
    ? [
        { name: "목", value: data.elements.percentages.목, icon: "🌳" },
        { name: "화", value: data.elements.percentages.화, icon: "🔥" },
        { name: "토", value: data.elements.percentages.토, icon: "🟫" },
        { name: "금", value: data.elements.percentages.금, icon: "⚪" },
        { name: "수", value: data.elements.percentages.수, icon: "💧" },
      ]
    : []

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-20">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.18),transparent_35%)]" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-yellow-500 tracking-[0.35em] text-sm mb-4">
            FREE PREVIEW REPORT
          </p>

          <h1 className="text-5xl font-bold mb-5">
            사주 리포트 미리보기
          </h1>

          <p className="text-zinc-400 leading-7">
            고객님의 사주 원국과 오행 흐름을 바탕으로
            핵심 기질과 운의 방향성을 먼저 보여드립니다.
          </p>
        </div>

        {data && (
          <div className="bg-white/[0.04] backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-6 space-y-4 shadow-[0_0_60px_rgba(234,179,8,0.08)]">
            <p>생년월일: {data.birth}</p>

            <p>
              태어난 시간:{" "}
              {data.unknownTime ? "시간 모름" : data.time}
            </p>

            <p>성별: {data.gender}</p>

            {data.unknownTime && (
              <p className="text-sm text-yellow-500 leading-6">
                ※ 태어난 시간을 모르는 경우 시주 해석은 제외하고,
                년주·월주·일주를 기준으로 분석합니다.
              </p>
            )}
          </div>
        )}

        {data?.saju && (
          <div className="mt-8 bg-white/[0.04] backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-6 shadow-[0_0_50px_rgba(234,179,8,0.06)]">
            <h2 className="text-2xl font-bold mb-6 text-yellow-400">
              나의 사주팔자
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-black/70 border border-zinc-800 rounded-2xl p-4">
                <p className="text-zinc-400 mb-2">년주</p>
                <p className="text-2xl font-bold">
                  {data.saju.year}
                </p>
              </div>

              <div className="bg-black/70 border border-zinc-800 rounded-2xl p-4">
                <p className="text-zinc-400 mb-2">월주</p>
                <p className="text-2xl font-bold">
                  {data.saju.month}
                </p>
              </div>

              <div className="bg-black/70 border border-zinc-800 rounded-2xl p-4">
                <p className="text-zinc-400 mb-2">일주</p>
                <p className="text-2xl font-bold">
                  {data.saju.day}
                </p>
              </div>

              <div className="bg-black/70 border border-zinc-800 rounded-2xl p-4">
                <p className="text-zinc-400 mb-2">시주</p>
                <p className="text-2xl font-bold">
                  {data.saju.time}
                </p>
              </div>
            </div>
          </div>
        )}

        {data?.elements && (
          <div className="mt-8 bg-white/[0.04] backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-6 shadow-[0_0_50px_rgba(234,179,8,0.06)]">
            <h2 className="text-2xl font-bold mb-6 text-yellow-400">
              오행 에너지 분석
            </h2>

            <div className="space-y-5">
              {elementItems.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between mb-2">
                    <span>
                      {item.icon} {item.name}
                    </span>

                    <span className="text-zinc-400">
                      {item.value}%
                    </span>
                  </div>

                  <div className="h-3 bg-black rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-1000"
                      style={{
                        width: `${item.value}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-white/[0.04] backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-6 shadow-[0_0_50px_rgba(234,179,8,0.06)]">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">
            무료 미리보기 해석
          </h2>

          {loading ? (
            <div className="space-y-3 text-zinc-400">
              <p>🔮 사주 원국을 계산하고 있습니다...</p>
              <p>☯️ 오행의 균형을 분석하고 있습니다...</p>
              <p>✨ 무료 리포트를 작성하고 있습니다...</p>
            </div>
          ) : (
            <div className="text-zinc-200 leading-9 whitespace-pre-wrap">
              {result}
            </div>
          )}
        </div>

        <div className="mt-8 relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-white/[0.04] p-6">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40" />

          <div className="relative">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              프리미엄 상세 리포트에서 열리는 내용
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {[
                "연애운 심층 분석",
                "결혼운과 배우자 성향",
                "재물운과 돈의 흐름",
                "직업운과 커리어 방향",
                "2026년 올해 운세",
                "인생 전환점과 주의 시기",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-zinc-800 bg-black/60 p-4 text-zinc-300"
                >
                  🔒 {item}
                </div>
              ))}
            </div>

            <p className="text-zinc-300 leading-7 mb-6">
              지금 보신 내용은 전체 리포트의 일부입니다.  
              프리미엄 리포트에서는 연애, 결혼, 재물, 직업, 올해 흐름까지
              훨씬 더 구체적이고 긴 해석으로 제공됩니다.
            </p>

            <button className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-4 text-black font-bold shadow-[0_0_30px_rgba(234,179,8,0.25)] hover:scale-[1.01] transition">
              프리미엄 상세 리포트 열기 ₩9,900
            </button>

            <p className="text-center text-xs text-zinc-500 mt-4">
              결제 기능은 다음 단계에서 연결됩니다.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}