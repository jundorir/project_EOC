import experienceBookPrimary from "@assets/images/material/experience_book_primary.png";
import experienceBookIntermediate from "@assets/images/material/experience_book_intermediate.png";
import experienceBookSenior from "@assets/images/material/experience_book_senior.png";
import EmpireHoe from "@assets/images/material/empire_hoe.png";
import guildToken from "@assets/images/material/guild_token.png";
import spiritDrug from "@assets/images/material/spirit_drug.png";
import treasureBox from "@assets/images/material/treasure_box.png";
import gold from "@assets/images/material/gold.png";
import monthCard from "@assets/images/material/month_card.png";
import { useState } from "react";
//TODO:增加月卡图标

function useMaterial(language) {
  const [Material] = useState({
    ExperienceBookPrimary: {
      images: experienceBookPrimary,
      title: language?.["Primary_Experience"],
      exp: 100,
    },
    // ExperienceBookIntermediate: {
    //   images: experienceBookIntermediate,
    //   title: "中级经验书",
    //   exp: 1000,
    // },
    ExperienceBookSenior: {
      images: experienceBookSenior,
      title: language?.["Senior_Experience"],
      exp: 10000,
    },
    EmpireHoeToken: {
      images: EmpireHoe,
      title: language?.["Hoe"],
    },
    GuildToken: {
      images: guildToken,
      title: language?.["Guild_Token"],
    },
    SpiritDrug: {
      images: spiritDrug,
      spirit: 10,
      title: language?.["Stamina_Potion"],
    },
    // TreasureBox: {
    //   images: treasureBox,
    //   title: "宝箱",
    // },
    Gold: {
      images: gold,
      title: "EOCC",
    },
    MonthCard: {
      images: monthCard,
      title: language?.["Member"],
    },
  });

  return Material;
}

export default useMaterial;

export const MaterialConfig = {
  ExperienceBookPrimary: {
    images: experienceBookPrimary,
    exp: 100,
  },
  ExperienceBookSenior: {
    images: experienceBookSenior,
    exp: 10000,
  },
  EmpireHoeToken: {
    images: EmpireHoe,
  },
  GuildToken: {
    images: guildToken,
  },
  SpiritDrug: {
    images: spiritDrug,
    spirit: 10,
  },

  Gold: {
    images: gold,
  },
  MonthCard: {
    images: monthCard,
  },
};
