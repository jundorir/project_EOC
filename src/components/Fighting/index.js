// 战役
import {Fragment, useEffect, useRef, useState} from "react";
import classNames from "classnames";
import Button from "@components/Button";
import HeroCard from "@components/Card/HeroCard";
import fight from "@utils/fight";
import css from "./index.module.less";
const FightingTime = 600
const myHero = [
  {
    id: 1,
    type: 'blue',
    hp: 2000,
    fight: 800
  },
  {
    id: 2,
    type: 'blue',
    hp: 1900,
    fight: 800
  },
  {
    id: 3,
    type: 'blue',
    hp: 1800,
    fight: 800
  },
  {
    id: 4,
    type: 'blue',
    hp: 1700,
    fight: 800
  },
  {
    id: 5,
    type: 'blue',
    hp: 1600,
    fight: 800
  }
]
const otherHero = [

  {
    id: 1,
    type: 'red',
    hp: 2000,
    fight: 800
  },
  {
    id: 2,
    type: 'red',
    hp: 1900,
    fight: 800
  },
  {
    id: 3,
    type: 'red',
    hp: 1800,
    fight: 800
  },
  {
    id: 4,
    type: 'red',
    hp: 1700,
    fight: 800
  },
  {
    id: 5,
    type: 'red',
    hp: 1600,
    fight: 800
  }
]
function Modal(props) {
  const {visible = true, callback} = props
  const [mainShow, setMainShow] = useState(false)
  const [blueHero, setBlueHero] = useState([...myHero])
  const [redHero, setRedHero] = useState([...otherHero])

  const [blueAttackIndex, setBlueAttackIndex] = useState('')
  const [blueAttackedIndex, setBlueAttackedIndex] = useState('')

  const [redAttackIndex, setRedAttackIndex] = useState('')
  const [redAttackedIndex, setRedAttackedIndex] = useState('')

  const blueHeroEl = useRef(null);
  const redHeroEl = useRef(null);

  useEffect(()=>{
    if(visible) {


    }
  }, [visible])
  // const []
  useEffect(async ()=> {

    if(redHeroEl.current && blueHeroEl.current) {
      setMainShow(true)
      setFight()
    }
  }, [redHeroEl, blueHeroEl])

  useEffect(()=> {
    // console.log('useEffect')
    // console.log(blueHero)
  }, [blueHero])
  if(!visible){
    return  null;
  }
  function initState() {
    setBlueAttackIndex('')
    setBlueAttackedIndex('')
    setRedAttackIndex('')
    setRedAttackedIndex('')
  }
  function setHeroData(arr, index, data, fun){
    let list = []
    for(let i = 0 ; i < arr.length; i++) {
      if(i === index){
        list.push(data)
      }else {
        list.push(arr[i])
      }
    }
    fun(list)
  }
  function setFight(){

    console.clear();
    // console.log(myHero)
    // console.log(otherHero)
    fight.init({
      blueHero: [...myHero],
      redHero: [...otherHero],
      setBlueHero,
      setRedHero,
      blueHeroEl: blueHeroEl.current,
      redHeroEl: redHeroEl.current,

      gameOver: (text)=> {
        callback(1)
        // console.log('gg【' + text +'】胜利')
      },
      setBlueAttack: (index, toIndex)=>{
        setBlueAttackIndex(index)
        setRedAttackedIndex(toIndex)
      },
      setBlueHeroData: (arr)=>{
        initState()
        setBlueHero(arr)
      },
      setRedAttack: (index, toIndex)=>{
        setRedAttackIndex(index)
        setBlueAttackedIndex(toIndex)
      },
      setRedHeroData: (arr)=>{
        initState()
        setRedHero(arr)
      },
    })
    fight.timeout = FightingTime
  }

  return (
    <div className={css.fighting}>
      <div className={css.middle}>
        <div className={css.top}></div>
        <div className={classNames(css.main, mainShow ? css.mainShow : '')}>
          <div className={css.otherHero} ref={redHeroEl}>
            {redHero.map((item, index)=>(
              <div key={index} className={classNames(css.heroItem,
                item.hp <= 0 ? css.killed : css.none,
                redAttackIndex === index ? css.redHeroAttack : css.none,
                redAttackedIndex === index ? css.heroAttacked : css.none)}>
                {(redAttackedIndex === index  || index == 7 )? <div className={css.hero_attacked_bg} /> : null}
                <HeroHp maxHp={item.maxHp} hp={item.hp}/>
                <HeroCard
                  hero={{}}
                  style={{ transform: "scale(.25)", transformOrigin: "left top" }}
                />
              </div>
            ))}
          </div>
          <div className={css.myHero} ref={blueHeroEl}>
            {blueHero.map((item, index)=>(
              <div key={index} className={classNames(css.heroItem,
                item.hp <= 0 ? css.killed : css.none,
                blueAttackIndex === index ? css.blueHeroAttack : css.none,
                blueAttackedIndex === index ? css.heroAttacked : css.none)}>
                {blueAttackedIndex === index ? <div className={css.hero_attacked_bg} /> : null}
                <HeroCard
                  hero={{}}
                  style={{ transform: "scale(.34)", transformOrigin: "left top" }}
                />
              </div>
            ))}
          </div>

        </div>
        <div className={css.bottom}>
          <div className={css.route}>战斗中...</div>
          <div
            className={css.back}
            onClick={() => {
              // view.goBack();
              fight.timeout = 0
              callback(1)
            }}
          />
        </div>
      </div>
    </div>
  );
}
function HeroHp(props){
  const { maxHp, curHp} = props
  return (
    <div className={css.heroItemHp}></div>
  )
}
export default Modal;
