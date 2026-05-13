# 经典数据 Schema

Phase 2 起的 9 部经典统一数据结构。

## 文件位置
`src/data/classics/<bookid>.js`，例如：
- `lunyu.js`、`mengzi.js`、`daxue.js`、`zhongyong.js`
- `daodejing.js`、`zhuangzi.js`
- `xinjing.js`、`jingang.js`、`tanjing.js`

## 顶层结构

```js
export default {
  meta: {
    id:           'daxue',           // 短 id，对应文件名
    name:         '大学',
    fullName:     '大学章句',         // 朱熹本叫《大学章句》
    school:       'confucian',       // confucian | daoist | buddhist
    era:          '春秋至西汉',
    edition:      '朱熹《大学章句》通行本',
    editionEra:   '南宋',
    editionDate:  '约 1177-1190 AD',
    publicDomain: true,              // 公版确认
    sourceUrl:    'https://ctext.org/liji/da-xue/zh',  // 用于核校
    persona:      ['zengzi', 'zhuxi'],  // 可用对话者 id 列表
    defaultPersona: 'zengzi',
    summary:      '修身、齐家、治国、平天下的纲领',
  },
  chapters: [
    {
      id:        '1',                // chapter slug，可数字字符串或拼音
      name:      '经一章',            // 章名
      subtitle:  '',                 // 副标题（可空）
      sections: [
        {
          id:          '1.1',         // section slug，"<chapterId>.<localId>"
          title:       '',            // 段名（论语章节可空）
          original:    '大学之道...',  // 公版原文
          translation: '大学的根本...', // 自译
          notes: {                    // 字词注（key=词, value=释义）
            '大学': '大人之学',
            '明明德': '彰显光明的德性',
          },
          ancientNotes: [             // 公版古注引用（可选）
            { source: '朱注', text: '大学者，大人之学也。' },
          ],
          tags: ['修身', '纲领'],     // 可选，用于主题浏览
        },
      ],
    },
  ],
};
```

## 必填字段
- `meta.id` `meta.name` `meta.school` `meta.publicDomain`（必须 true）
- `meta.persona`（至少一个）
- `chapters[].id` `chapters[].name`
- `sections[].id` `sections[].original`

## 选填字段
- `translation`（强烈推荐）
- `notes`、`ancientNotes`、`tags`
- `subtitle`

## 章节结构约定

| 经典类型 | chapters 设计 |
|---|---|
| 章节明显（论语/孟子/坛经） | 每篇是一个 chapter，章节内多 sections |
| 单文（心经） | 1 个 chapter "全文"，内嵌多 sections（按段切） |
| 章数固定（道德经 81 章） | 81 chapters，每个 1 section |
| 章句结构（大学/中庸） | 朱熹分章对应 chapters |

## ID 命名规则
- chapter id：数字字符串 `'1'..'81'` 或语义 slug `'xiao-yao-you'`（庄子内七篇）
- section id：`'<chapterId>.<localId>'`，如 `'2.5'`（论语为政篇第 5 章）
- 全 ASCII，不含中文，便于 URL/锚点

## 来源校对流程
1. 原文：以指定 edition 为准，至少跟一个公版数字源（ctext.org / 维基文库）对照
2. 任何字词差异：以 edition 为主，差异在 notes 标 "另一本作 X"
3. 翻译：先写自译，再回头核 1-2 家现代译本（**不抄**），确保理解无误
4. SOURCES.md 同步更新每本书的 edition 与 sourceUrl

## 工具函数（src/data/classics/index.js 提供）
- `getBookById(id)` → 整本
- `getSectionById(bookId, sectionId)` → 单段
- `listBooks()` → 书架卡片用
- `searchClassics(query)` → 全文检索（v0.3+）
