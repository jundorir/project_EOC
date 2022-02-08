import Button from "@components/Button";

import css from "./index.module.less";
import HeroThumbnail from "@components/Thumbnail/HeroThumbnail";
import Progress from "@components/Progress";
import { inject, observer } from "mobx-react";
function HeroSybthesis(props) {
  const {
    number = 0,
    requirement,
    confirm,
    disabled,
    hero,
    languageStore: { language },
  } = props;

  return (
    <div className={css.heroSybthesis}>
      <div className={css.top}>
        <div className={css.left}>
          <HeroThumbnail key={hero.id} hero={hero} showTitle={false} />
        </div>
        <div className={css.right}>
          <div>{hero.title}</div>
          <div>
            {language.hero_synthesis_number + ' '} 
            <span className={css.number}>{number}</span>
            <span className={css.requirement}>/{requirement.quantity}</span>
          </div>
          <Progress
            percent={((number / requirement.quantity) * 100).toFixed(2)}
          />
        </div>
      </div>

      <div className={css.bottom}>
        <Button disabled={disabled} onClick={confirm}>
          {language.hero_Start_synthesis}
        </Button>
        <div className={css.tips}>
          {language.hero_consume} EOCC： {requirement.cost}EOCC
        </div>
      </div>
    </div>
  );
}

export default inject("languageStore")(observer(HeroSybthesis));
