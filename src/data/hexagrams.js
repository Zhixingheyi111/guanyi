export const hexagrams = [
  {
    id: 1,
    name: "乾",
    symbol: "䷀",
    upper: "乾",
    lower: "乾",
    binary: "111111",
    guaci: {
      original: "元，亨，利，贞。",
      translation: "至大的开始，万物亨通，各得其宜，守持正固。",
      notes: {
        "元": "始也，万物资始，至大之义",
        "亨": "通也，万物生长通达",
        "利": "宜也，各得其宜",
        "贞": "正也，固也，守正不移"
      }
    },
    tuanci: "彖曰：大哉乾元，万物资始，乃统天。云行雨施，品物流形。大明始终，六位时成，时乘六龙以御天。乾道变化，各正性命，保合大和，乃利贞。首出庶物，万国咸宁。",
    daxiang: "象曰：天行健，君子以自强不息。",
    yaoci: [
      {
        position: "初九",
        original: "潜龙勿用。",
        xiaoxiang: "象曰：潜龙勿用，阳在下也。",
        translation: "龙潜伏未出，暂不宜有所作为。",
        notes: {
          "潜": "隐而未见，藏而待时",
          "龙": "喻阳气或有德之人",
          "勿用": "时机未至，不宜轻动"
        }
      },
      {
        position: "九二",
        original: "见龙在田，利见大人。",
        xiaoxiang: "象曰：见龙在田，德施普也。",
        translation: "龙出现在田野之中，有利于拜见德高望重之人。",
        notes: {
          "见龙在田": "龙离潜渊而出，阳德已显于世",
          "大人": "有德有位之人"
        }
      },
      {
        position: "九三",
        original: "君子终日乾乾，夕惕若厉，无咎。",
        xiaoxiang: "象曰：终日乾乾，反复道也。",
        translation: "君子整日勤勉自强，傍晚仍警惕谨慎如临危境，可以没有过失。",
        notes: {
          "乾乾": "健行不止，努力不懈",
          "夕惕": "日暮时仍保持警惕反省",
          "厉": "危也，如临险境",
          "无咎": "无过失，不致悔恨"
        }
      },
      {
        position: "九四",
        original: "或跃在渊，无咎。",
        xiaoxiang: "象曰：或跃在渊，进无咎也。",
        translation: "或腾跃而上，或退处深渊，进退皆无过失。",
        notes: {
          "或": "不定之辞，可进可退",
          "跃": "腾跃向上，喻进取",
          "渊": "深潭，喻退守以待时"
        }
      },
      {
        position: "九五",
        original: "飞龙在天，利见大人。",
        xiaoxiang: "象曰：飞龙在天，大人造也。",
        translation: "龙飞腾于天，有利于拜见德高望重之人。",
        notes: {
          "飞龙在天": "龙升于天，喻圣人登位，阳德大盛",
          "大人": "此处指九五居尊位之圣明天子",
          "造": "至也，成也"
        }
      },
      {
        position: "上九",
        original: "亢龙有悔。",
        xiaoxiang: "象曰：亢龙有悔，盈不可久也。",
        translation: "龙飞得过高，必有悔恨。",
        notes: {
          "亢": "极也，过高而无退路",
          "悔": "物极必反，高亢则招损"
        }
      },
      {
        position: "用九",
        original: "见群龙无首，吉。",
        xiaoxiang: "象曰：用九，天德不可为首也。",
        translation: "六爻皆阳时，见群龙皆不争为首，吉祥。",
        notes: {
          "用九": "乾卦特有，筮得六爻皆老阳（变爻）时所用",
          "群龙无首": "众阳不争先，刚健而不逞强",
          "天德不可为首": "天之德在于化育万物而不自居其功"
        }
      }
    ]
  }
];

export const getHexagramById = (id) => hexagrams.find(h => h.id === id);
export const getHexagramByBinary = (binary) => hexagrams.find(h => h.binary === binary);
