import OpenAI from "openai"

const { Solar } = require("lunar-javascript")

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
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
        counts[element as keyof typeof counts] += 1
      }
    })
  })

  const total =
    counts.목 +
    counts.화 +
    counts.토 +
    counts.금 +
    counts.수 || 1

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
  const gender = body.gender

  const [year, month, day] = birth.split("-").map(Number)

  const [hour, minute] = unknownTime
    ? [12, 0]
    : time.split(":").map(Number)

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

  const timeGanZhi = unknownTime
    ? "시간 모름"
    : lunar.getTimeInGanZhi()

  const ganZhiList = unknownTime
    ? [yearGanZhi, monthGanZhi, dayGanZhi]
    : [yearGanZhi, monthGanZhi, dayGanZhi, timeGanZhi]

  const elements = calculateElements(ganZhiList)

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `
너는 대한민국 최고 수준의 명리학자이자 프리미엄 사주 리포트 작성 전문가다.

이번 응답은 "무료 미리보기 리포트"다.
전체 상세 리포트를 다 보여주면 안 된다.

목표:
- 사용자가 "내 얘기 같다"고 느끼게 한다.
- 하지만 모든 내용을 다 공개하지 않는다.
- 더 긴 상세 리포트를 보고 싶도록 자연스럽게 유도한다.
- 공포 마케팅은 하지 않는다.
- 고급스럽고 신뢰감 있는 말투를 사용한다.

분량:
- 전체 900자에서 1300자 정도.
- 너무 짧지 않게, 하지만 유료 리포트처럼 모든 것을 다 풀지 않는다.

반드시 아래 형식으로 작성한다.

# 1. 핵심 기질 요약
- 타고난 성향을 2~3문단으로 설명한다.
- 강점과 주의점을 함께 말한다.

# 2. 연애와 관계 맛보기
- 연애 성향을 간단히 말한다.
- 관계에서 반복될 수 있는 패턴을 살짝 언급한다.

# 3. 재물과 직업 흐름 맛보기
- 돈과 일에서 어떤 방향성이 있는지 요약한다.
- 자세한 시기와 전략은 프리미엄 리포트에서 확인할 수 있다고 자연스럽게 연결한다.

# 4. 오행 밸런스 한줄 조언
- 오행 비율을 참고해서 균형 조언을 한다.

# 5. 프리미엄 리포트 안내
- 상세 리포트에서는 연애운, 결혼운, 재물운, 직업운, 인생 전환점, 올해 운세를 더 깊게 분석한다고 안내한다.
- 구매를 강요하지 말고, 궁금증을 자극하는 문장으로 마무리한다.
`,
      },
      {
        role: "user",
        content: `
생년월일: ${birth}
태어난 시간: ${unknownTime ? "시간 모름" : time}
성별: ${gender}

사주팔자:
년주: ${yearGanZhi}
월주: ${monthGanZhi}
일주: ${dayGanZhi}
시주: ${timeGanZhi}

오행 개수:
목: ${elements.counts.목}
화: ${elements.counts.화}
토: ${elements.counts.토}
금: ${elements.counts.금}
수: ${elements.counts.수}

오행 비율:
목: ${elements.percentages.목}%
화: ${elements.percentages.화}%
토: ${elements.percentages.토}%
금: ${elements.percentages.금}%
수: ${elements.percentages.수}%

이 정보를 바탕으로 무료 미리보기 리포트를 작성해줘.
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
    result: completion.choices[0].message.content ?? "",
  })
}

export async function GET() {
  return Response.json({
    status: "ok",
  })
}