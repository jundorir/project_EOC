const timeout = 200
const fight = {
  timeout: 200,
  // fightIndex: [],
  init(config){
    // if(!this.blueHero) {
    //   this.blueHero = this.setIndex(blueHero)
    //   this.redHero = this.setIndex(red)
    //   // console.log(this.blueHero)
    //   // console.log(this.redHero)
    // }
    console.log('init')
    this.config = config
    // 蓝方英雄
    this.blueHero = this.setIndex(config.blueHero)
    // 红方
    this.redHero = this.setIndex(config.redHero)
    console.log(config.blueHero)
    console.log(config.redHero)
    // 蓝方英雄父级 元素
    this.blueHeroEl = config.blueHeroEl
    this.redHeroEl = config.redHeroEl
    let blueRandom = fight.getRandomHero(this.blueHero)
    let redRandom = fight.getRandomHero(this.redHero)
    if(!this.fightIndex || !this.fightIndex.length ) {
      this.fightIndex = [];
      console.log('getPkIndexgetPkIndexgetPkIndexgetPkIndexgetPkIndexgetPkIndex');
      this.getPkIndex([...blueRandom], [...redRandom])
    }

    if(1 === 1) {

      this.toFight([...blueRandom], [...redRandom]).then(res=> {

      })
    }

  },
  /**
   * 获取pk 顺序 保障用户 pk胜利
   * */
  getPkIndex(blueRandom, redRandom) {
    let blueStatus = false
    do {
      this.fightIndex = []
      blueStatus = this.simulate([...blueRandom], [...redRandom])
      if(blueStatus) {
        console.log("执行PK顺序:", this.fightIndex)
      }
    }while (!blueStatus)

  },
  setIndex(arr){
    let a = [];
    for(let i = 0 ; i < arr.length; i++){
      a.push({
        ...arr[i],
        fight: 800,
        maxHp: arr[i].maxHp,
        index: i
      })
    }
    return a
  },
  getRandomHero(arr){
    return [...arr].sort(()=>{
      return Math.random() > 0.5 ? -1 : 1
    })
  },
  getMaxLength (arr1, arr2){
    return arr1.length > arr2.length ? arr1.length : arr2.length
  },
  simulate(blueHero, redHero, loopIndex = 0){
    if(loopIndex >= 5) {
      console.log('simulate max---------------------------')
      console.log(blueHero, redHero)
      return  true
    }
    if(!blueHero.length || !redHero.length) {
      console.log('roundFight game over+++++++++++++++++++++++')
      console.log(blueHero)
      console.log(redHero)
      if(blueHero.length) {
        return true
      }
      if(redHero.length){
        return false
      }
    }
    // 打乱英雄排序 让对战pk的顺序随机
    let blueHeroRandom =  [...this.getRandomHero(blueHero)]
    let redHeroRandom =  [...this.getRandomHero(redHero)]
    // 各自pk的下标集合
    let bluePkIndex = [];
    let redPkIndex = [];

    let blueAttackedIndex = [];
    let redAttackedIndex = [];

    let blueKillHero = [];
    let redKillHero = [];

    let blueAttackHero = [];
    let redAttackHero = [];

    let pkIndex = []

    // 最多五个英雄   保证每次pk完成
    for(let i = 0 ; i < 5; i++) {
      console.log('pk------ start')
      // 蓝方先攻击   获取蓝方可pk的英雄
      let bHero = this.getCanPkHero(blueHero, blueAttackHero, redKillHero);
      console.log('bHero', bHero)
      if(bHero) {
        blueAttackHero.push(bHero.index)
        // 获取对方未被攻击过得英雄里还可以攻击的英雄
        let toPkHero = this.getCanPkHero(redHeroRandom, redAttackedIndex, blueKillHero)
        if(!toPkHero && blueKillHero.length != blueKillHero.length) {
          // 获取对方 未死可以攻击的英雄
          toPkHero = this.getCanPkHero(redHeroRandom, [], blueKillHero)
        }
        if(toPkHero) {
          let heroResult = this.attack(bHero, toPkHero);
          console.log(heroResult)
          // this.setHeroData(toPkHero.index, heroResult, this.redHero);
          redAttackedIndex.push(toPkHero.index)
          // 如果被蓝方杀死了  存储蓝方已杀英雄
          if(heroResult.hp <= 0) {
            blueKillHero.push(toPkHero.index)
          }
          //存储英雄数据
          this.setHeroItemData(redHeroRandom, heroResult)
          this.setHeroItemData(redHero, heroResult)
          bluePkIndex.push([bHero.index, toPkHero.index])
          pkIndex.push([bHero.index, toPkHero.index, 'blue'])
        }else {
          pkIndex.push([bHero.index, -1, 'blue'])
        }

      }
      // 红方攻击 获取红方 可发起攻击的英雄
      let rHero = this.getCanPkHero(redHero, redAttackHero, blueKillHero);
      console.log('rHero', rHero, redHero)
      if(rHero) {
        redAttackHero.push(rHero.index)
        let toPkHero = this.getCanPkHero(blueHeroRandom, blueAttackedIndex, redKillHero)
        if(!toPkHero && redKillHero.length != blueHeroRandom.length) {
          toPkHero = this.getCanPkHero(blueHeroRandom, [], redKillHero)
        }
        if(toPkHero) {
          let heroResult = this.attack(rHero, toPkHero);
          console.log(heroResult)
          // this.setHeroData(toPkHero.index, heroResult, this.blueHero);
          blueAttackedIndex.push(toPkHero.index)
          // 如果被红方杀死了  存储红方已杀英雄
          if(heroResult.hp <= 0) {
            redKillHero.push(toPkHero.index)
          }
          this.setHeroItemData(blueHeroRandom, heroResult)
          this.setHeroItemData(blueHero, heroResult)
          redPkIndex.push([rHero.index, toPkHero.index])
          pkIndex.push([rHero.index, toPkHero.index,'red'])
        }

      }
      if(!bHero && !rHero) {
        console.log('continue')
        continue
      }
    }
    // console.log()
    this.fightIndex.push({
      // bluePkIndex,
      // redPkIndex,
      pkIndex,
    })
    return this.simulate(this.filterHero(blueHero, redKillHero, '蓝方剩余--------'), this.filterHero(redHero, blueKillHero, '红方剩余--------'), loopIndex +1)
  },
  async toFight(blueHero, redHero){
    console.clear();
    console.log(this.fightIndex);
    if(!blueHero.length || !redHero.length) {
      console.log('roundFight game over')
      console.log(this.fightIndex)
      if(blueHero.length) {
        this.config.gameOver('blue')
        return 'blue'
      }
      if(redHero.length){
        this.config.gameOver('red')
        return 'red'
      }

    }
    for(let i = 0 ; i < this.fightIndex.length; i++) {
      let { pkIndex} = this.fightIndex[i]
      for(let i = 0 ; i < pkIndex.length; i ++){
        let [index, toIndex, type] = pkIndex[i];
        let hero, pkHero, changeHero, storageHero;
        if(toIndex === -1) {
          console.log(this.getHeroByIndex(blueHero, index))
          continue
        }
        if(type === 'blue') {
          hero = this.getHeroByIndex(blueHero, index);
          pkHero = this.getHeroByIndex(redHero, toIndex);
          changeHero = redHero
          // storageHero = this.redHero
          if(!pkHero || !hero) {
            continue
          }
          // 页面执行蓝方攻击动画
          this.config.setBlueAttack(index, toIndex)
        }else{
          hero = this.getHeroByIndex(redHero, index);
          pkHero = this.getHeroByIndex(blueHero, toIndex);
          changeHero = blueHero
          // storageHero = this.blueHero
          if(!pkHero || !hero) {
            continue
          }
          // 页面执行红方攻击动画
          this.timeout && this.config.setRedAttack(index, toIndex)
        }
        // PK 对方英雄， 返回被pk英雄  pk后的数据
        let heroResult = await this.attackPromise(hero, pkHero);
        this.setHeroData(pkHero.index, heroResult, changeHero);
        if(type === 'blue') {
          this.setHeroData(pkHero.index, heroResult, this.redHero);
          this.config.setRedHeroData(this.redHero)
        }else{
          this.setHeroData(pkHero.index, heroResult, this.blueHero);
          this.config.setBlueHeroData(this.blueHero)
        }

      }
    }
    console.log("toFight end")
    console.log(this.blueHero)
    console.log(this.redHero)
    this.config.gameOver()

  },
  async roundFight(blueHero, redHero){
    if(!blueHero.length || !redHero.length) {
      console.log('roundFight game over')
      console.log(this.fightIndex)
      if(blueHero.length) {
        this.config.gameOver('blue')
        return 'blue'
      }
      if(redHero.length){
        this.config.gameOver('red')
        return 'red'
      }

    }
    console.log('roundFight')
    // 打乱英雄排序 让对战pk的顺序随机
    let blueHeroRandom =  [...this.getRandomHero(blueHero)]
    let redHeroRandom =  [...this.getRandomHero(redHero)]

    console.log(blueHeroRandom)
    // 各自pk的下标集合
    let bluePkIndex = [];
    let redPkIndex = [];

    let blueAttackedIndex = [];
    let redAttackedIndex = [];

    let blueKillHero = [];
    let redKillHero = [];

    let blueAttackHero = [];
    let redAttackHero = [];

    // 最多五个英雄   保证每次pk完成
    for(let i = 0 ; i < 5; i++) {
      // 蓝方先攻击   获取蓝方可pk的英雄
      let bHero = this.getCanPkHero(blueHero, blueAttackHero, redKillHero);
      if(bHero) {
        blueAttackHero.push(bHero.index)
        // 获取对方未被攻击过得英雄里还可以攻击的英雄
        let toPkHero = this.getCanPkHero(redHeroRandom, redAttackedIndex, blueKillHero)
        if(!toPkHero && blueKillHero.length != blueKillHero.length) {
          // 获取对方 未死可以攻击的英雄
          console.log('获取对方 未死可以攻击的英雄', redHeroRandom, blueKillHero)
          toPkHero = this.getCanPkHero(redHeroRandom, [], blueKillHero)
        }
        console.log(`蓝方攻击英雄【${bHero.index}】-【${toPkHero.index}】`)
        if(toPkHero) {
          // PK 对方英雄， 返回被pk英雄  pk后的数据
          this.config.setBlueAttack(bHero.index, toPkHero.index)
          let heroResult = await this.attack(bHero, toPkHero);
          this.setHeroData(toPkHero.index, heroResult, this.redHero);
          this.config.setRedHeroData(this.redHero)
          // this.callback({
          //   type: 'blue',index: bHero.index, toIndex: toPkHero.index, HP: heroResult.hp
          // })
          console.log('红方受伤:'+ heroResult.hp, heroResult.index)
          redAttackedIndex.push(toPkHero.index)
          // 如果被蓝方杀死了  存储蓝方已杀英雄
          if(heroResult.hp <= 0) {
            blueKillHero.push(toPkHero.index)
          }
          //存储英雄数据
          this.setHeroItemData(redHeroRandom, heroResult)
          this.setHeroItemData(redHero, heroResult)
          bluePkIndex.push([bHero.index, toPkHero.index])
        }

      }
      // 红方攻击 获取红方 可发起攻击的英雄
      let rHero = this.getCanPkHero(redHero, redAttackHero, blueKillHero);
      if(rHero) {
        redAttackHero.push(rHero.index)
        let toPkHero = this.getCanPkHero(blueHeroRandom, blueAttackedIndex, redKillHero)
        if(!toPkHero && redKillHero.length != blueHeroRandom.length) {
          toPkHero = this.getCanPkHero(blueHeroRandom, [], redKillHero)
        }
        console.log(`红方攻击英雄【${rHero.index}】-【${toPkHero.index}】`)
        if(toPkHero) {
          this.config.setRedAttack(rHero.index, toPkHero.index)
          let heroResult = await this.attack(rHero, toPkHero);
          this.setHeroData(toPkHero.index, heroResult, this.blueHero);
          this.config.setBlueHeroData(this.blueHero)
          // this.config.setBlueHero()
          // this.callback({
          //   type: 'red',index: rHero.index, toIndex: toPkHero.index, HP: heroResult.hp
          // })
          console.log('蓝方受伤:'+ heroResult.hp, heroResult.index)
          blueAttackedIndex.push(toPkHero.index)
          // 如果被红方杀死了  存储红方已杀英雄
          if(heroResult.hp <= 0) {
            redKillHero.push(toPkHero.index)
          }
          this.setHeroItemData(blueHeroRandom, heroResult)
          this.setHeroItemData(blueHero, heroResult)
          redPkIndex.push([rHero.index, toPkHero.index])
        }

      }
      if(!bHero && !rHero) {
        continue
      }
    }
    // console.log()
    this.fightIndex.push({
      bluePkIndex,
      redPkIndex,
    })
    console.log("roundFight end")
    await this.roundFight(this.filterHero(blueHero, redKillHero, '蓝方剩余--------'), this.filterHero(redHero, blueKillHero, '红方剩余--------'))
  },
  getHeroByIndex(hero, index){
    for(let i = 0 ; i< hero.length ; i++) {
      if(hero[i].index === index) {
        return hero[i]
      }
    }
    console.log('getHeroByIndex false')
    console.log(hero, index)
    return false
  },
  setHeroData(index, data, arr){
    for(let i = 0; i < arr.length ; i ++) {
      if(arr[i].index === index) {
        arr[i] = data
      }
    }
    // obj[index] = data;
  },
  filterHero(list, filter, text){
    // console.log(list, filter);
    let arr =  list.filter((item)=> {
      return !filter.includes(item.index)
    })
    // console.log(text);
    // console.log(arr);
    // console.log(filter.toString());
    return arr;
  },
  // 获取可以参战的英雄
  getCanPkHero(hero, joinIndex, hasIndex){
    for(let i = 0 ; i< hero.length ; i++) {
      // 血量大于0  并且本次未出去pk过
      if(hero[i].hp > 0 && !joinIndex.includes(hero[i].index) && !hasIndex.includes(hero[i].index)) {
        return hero[i]
      }
    }
    return false;
  },
  setHeroItemData(arr, item){
    for(let i = 0 ; i < arr.length; i++){
      if(arr[i].index === item.index) {
        arr[i] = item
      }
    }
  },
  blueFight(blueRandom){
    let length = blueRandom.length;

  },
  nextBlurHero() {

  },
  attack(h1, h2){
    let hp  = h2.hp - h1.fight;
    let reduceHp = h2.hp - h1.fight;
    if(hp <= 0 ) {
      hp = 0
      reduceHp = h2.hp
    }
    return {
      ...h2,
      hp,
      reduceHp,
    }
  },
  attackPromise(h1, h2){
    return new Promise((resolve, reject)=>{
      let startTime = Date.now();
      setTimeout(()=>{
        let hp  = h2.hp - h1.fight;
        let reduceHp = h2.hp - h1.fight;
        if(hp <= 0 ) {
          hp = 0
          reduceHp = h2.hp
        }
        // console.log(Date.now() - startTime)
        resolve({
          ...h2,
          hp,
          reduceHp,
        })
      }, this.timeout)
    })
  },
  setBlueAttack(){

  }

}
export default fight
