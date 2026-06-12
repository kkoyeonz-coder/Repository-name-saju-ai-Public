"use client"

import { useEffect, useState } from "react"

export default function ResultPage() {
  const [data, setData] = useState<any>(null)
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(true)
  const [premiumPaid, setPremiumPaid] = useState(false)

  useEffect(() => {
    const paid = localStorage.getItem("premium-paid") === "true"
    setPremiumPaid(paid)

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
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="mb-6">입력 정보가 없습니다.</p>

          <a
            href="/"
            className="inline-block rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-3 text-black font-bold"
          >
            사주 입력하러 가기
          </a>
        </div>
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
              {premiumPaid ? "PREMIUM REPORT UNLOCKED" : "PREMIUM REPORT LOCKED"}
            </p>

            <h2 className="text-3xl font-bold text-yellow-400 mb-3">
              프리미엄 상세 리포트
            </h2>

            <p className="text-zinc-400 leading-7">
              {premiumPaid
                ? "결제가 확인되어 프리미엄 상세 리포트가 열렸습니다."
                : "아래 내용은 프리미엄 리포트에서 제공되는 심층 분석의 일부입니다. 결제 후 전체 내용을 제한 없이 확인할 수 있습니다."}
            </p>
          </div>

          <div className="relative rounded-2xl border border-zinc-800 bg-black/50 p-6 overflow-hidden">
            <div
              className={
                premiumPaid
                  ? "space-y-8 text-zinc-300 leading-8"
                  : "space-y-8 text-zinc-300 leading-8 blur-[3px] select-none pointer-events-none max-h-[620px]"
              }
            >
              <section>
                <h3 className="text-xl font-bold text-white mb-3">
                  1. 연애운 심층 분석
                </h3>
                <p>
                  이 사주는 관계에서 단순한 설렘보다 정서적 안정감과 신뢰를
                  중요하게 보는 흐름이 강합니다. 겉으로는 담담해 보여도 실제로는
                  상대의 말투, 태도, 연락의 흐름, 약속을 지키는 방식에 민감하게
                  반응할 수 있습니다.
                </p>
                <p className="mt-3">
                  연애에서는 빠르게 불타오르는 관계보다 천천히 쌓이는 관계가
                  더 오래갈 가능성이 높습니다. 상대가 꾸준하고 일관된 모습을
                  보여줄 때 마음이 열리며, 반대로 애매한 태도나 갑작스러운 거리감은
                  큰 불안으로 이어질 수 있습니다.
                </p>
                <p className="mt-3">
                  좋은 인연은 대체로 말보다 행동이 안정적인 사람, 감정 기복이
                  심하지 않은 사람, 현실적인 책임감을 가진 사람 쪽에서 들어올
                  가능성이 큽니다. 관계를 시작할 때는 첫인상의 강렬함보다
                  시간이 지날수록 편안해지는지를 보는 것이 중요합니다.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">
                  2. 결혼운과 장기 관계
                </h3>
                <p>
                  결혼운은 감정보다 생활의 합이 중요하게 나타납니다. 단순히
                  좋아하는 마음만으로는 오래 유지되기 어렵고, 서로의 생활 방식,
                  돈을 쓰는 습관, 가족과의 거리감, 책임을 나누는 방식이 관계의
                  안정성을 결정할 가능성이 높습니다.
                </p>
                <p className="mt-3">
                  배우자 인연은 현실 감각이 있고 약속을 가볍게 여기지 않는
                  사람과 잘 맞습니다. 지나치게 감정적이거나 즉흥적인 상대보다는
                  꾸준히 신뢰를 쌓아가는 사람이 더 좋은 궁합으로 보입니다.
                </p>
                <p className="mt-3">
                  장기 관계에서는 혼자 참다가 한 번에 폭발하는 패턴을 조심해야 합니다.
                  불편한 점을 초기에 부드럽게 말하는 습관을 만들면 결혼 후 갈등을
                  크게 줄일 수 있습니다.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">
                  3. 재물운과 돈의 흐름
                </h3>
                <p>
                  재물운은 한 번에 큰돈이 들어오는 운보다 꾸준히 쌓고 관리하는
                  흐름에 더 가깝습니다. 돈을 벌 기회는 있어도 관리 방식이 흔들리면
                  새는 돈이 생기기 쉬우므로, 수입보다 지출 구조를 먼저 정리하는 것이
                  중요합니다.
                </p>
                <p className="mt-3">
                  특히 사람 관계에서 생기는 지출, 감정적인 소비, 미래 불안을
                  달래기 위한 충동구매를 조심할 필요가 있습니다. 반대로 목표를
                  정하고 자동으로 모이는 구조를 만들어두면 생각보다 안정적으로
                  자산이 쌓일 수 있습니다.
                </p>
                <p className="mt-3">
                  투자나 부업은 단기간의 큰 수익을 노리기보다, 본인의 지식과
                  경험이 쌓이는 분야에서 천천히 확장하는 방식이 잘 맞습니다.
                  남들이 좋다고 하는 흐름을 따라가기보다 본인이 이해할 수 있는
                  영역 안에서 움직이는 것이 유리합니다.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">
                  4. 직업운과 커리어 방향
                </h3>
                <p>
                  직업운에서는 단순 반복 업무보다 판단력, 감각, 분석력, 사람에 대한
                  이해를 활용하는 환경에서 강점이 살아납니다. 정해진 틀만 따르는
                  일보다는 스스로 방향을 잡고 개선점을 찾을 수 있는 일이 더 잘 맞습니다.
                </p>
                <p className="mt-3">
                  커리어에서는 초반에 속도가 느리게 느껴질 수 있지만, 한 분야에서
                  경험이 쌓일수록 신뢰와 실력이 함께 올라가는 타입입니다. 그래서
                  단기 성과보다 전문성을 축적하는 방식이 장기적으로 더 유리합니다.
                </p>
                <p className="mt-3">
                  잘 맞는 방향은 상담, 콘텐츠, 기획, 교육, 분석, 브랜딩, 서비스,
                  사람의 니즈를 읽는 일과 관련될 수 있습니다. 특히 감성적 직관과
                  현실적 판단을 함께 쓰는 분야에서 장점이 드러날 가능성이 있습니다.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">
                  5. 올해 운세와 인생 전환점
                </h3>
                <p>
                  올해의 흐름은 기존의 방식을 그대로 유지하기보다, 생활 구조와
                  일의 방향을 다시 정리하는 데 의미가 있습니다. 갑작스럽게 모든 것을
                  바꾸기보다는 현재의 문제점을 하나씩 정리하면서 더 나은 구조로
                  옮겨가는 과정이 중요합니다.
                </p>
                <p className="mt-3">
                  인간관계에서는 불필요하게 에너지를 빼앗는 관계를 정리하고,
                  나에게 안정감을 주는 관계를 남기는 흐름이 좋습니다. 일에서는
                  새로운 기회가 오더라도 조급하게 결정하기보다 조건과 지속 가능성을
                  꼼꼼히 보는 것이 필요합니다.
                </p>
                <p className="mt-3">
                  올해는 작은 선택들이 이후 몇 년의 방향성을 만드는 시기로 볼 수 있습니다.
                  특히 돈, 일, 관계에서 반복되는 패턴을 알아차리고 바꾸는 것이
                  가장 중요한 운의 활용법입니다.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">
                  6. 오행 균형에 따른 현실 조언
                </h3>
                <p>
                  오행의 균형은 성향과 에너지 사용 방식을 보여줍니다. 강한 기운은
                  장점으로 쓰면 추진력과 매력이 되지만, 과하면 고집이나 피로감으로
                  나타날 수 있습니다. 부족한 기운은 단점이라기보다 의식적으로
                  보완해야 하는 생활 습관에 가깝습니다.
                </p>
                <p className="mt-3">
                  중요한 것은 타고난 사주를 바꾸려는 것이 아니라, 자신의 흐름을 알고
                  더 좋은 선택을 하는 것입니다. 잘 맞는 환경에 있을 때는 일이 부드럽게
                  풀리고, 맞지 않는 환경에 오래 머물면 같은 노력을 해도 피로가 커질 수 있습니다.
                </p>
                <p className="mt-3">
                  앞으로는 감정적으로 흔들릴 때 바로 결론을 내리기보다, 하루 정도
                  시간을 두고 판단하는 습관이 도움이 됩니다. 또한 돈과 관계에서는
                  “내가 편안하게 지속할 수 있는가”를 기준으로 선택하면 운의 흐름을
                  더 안정적으로 사용할 수 있습니다.
                </p>
              </section>
            </div>

            {!premiumPaid && (
              <>
                <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/90 to-transparent" />

                <div className="absolute inset-0 flex items-end justify-center p-6">
                  <div className="rounded-2xl border border-yellow-500/30 bg-black/80 px-5 py-4 text-center backdrop-blur-md">
                    <p className="text-yellow-400 font-bold">
                      전체 상세 리포트가 잠겨 있습니다
                    </p>
                    <p className="text-sm text-zinc-400 mt-2">
                      결제 후 모든 심층 해석을 확인할 수 있습니다.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {!premiumPaid && (
            <div className="mt-8 rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-transparent p-6 text-center">
              <p className="text-yellow-400 font-bold text-xl mb-3">
                전체 프리미엄 리포트를 확인하시겠어요?
              </p>

              <p className="text-zinc-300 leading-7 mb-6">
                연애운, 결혼운, 재물운, 직업운, 올해 운세,
                인생 전환점까지 더 길고 구체적인 해석을 제공합니다.
              </p>

              <a
                href="/premium"
                className="block w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-4 text-black font-bold shadow-[0_0_30px_rgba(234,179,8,0.25)] hover:scale-[1.01] transition"
              >
                프리미엄 상세 리포트 열기 ₩9,900
              </a>
            </div>
          )}

          {premiumPaid && (
            <div className="mt-8 rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-transparent p-6 text-center">
              <p className="text-yellow-400 font-bold text-xl mb-3">
                프리미엄 리포트가 열렸습니다
              </p>

              <p className="text-zinc-300 leading-7">
                결제 정보가 확인되어 전체 상세 리포트를 볼 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}