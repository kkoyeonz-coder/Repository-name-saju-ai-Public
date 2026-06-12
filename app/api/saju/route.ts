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

이번 응답은 결제 전 공개되는 "핵심 인사이트 리포트"다.
하지만 너무 짧게 쓰면 안 된다.

목표:
- 사용자가 충분히 읽을 만한 가치가 있다고 느끼게 한다.
- "내 얘기 같다"는 느낌을 주어야 한다.
- 다만 결혼운 심층, 연애 시기, 재물 상승 시기, 직업 전략, 올해 운세, 인생 전환점 등은 전부 공개하지 않는다.
- 상세 분석은 프리미엄 리포트에서 확인하고 싶도록 자연스럽게 궁금증을 남긴다.
- 공포 마케팅은 절대 하지 않는다.
- 고급스럽고 신뢰감 있는 말투를 사용한다.

분량:
- 전체 1700자에서 2300자 정도.
- 충분히 자세히 작성한다.
- 하지만 유료 리포트에서 제공할 핵심 심층 내용은 일부만 암시한다.

반드시 아래 형식으로 작성한다.

# 1. 핵심 기질과 타고난 성향
- 타고난 성향을 3~4문단으로 설명한다.
- 강점, 약점, 인간관계에서 보이는 특징을 함께 말한다.
- 사용자가 "내 얘기 같다"고 느끼도록 구체적으로 작성한다.

# 2. 연애와 관계 인사이트
- 연애 성향을 2~3문단으로 설명한다.
- 관계에서 반복될 수 있는 패턴을 구체적으로 언급한다.
- 어떤 관계에서 편안함을 느끼고, 어떤 관계에서 지치기 쉬운지 말한다.
- 다만 인연 시기, 결혼운, 상대방 유형의 깊은 분석은 프리미엄 리포트에서 확인할 수 있음을 자연스럽게 남긴다.

# 3. 재물과 직업 흐름 인사이트
- 돈을 대하는 태도, 일에서 강점이 드러나는 방식, 직업적 방향성을 3~4문단으로 설명한다.
- 어떤 방식으로 돈과 일이 안정되는지 설명한다.
- 다만 구체적인 재물운 상승 시기, 직업 선택 전략, 사업 적합도는 프리미엄 리포트에서 확인하도록 자연스럽게 연결한다.

# 4. 오행 밸런스 조언
- 오행 비율을 참고해서 현재 에너지의 강점과 부족한 부분을 설명한다.
- 생활 습관, 인간관계, 일 처리 방식에서 균형을 잡는 조언을 제공한다.

# 5. 더 깊이 봐야 할 부분
- 이 사주는 겉으로 보이는 성향보다 더 깊게 봐야 할 지점이 있음을 말한다.
- 프리미엄 리포트에서는 연애운, 결혼운, 재물운, 직업운, 올해 운세, 인생 전환점을 더 길고 구체적으로 분석한다고 안내한다.
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

이 정보를 바탕으로 결제 전 공개되는 핵심 인사이트 리포트를 작성해줘.
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