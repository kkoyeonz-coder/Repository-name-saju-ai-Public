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
      alert("태어난 시간을 입력하거나 '태어난 시간을 몰라요'를 선택해주세요.")
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
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-20">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.2),transparent_35%)]" />

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-yellow-500 tracking-[0.35em] text-sm mb-5">
            PERSONAL SAJU INSIGHT
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            나의 사주 인사이트
          </h1>

          <p className="text-zinc-400 mt-5 leading-7">
            생년월일을 입력하면 사주팔자, 오행 흐름,
            핵심 운세 인사이트를 확인할 수 있습니다.
          </p>
        </div>

        <div className="rounded-[28px] border border-yellow-500/20 bg-white/[0.04] backdrop-blur-xl p-6 shadow-[0_0_60px_rgba(234,179,8,0.08)] space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              생년월일
            </label>

            <input
              type="date"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
              className="w-full p-4 rounded-2xl bg-black/70 border border-zinc-800 text-white outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              태어난 시간
            </label>

            <input
              type="time"
              value={time}
              disabled={unknownTime}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-4 rounded-2xl bg-black/70 border border-zinc-800 text-white outline-none focus:border-yellow-500 disabled:opacity-40"
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={unknownTime}
              onChange={(e) => {
                setUnknownTime(e.target.checked)

                if (e.target.checked) {
                  setTime("")
                }
              }}
              className="h-4 w-4"
            />
            태어난 시간을 몰라요
          </label>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              성별
            </label>

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-4 rounded-2xl bg-black/70 border border-zinc-800 text-white outline-none focus:border-yellow-500"
            >
              <option>여성</option>
              <option>남성</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold shadow-[0_0_30px_rgba(234,179,8,0.25)] hover:scale-[1.02] transition"
          >
            사주 인사이트 확인하기
          </button>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-5">
          핵심 인사이트 확인 후 프리미엄 상세 리포트를 열람할 수 있습니다.
        </p>
      </div>
    </main>
  )
}