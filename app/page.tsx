"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const [birth, setBirth] = useState("")
  const [time, setTime] = useState("")
  const [unknownTime, setUnknownTime] = useState(false)
  const [gender, setGender] = useState("여성")

  const handleSubmit = () => {
    if (!birth) {
      alert("생년월일을 입력해주세요.")
      return
    }

    if (!unknownTime && !time) {
      alert("태어난 시간을 입력하거나 '시간 모름'을 선택해주세요.")
      return
    }

    localStorage.setItem(
      "saju-input",
      JSON.stringify({
        birth,
        time: unknownTime ? "unknown" : time,
        unknownTime,
        gender,
      })
    )

    router.push("/result")
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.18),transparent_35%)]" />

      <div className="relative w-full max-w-md">
        <p className="text-center text-yellow-500 tracking-[0.35em] text-sm mb-5">
          PREMIUM SAJU REPORT
        </p>

        <h1 className="text-5xl font-bold text-center leading-tight">
          나만의 사주 리포트
        </h1>

        <p className="text-center text-zinc-400 mt-4 leading-7">
          생년월일을 바탕으로 성향, 연애, 재물, 직업 흐름을
          프리미엄 리포트로 분석해드립니다.
        </p>

        <div className="mt-10 rounded-[28px] border border-yellow-500/20 bg-white/[0.04] backdrop-blur-xl p-6 shadow-[0_0_60px_rgba(234,179,8,0.08)] space-y-4">
          <input
            type="date"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black/70 border border-zinc-800 text-white outline-none focus:border-yellow-500"
          />

          <input
            type="time"
            value={time}
            disabled={unknownTime}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black/70 border border-zinc-800 text-white outline-none focus:border-yellow-500 disabled:opacity-40"
          />

          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={unknownTime}
              onChange={(e) => {
                setUnknownTime(e.target.checked)
                if (e.target.checked) setTime("")
              }}
              className="h-4 w-4"
            />
            태어난 시간을 몰라요
          </label>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black/70 border border-zinc-800 text-white outline-none focus:border-yellow-500"
          >
            <option>여성</option>
            <option>남성</option>
          </select>

          <button
            onClick={handleSubmit}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold shadow-[0_0_30px_rgba(234,179,8,0.25)] hover:scale-[1.02] transition"
          >
            프리미엄 사주 리포트 보기
          </button>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-5">
          무료 미리보기 제공 · 상세 리포트는 추후 유료 전환 가능
        </p>
      </div>
    </main>
  )
}