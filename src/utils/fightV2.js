// const animationFrame
const fight = {
  timeout: 200,
  startIndex: [],
  animationCount: {},
  maxLoop: 1,
  status: 1,
  addPX: 28,
  clientWidth: 0,
  init(config){
    this.startIndex=  [];
    this.animationCount=  [];
    this.status=  1;
    this.children = config.children
    this.childrenLength = config.children.length
    this.overCallback = config.overCallback
    this.bossAttacked = config.bossAttacked
    this.clientWidth = config.clientWidth
    this.show()

  },
  destroy(){
    this.status = 0;
  },
  getRandom(){
    let arr =  []
    for(let i = 0 ; i < this.childrenLength; i++){
      arr.push(i)
    }
    let newArr = arr.sort((item)=> {
      return  Math.random() > 0.5 ? -1 : 1
    })
    return newArr
    // if(!this.status || i > 100){
    //   return  0
    // }
    //
    // let num = Math.ceil(Math.random() * 5);
    // if(fight.startIndex.includes(num) &&  fight.startIndex.length !== 5) {
    //   return this.getRandom(i+1)
    // }
    // return num
  },
  async show(){
    let max = Math.ceil(window.innerHeight / 1.4 )
    this.loopArr = this.getRandom();
    console.log(this.loopArr)
    this.toPK({
      ele: this.children[this.loopArr[0]],
      maxBottom: window.innerHeight  - (window.innerHeight * 0.1),
      childIndex: this.loopArr[0],
      loopIndex: 0,
      callback: this.pkCallback,
    })
  },
  pkCallback: ({maxBottom, loopIndex})=>{
    if(!fight.status){
      return
    }
    // 自增下标
    loopIndex = loopIndex + 1;
    let childIndex = fight.loopArr[loopIndex ]
    if(loopIndex <= fight.childrenLength - 1 ) {
      fight.toPK({
        ele: fight.children[childIndex],
        maxBottom,
        childIndex: childIndex,
        loopIndex: loopIndex,
        callback: fight.pkCallback
      })
    }else {
      fight.checkOver()
    }
    //
    // if(!fight.animationCount[index]) {
    //   fight.animationCount[index] = 1
    // }else{
    //   fight.animationCount[index] += 1
    // }
    // if(fight.animationCount[index] < fight.maxLoop){
    //   fight.toPK({
    //     ele,
    //     maxBottom,
    //     index,
    //     callback: fight.pkCallback
    //   })
    // } else {
    //   fight.checkOver()
    // }
  },
  checkOver(){
    let status = true
    // for(let item in fight.animationCount) {
    //   if(fight.animationCount[item] < fight.maxLoop){
    //     status = false
    //     break;
    //   }
    // }
    console.log(fight.animationCount)
    if(status) {
      this.overCallback()
    }
  },
  /**
   * @description 解决
   * */
  getLeft(initLeft, goLeft, left, frequency, isDown = false){
    if(initLeft === goLeft){
      return  0;
    }
    let maxLeft = goLeft - initLeft
    let addLeft = maxLeft / frequency
    if(isDown){
      left -= addLeft;
    }else{
      left += addLeft;
    }
    if(left > maxLeft && maxLeft > 0){
      left = maxLeft
    }
    if(left < maxLeft && maxLeft < 0){
      left = maxLeft
    }
    return left;
  },
  /**
   * @description PK
   * */
  toPK({ele, bottom = 0, maxBottom, childIndex, initLeft = 0,  loopIndex = 0, callback, down = false, left = 0, index = 0}) {
    if(!fight.status || !ele){
      return
    }
    let goLeft = fight.clientWidth / 2 -  ele.offsetWidth / 2;
    // 达到最高位置所需的次数
    let frequency = Math.ceil(maxBottom / fight.addPX)
    // 第一次PK
    if(index === 0){
      initLeft = ele.offsetLeft
    }
    // let curIndex = fight.childrenLength - Math.floor(fight.childrenLength / 2)
    if(!down) {
      left = fight.getLeft(initLeft, goLeft, left, frequency);
      bottom = bottom + fight.addPX
      if(bottom >= maxBottom){
        bottom = maxBottom
        down = true
      }
      if(bottom >= maxBottom * 0.4) {
        if(!fight.upPk){
          fight.bossAttacked(true)
          fight.upPk = true
        }

      }else {
        fight.upPk = false
      }
    }else{
      left = fight.getLeft(initLeft, goLeft, left, frequency, true);
      bottom = bottom - fight.addPX
      if(bottom <= maxBottom*0.4) {
        if (!fight.downPk){
          fight.bossAttacked(false)
          fight.downPk = true
        }
      }else {
        fight.downPk = false
      }
      if(bottom <= 0 ) {
        bottom = 0
        ele.style.bottom = 0;
        setTimeout(()=>{
          callback({
            ele,
            maxBottom,
            childIndex,
            loopIndex
          })
        },500)

        return
      }
    }
    ele.style.left = left + 'px'
    ele.style.bottom = bottom + 'px'
    index = index + 1
    setTimeout(()=> {
      requestAnimationFrame(()=>this.toPK({ele, bottom, maxBottom, childIndex, initLeft, loopIndex, callback, down, left, index , time: Date.now()}))
    }, 13)

  },
  attackPromise(){
    return new Promise((resolve, reject)=>{
      let startTime = Date.now();
      setTimeout(()=>{
        resolve(true)
      }, this.timeout)
    })
  },
  setBlueAttack(){

  }

}
export default fight
