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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.18),transparent_35%)]" />

        <div className="text-center max-w-md">
          <p className="text-yellow-500 tracking-[0.35em] text-sm mb-4">
            ANALYZING YOUR SAJU
          </p>

          <h1 className="text-4xl font-bold mb-6 leading-tight">
            사주 리포트를 작성하고 있습니다
          </h1>

          <div className="rounded-3xl border border-yellow-500/20 bg-white/[0.04] backdrop-blur-xl p-6 space-y-4 text-zinc-300">
            <p>🔮 사주 원국을 계산하고 있습니다...</p>
            <p>☯️ 오행의 균형을 분석하고 있습니다...</p>
            <p>✨ 맞춤 인사이트를 정리하고 있습니다...</p>
          </div>

          <div className="mt-8 h-2 bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse" />
          </div>

          <p className="text-xs text-zinc-500 mt-6">
            분석에는 잠시 시간이 걸릴 수 있습니다.
          </p>
        </div>
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
            PERSONAL SAJU INSIGHT
          </p>

          <h1 className="text-5xl font-bold mb-5">
            나의 사주 인사이트
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
                <p className="text-2xl font-bold">{data.saju.year}</p>
              </div>

              <div className="bg-black/70 border border-zinc-800 rounded-2xl p-4">
                <p className="text-zinc-400 mb-2">월주</p>
                <p className="text-2xl font-bold">{data.saju.month}</p>
              </div>

              <div className="bg-black/70 border border-zinc-800 rounded-2xl p-4">
                <p className="text-zinc-400 mb-2">일주</p>
                <p className="text-2xl font-bold">{data.saju.day}</p>
              </div>

              <div className="bg-black/70 border border-zinc-800 rounded-2xl p-4">
                <p className="text-zinc-400 mb-2">시주</p>
                <p className="text-2xl font-bold">{data.saju.time}</p>
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
            미리 보는 핵심 인사이트
          </h2>

          <div className="text-zinc-200 leading-9 whitespace-pre-wrap">
            {result}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-yellow-500/30 bg-white/[0.04] p-6 shadow-[0_0_50px_rgba(234,179,8,0.06)]">
          <div className="mb-6">
            <p className="text-yellow-500 tracking-[0.25em] text-xs mb-3">
              PREMIUM REPORT LOCKED
            </p>

            <h2 className="text-3xl font-bold text-yellow-400 mb-3">
              프리미엄 상세 리포트
            </h2>

            <p className="text-zinc-400 leading-7">
              아래 내용은 프리미엄 리포트에서 제공되는 심층 분석의 일부입니다.
              결제 후 전체 내용을 제한 없이 확인할 수 있습니다.
            </p>
          </div>

          <div className="relative max-h-[620px] overflow-hidden rounded-2xl border border-zinc-800 bg-black/50 p-6">
            <div className="blur-[3px] select-none pointer-events-none">
              <div className="space-y-8 text-zinc-300 leading-8">
                <section>
                  <h3 className="text-xl font-bold text-white mb-3">
                    1. 연애운 심층 분석
                  </h3>
                  <p>
                    이 사주는 단순히 누군가를 좋아하는 방식보다,
                    관계 안에서 안정감을 어떻게 느끼는지가 중요하게 나타납니다.
                    겉으로는 담담해 보여도 마음속에서는 상대의 말투, 태도,
                    연락의 흐름을 세밀하게 감지하는 편입니다.
                  </p>
                  <p className="mt-3">
                    프리미엄 리포트에서는 어떤 유형의 사람과 잘 맞는지,
                    어떤 관계에서 상처를 반복하기 쉬운지, 좋은 인연이 들어올 때
                    어떤 신호로 나타나는지까지 더 자세히 분석합니다.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">
                    2. 결혼운과 장기 관계
                  </h3>
                  <p>
                    장기적인 관계에서는 감정보다 현실적인 안정감이 중요한 흐름으로 보입니다.
                    서로의 생활 방식, 돈을 대하는 태도, 가족관계에서의 거리감이
                    결혼 만족도에 큰 영향을 줄 수 있습니다.
                  </p>
                  <p className="mt-3">
                    상세 리포트에서는 결혼에 유리한 흐름, 배우자에게서 중요하게 봐야 할 점,
                    결혼 후 갈등을 줄이는 방식까지 구체적으로 다룹니다.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">
                    3. 재물운과 돈의 흐름
                  </h3>
                  <p>
                    재물운은 단순히 돈이 들어오는 시기보다 돈을 어떻게 지키고 키우는지에서
                    더 선명하게 드러납니다. 한 번 방향을 잡으면 꾸준히 쌓아가는 힘이 있지만,
                    감정적인 소비나 사람 관계에서 생기는 지출을 조심할 필요가 있습니다.
                  </p>
                  <p className="mt-3">
                    프리미엄 분석에서는 재물이 강해지는 시기, 피해야 할 소비 패턴,
                    투자나 부업과의 궁합, 돈이 모이는 생활 구조까지 더 깊게 해석합니다.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">
                    4. 직업운과 커리어 방향
                  </h3>
                  <p>
                    일에서는 단순 반복보다 자신의 판단력과 감각을 활용할 수 있는 환경에서
                    더 좋은 성과가 나타납니다. 사람을 상대하는 일, 기획력이나 분석력이 필요한 일,
                    전문성을 쌓아가는 분야에서 강점이 드러날 수 있습니다.
                  </p>
                  <p className="mt-3">
                    상세 리포트에서는 직장형인지 사업형인지, 어떤 업종과 맞는지,
                    커리어 전환 시기와 피해야 할 업무 방식까지 구체적으로 안내합니다.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">
                    5. 올해 운세와 인생 전환점
                  </h3>
                  <p>
                    특정 시기에는 인간관계, 돈, 일의 흐름이 동시에 바뀌는 구간이 나타날 수 있습니다.
                    이때 어떤 선택을 하느냐에 따라 이후 몇 년의 방향성이 달라질 수 있습니다.
                    프리미엄 리포트에서는 앞으로 주목해야 할 시기와 조심해야 할 흐름을
                    더 구체적으로 분석합니다.
                  </p>
                </section>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/90 to-transparent" />

            <div className="absolute inset-0 flex items-end justify-center p-6">
              <div className="rounded-2xl border border-yellow-500/30 bg-black/80 px-5 py-4 text-center backdrop-blur-md">
                <p className="text-yellow-400 font-bold">
                  전체 상세 리포트가 잠겨 있습니다
                </p>
                <p className="text-sm text-zinc-400 mt-2">
                  아래 결제 후 모든 심층 해석을 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-transparent p-6 text-center">
            <p className="text-yellow-400 font-bold text-xl mb-3">
              전체 프리미엄 리포트를 확인하시겠어요?
            </p>

            <p className="text-zinc-300 leading-7 mb-6">
              연애운, 결혼운, 재물운, 직업운, 올해 운세, 인생 전환점까지
              더 길고 구체적인 해석을 제공합니다.
            </p>

            <a
  href="/premium"
  className="block w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-4 text-black font-bold shadow-[0_0_30px_rgba(234,179,8,0.25)] hover:scale-[1.01] transition"
>
  프리미엄 상세 리포트 열기 ₩9,900
</a>

            <p className="text-center text-xs text-zinc-500 mt-4">
              결제 기능은 다음 단계에서 연결됩니다.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}