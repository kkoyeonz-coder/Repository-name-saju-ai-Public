import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { data, previewResult } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { message: "OPENAI_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      )
    }

    if (!data) {
      return Response.json(
        { message: "사주 데이터가 없습니다." },
        { status: 400 }
      )
    }

    const prompt = `
아래 정보를 바탕으로 한국어 프리미엄 사주 상세 리포트를 작성해줘.

[사용자 정보]
- 생년월일: ${data.birth}
- 태어난 시간: ${data.unknownTime ? "시간 모름" : data.time}
- 성별: ${data.gender}

[사주팔자]
- 년주: ${data.saju?.year}
- 월주: ${data.saju?.month}
- 일주: ${data.saju?.day}
- 시주: ${data.saju?.time}

[오행 비율]
- 목: ${data.elements?.percentages?.목}%
- 화: ${data.elements?.percentages?.화}%
- 토: ${data.elements?.percentages?.토}%
- 금: ${data.elements?.percentages?.금}%
- 수: ${data.elements?.percentages?.수}%

[무료 핵심 인사이트]
${previewResult}

작성 조건:
- 한국어로 작성
- 고객이 결제 후 읽는 프리미엄 리포트처럼 풍부하고 정성스럽게 작성
- 따뜻하고 고급스러운 말투
- 단정적인 예언처럼 말하지 말 것
- "가능성이 있습니다", "흐름으로 볼 수 있습니다", "도움이 될 수 있습니다" 같은 표현 사용
- 미신을 강요하지 말고 자기이해와 선택의 참고자료처럼 작성
- 건강, 질병, 투자 수익, 법률 문제를 확정적으로 말하지 말 것
- 총 8개 섹션으로 작성
- 각 섹션은 2~3문단 이상
- 전체적으로 충분히 길게 작성

섹션 구성:
1. 타고난 기질과 성향
2. 인간관계와 대인운
3. 연애운 심층 분석
4. 결혼운과 장기 관계
5. 재물운과 돈의 흐름
6. 직업운과 커리어 방향
7. 올해의 흐름과 전환점
8. 앞으로의 조언
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "너는 한국 사주 리포트를 고급스럽고 따뜻하게 작성하는 전문가다. 사용자가 자기이해와 삶의 방향성을 얻을 수 있도록 균형 잡힌 해석을 제공한다.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    })

    const premiumReport =
      completion.choices[0]?.message?.content ||
      "프리미엄 리포트를 생성하지 못했습니다."

    return Response.json({
      premiumReport,
    })
  } catch (error) {
    console.error(error)

    return Response.json(
      {
        message: "프리미엄 리포트 생성 중 문제가 발생했습니다.",
      },
      { status: 500 }
    )
  }
}