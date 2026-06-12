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
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center">
          사주 결과
        </h1>

        {data && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <p>생년월일: {data.birth}</p>
            <p>태어난 시간: {data.time}</p>
            <p>성별: {data.gender}</p>
          </div>
        )}

        {data?.saju && (
          <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              사주팔자
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-black rounded-2xl p-4">
                <p className="text-zinc-400 mb-2">년주</p>
                <p className="text-2xl font-bold">
                  {data.saju.year}
                </p>
              </div>

              <div className="bg-black rounded-2xl p-4">
                <p className="text-zinc-400 mb-2">월주</p>
                <p className="text-2xl font-bold">
                  {data.saju.month}
                </p>
              </div>

              <div className="bg-black rounded-2xl p-4">
                <p className="text-zinc-400 mb-2">일주</p>
                <p className="text-2xl font-bold">
                  {data.saju.day}
                </p>
              </div>

              <div className="bg-black rounded-2xl p-4">
                <p className="text-zinc-400 mb-2">시주</p>
                <p className="text-2xl font-bold">
                  {data.saju.time}
                </p>
              </div>
            </div>
          </div>
        )}

        {data?.elements && (
          <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              오행 분석
            </h2>

            <div className="space-y-4">
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
                      className="h-full bg-yellow-500 rounded-full transition-all duration-1000"
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

        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-4">
            프리미엄 사주 해석
          </h2>

          {loading ? (
            <p className="text-zinc-400">
              🔮 원국과 오행 흐름을 정밀 분석하고 있습니다.
            </p>
          ) : (
            <div className="text-zinc-300 leading-8 whitespace-pre-wrap">
              {result}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}