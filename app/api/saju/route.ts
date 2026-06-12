import OpenAI from "openai"

const { Solar } = require("lunar-javascript")

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const elementMap: Record<string, string> = {
  甲: "목",
  乙: "목",
  丙: "화",
  丁: "화",
  戊: "토",
  己: "토",
  庚: "금",
  辛: "금",
  壬: "수",
  癸: "수",

  子: "수",
  丑: "토",
  寅: "목",
  卯: "목",
  辰: "토",
  巳: "화",
  午: "화",
  未: "토",
  申: "금",
  酉: "금",
  戌: "토",
  亥: "수",
}

function calculateElements(ganZhiList: string[]) {
  const counts = {
    목: 0,
    화: 0,
    토: 0,
    금: 0,
    수: 0,
  }

  ganZhiList.forEach((ganZhi) => {
    ganZhi.split("").forEach((char) => {
      const element = elementMap[char]

      if (element) {
        counts[element as keyof typeof counts]++
      }
    })
  })

  const total =
    counts.목 +
    counts.화 +
    counts.토 +
    counts.금 +
    counts.수

  return {
    counts,
    percentages: {
      목: Math.round((counts.목 / total) * 100),
      화: Math.round((counts.화 / total) * 100),
      토: Math.round((counts.토 / total) * 100),
      금: Math.round((counts.금 / total) * 100),
      수: Math.round((counts.수 / total) * 100),
    },
  }
}

export async function POST(req: Request) {
  const body = await req.json()

  const birth = body.birth
 const time = body.time
const unknownTime = body.unknownTime

const [year, month, day] = birth.split("-").map(Number)
const [hour, minute] = unknownTime ? [12, 0] : time.split(":").map(Number)

  const solar = Solar.fromYmdHms(
    year,
    month,
    day,
    hour,
    minute,
    0
  )

  const lunar = solar.getLunar()

  const yearGanZhi = lunar.getYearInGanZhi()
  const monthGanZhi = lunar.getMonthInGanZhi()
  const dayGanZhi = lunar.getDayInGanZhi()
  const timeGanZhi = lunar.getTimeInGanZhi()

  const elements = calculateElements([
    yearGanZhi,
    monthGanZhi,
    dayGanZhi,
    timeGanZhi,
  ])

  const completion =
    await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
너는 20년 경력의 전문 명리학자다.

성격
연애운
재물운
직업운

을 자세히 분석하라.
`,
        },
        {
          role: "user",
          content: `
생년월일: ${birth}
태어난 시간: ${unknownTime ? "모름, 정오 기준으로 임시 분석" : time}
성별: ${body.gender}

년주: ${yearGanZhi}
월주: ${monthGanZhi}
일주: ${dayGanZhi}
시주: ${timeGanZhi}

오행 비율:
목 ${elements.percentages.목}%
화 ${elements.percentages.화}%
토 ${elements.percentages.토}%
금 ${elements.percentages.금}%
수 ${elements.percentages.수}%
`,
        },
      ],
    })

  return Response.json({
    saju: {
      year: yearGanZhi,
      month: monthGanZhi,
      day: dayGanZhi,
      time: timeGanZhi,
    },
    elements,
    result:
      completion.choices[0].message.content ?? "",
  })
}

export async function GET() {
  return Response.json({
    status: "ok",
  })
}