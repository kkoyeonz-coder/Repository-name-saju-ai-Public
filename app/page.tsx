"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const [birth, setBirth] = useState("")
  const [time, setTime] = useState("")
  const [gender, setGender] = useState("여성")

  const handleSubmit = () => {
    if (!birth || !time) {
      alert("생년월일과 태어난 시간을 입력해주세요.")
      return
    }

    localStorage.setItem(
      "saju-input",
      JSON.stringify({
        birth,
        time,
        gender,
      })
    )

    router.push("/result")
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-6xl font-bold text-center">
          AI 사주 분석
        </h1>

        <p className="text-center text-zinc-400 mt-4">
          생년월일을 입력하고 AI 사주를 확인하세요
        </p>

        <div className="mt-10 space-y-4">
          <input
            type="date"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800"
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800"
          >
            <option>여성</option>
            <option>남성</option>
          </select>

          <button
            onClick={handleSubmit}
            className="w-full p-4 rounded-xl bg-yellow-500 text-black font-bold"
          >
            사주 분석하기
          </button>
        </div>
      </div>
    </main>
  )
}