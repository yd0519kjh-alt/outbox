export const MARCH_SCENARIO = {
  month: 3,
  title: "1919년, 봄의 함성",
  steps: [
    {
      id: 1,
      context: "1919년 3월 1일 탑골공원. 수천 명의 군중이 모여들고 한 청년이 독립선언서를 낭독합니다. 멀리서 일본 순사들의 호루라기 소리가 들려옵니다. 당신은 어떻게 하시겠습니까?",
      defaultImg: "/assets/images/scenarios/mar/step1_base.png",
      historyTip: "3.1 운동은 민족대표 33인이 태화관에서 선언서를 낭독하며 시작되었고, 탑골공원에서 학생과 시민들의 시위로 이어졌습니다.",
      choices: [
        { text: "나도 태극기를 들고 군중 속으로 뛰어든다!", type: "hero", weight: 1, actionImg: "/assets/images/scenarios/mar/step1_base.png" },
        { text: "일단 상황을 지켜보며 인파의 뒤편으로 물러난다.", type: "neutral", weight: 0, actionImg: "/assets/images/scenarios/mar/step1_base.png" },
        { text: "경찰서로 달려가 시위 주동자들의 위치를 알린다.", type: "villain", weight: 1, actionImg: "/assets/images/scenarios/mar/step1_base.png" }
      ]
    },
    {
      id: 2,
      context: "시위 대열 속에서 한 노인이 당신의 손에 종이 뭉치를 쥐여줍니다. '이 선언서를 연락책에게 전해주시오. 당신 같은 젊은이라면 의심을 덜 살 거요.'",
      defaultImg: "/assets/images/scenarios/mar/step2_base.png",
      historyTip: "당시 독립선언서는 일제의 눈을 피해 철도와 인편을 통해 전국으로 비밀리에 전달되었습니다.",
      choices: [
        { text: "걱정 마십시오! 선언서를 품고 좁은 골목을 달린다.", type: "hero", weight: 1, actionImg: "/assets/images/scenarios/mar/step2_base.png" },
        { text: "죄송합니다... 종이를 버리고 군중 속으로 사라진다.", type: "neutral", weight: 0, actionImg: "/assets/images/scenarios/mar/step2_base.png" },
        { text: "이걸 넘기면 큰 상금을 줄 거야. 헌병대로 향한다.", type: "villain", weight: 2, actionImg: "/assets/images/scenarios/mar/step2_base.png" }
      ]
    },
    {
      id: 3,
      context: "골목 끝에서 일본 순사와 마주쳤습니다. '어이, 거기! 봇짐 좀 보자고.' 순사가 당신의 몸을 수색하려 합니다.",
      defaultImg: "/assets/images/scenarios/mar/step3_base.png",
      historyTip: "일제는 3.1 운동 전후로 대대적인 검문검색을 실시하여 수많은 독립운동가들을 체포했습니다.",
      choices: [
        { text: "순사를 밀치고 동료들이 도망갈 시간을 번다.", type: "hero", weight: 1, actionImg: "/assets/images/scenarios/mar/step3_base.png" },
        { text: "겁에 질린 표정으로 아무것도 모른다고 호소한다.", type: "neutral", weight: 0, actionImg: "/assets/images/scenarios/mar/step3_base.png" },
        { text: "저쪽 골목에 주동자들이 모여 있다고 가리킨다.", type: "villain", weight: 2, actionImg: "/assets/images/scenarios/mar/step3_base.png" }
      ]
    },
    {
      id: 4,
      context: "고향 아우내 장터. 유관순 열사가 수천 명 앞에서 열변을 토합니다. 일본 군경이 총칼을 앞세워 시위대를 포위하고 사격을 시작합니다!",
      defaultImg: "/assets/images/scenarios/mar/step4_base.png",
      historyTip: "천안 아우내 장터 시위는 3.1 운동 중 가장 치열했던 시위로, 많은 이들이 현장에서 순국했습니다.",
      choices: [
        { text: "대한독립만세! 쓰러진 동료의 태극기를 다시 든다.", type: "hero", weight: 1, actionImg: "/assets/images/scenarios/mar/step4_base.png" },
        { text: "부상당한 사람들을 챙겨 신속히 장터 밖으로 피신한다.", type: "hero", weight: 1, actionImg: "/assets/images/scenarios/mar/step4_base.png" },
        { text: "일본 순사의 뒤에 서서 시위대 주동자를 지목한다.", type: "villain", weight: 3, actionImg: "/assets/images/scenarios/mar/step4_base.png" }
      ]
    },
    {
      id: 5,
      context: "결국 체포되어 서대문 형무소에 갇혔습니다. 일본 검사가 서류를 내밀며 말합니다. '독립은 없다. 포기 각서에 서명하면 오늘 내보내 주지.'",
      defaultImg: "/assets/images/scenarios/mar/step5_base.png",
      historyTip: "서대문 형무소는 일제강점기 독립운동가들을 가두고 고문했던 상징적인 장소입니다.",
      choices: [
        { text: "서류를 찢어버리고 끝까지 저항한다.", type: "hero", weight: 1, actionImg: "/assets/images/scenarios/mar/step5_base.png" },
        { text: "살아야 미래가 있다... 고개를 숙이고 서명한다.", type: "neutral", weight: 0, actionImg: "/assets/images/scenarios/mar/step5_base.png" },
        { text: "충성을 맹세할 테니 순사 자리를 하나 달라고 제안한다.", type: "villain", weight: 3, actionImg: "/assets/images/scenarios/mar/step5_base.png" }
      ]
    }
  ],
  endings: {
    hero_high: { 
      name: "유관순", 
      desc: "당신은 아우내의 별, 당당한 독립 영웅입니다.", 
      img: "/assets/images/cards/hero_yu.jpg" // .png에서 .jpg로 수정 완료
    },
    neutral: { 
      name: "이름 없는 소시민", 
      desc: "당신은 평범한 시민입니다. 당신의 망설임도 역사의 한 조각입니다.", 
      img: "/assets/images/cards/neutral.png" 
    },
    villain_mid: { 
      name: "조선인 순사보", 
      desc: "당신은 안위를 위해 동포를 외면한 부역자입니다.", 
      img: "/assets/images/cards/villain_spy.png" 
    },
    villain_high: { 
      name: "이완용", 
      desc: "당신은 민족을 팔아치운 영원한 배신자, 이완용의 길을 선택했습니다.", 
      img: "/assets/images/cards/villain_lee.png" 
    }
  }
};