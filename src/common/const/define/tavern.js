const config = [
  {
    num: 3,
    name: "入门盲盒",
    id: 3,
    desc: "剩余 100000",
    title: "",
    probability: [
      {
        title: '英雄',
        list: [
          { name: "R", val: "1%" },
          { name: "N", val: "99%" },
        ]
      }
    ],

    costTips: "20USDT",
    symbol: "USDT",
    number: 20,
    gold: 0,
    type: "primary",
  },
  {
    num: 3,
    name: "初级盲盒",
    id: 2,
    desc: "白名单用户限定",
    title: "",
    probability: [
      {
        title: '道具',
        list: [
          {name: '锄头', key:'EmpireHoeToken', val: "2%" },
        ]
      },
      {
        title: '英雄',
        list: [
          { name: "SR", val: "0.1%" },
          { name: "R", val: "7.9%" },
          { name: "N", val: "90%" },
        ]
      }
    ],

    costTips: "30USDT+5000EOCC",
    symbol: "USDT",
    number: 30,
    gold: 5000,
    type: "intermediate",
  },
  {
    num: 4,
    name: "高级盲盒",
    id: 1,
    desc: "白名单用户限定",
    title: "",
    probability: [
      {
        title: '道具',
        i18n: 'props',
        list: [
          { name: "工会令牌",key:'GuildToken', val: "0.1%" },
          { name: "体力药水", key:'SpiritDrug', val: "10%" },
          { name: "高级经验书", key:'ExperienceBookSenior', val: "30%" },
        ]
      },
      {
        title: '英雄',
        i18n: 'Hero',
        list: [
          { name: "SSR", val: "0.1%" },
          { name: "SR", val: "5%" },
          { name: "R", val: "54.8%" },
        ]
      }
    ],

    costTips: "1000MMR",
    symbol: "MMR",
    number: 1000,
    type: "senior",
    gold: 0,
  },
];

export default config;
