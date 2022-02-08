
class BannerTouch {
    constructor({ele,  onChange}) {
      this.init(ele)
      this.config = {
        onChange
      }
    }
    init(ele){
        // this.moveWidth = 100
        this.ele = ele;
        this.children = [];
        this.bind()
        this.setData()
        // console.log('bannerTouch init')
    }

    reload(){
        // console.log('bannerTouch reload')
        this.clearIntervalLoop()
        this.setData()
    }
    setData(){
        // console.log(this.ele)
        // console.log('bannerTouch setData')
        if(!this.ele) { return }
        this.children = this.ele.children
        this.setVisible(true)
        if(this.children.length) {
            this.index = 0;
            this.touchStartPosition = {clientX: 0 ,clientY:0}
            this.childrenStyles = [];
            this.setPositionData()
            this.setPlayData()
            this.setAutoPlay()
            setTimeout(()=>{
              this.setVisible(false)
            },100)

        }
    }
    setVisible(visible){
      this.ele.style.visibility  = visible? 'hidden' : 'visible'
    }
    setPositionData(){
        const width = this.ele.clientWidth
        const itemWidth = this.ele.children[0].clientWidth
        const itemOtherWidth = itemWidth * 0.8
        const centerWidth = width * 0.5;
        this.bannerPositionData = {
            prevLeft: centerWidth - itemWidth,
            nextLeft: centerWidth,
            currentLeft: width / 2 - itemWidth/ 2,
            width,
            itemWidth,
            itemOtherWidth,
            centerWidth,
            maxMove: itemWidth /3
        }
    }
    styleObjToAttr(styleObj){
        let styleStr = ''
        for(let key in styleObj){
            styleStr += `${key}:${styleObj[key]};`
        }
        return styleStr
    }
    bind(){
        // console.log(this.ele)
        this.ele.addEventListener('touchstart', (e)=> {
            e.preventDefault()
            const {clientX, clientY} = e.touches[0]
            this.touchStartPosition = {clientX, clientY}

        })
        this.ele.addEventListener('touchmove', (e)=> {
            const {clientX, clientY} = e.touches[0]
            this.touchmove(clientX, clientY)
        })
        this.ele.addEventListener('touchend', (e)=> {
            e.returnValue = true
            const {clientX, clientY} = e.changedTouches[0]
            this.touchend(clientX, clientY)
        })
    }
    getScale(moveX){
        let xPx = 0.2 / this.bannerPositionData.maxMove;
        let scale = moveX * xPx;
        if(scale > 0.2) {
            scale = 0.2
        }
        return {
            current: 1 - scale,
            next: 0.8 + scale
        }

    }
    touchmove(clientX, clientY){
        let moveX =  clientX - this.touchStartPosition.clientX;
        this.setMoveData(moveX, false)
    }
    touchend(clientX, clientY){
        let moveX =  clientX - this.touchStartPosition.clientX;
        this.setMoveData(moveX, true)
    }
    getPrevElementSibling(){
        let index = this.index - 1;
        if(index < 0) {
            index = this.children.length - 1
        }
        return {
            element: this.children[index],
            index: index,
            ...this.childrenStyles[index]
        }
    }
    getCurrentElement(){
        let index = this.index;
        return {
            element: this.children[index],
            index: index,
            ...this.childrenStyles[index]
        }
    }
    getNextElementSibling(){
        let index = this.index + 1;
        if(index > this.children.length - 1) {
            index = 0
        }
        return {
            element: this.children[index],
            index: index,
            ...this.childrenStyles[index]
        }
    }
    next(){
        this.index = this.index + 1;
        if(this.index >= this.children.length) {
            this.index = 0
        }
        // console.log("next:", this.index)
        this.setPlayData()
    }
    prev(){
        this.index = this.index - 1;
        if(this.index < 0) {
            this.index = this.children.length - 1
        }
        this.setPlayData()
        // console.log("prev:", this.index)
    }

    setAutoPlay(){
        // this.intervalLoop = setInterval(()=> {
        //     this.next()
        // },4000)
    }
    clearIntervalLoop() {
        clearInterval(this.intervalLoop)
    }
    toPage(index) {
      this.index = index
      this.setPlayData();
    }
    setPlayData(){
        let prevElement = this.getPrevElementSibling()
        // let currentElement = this.getCurrentElement()
        let nextElement = this.getNextElementSibling()
        if(this.config?.onChange) {
          this.config.onChange(this.index)
        }
        for(let i = 0 ; i < this.children.length; i++){
            const element = this.children[i];
            let left = 0;
            let style = {
                transform:  `scale(0.8)`,
                'z-index': 10,
                transition: 'all .4s',
                opacity: 0.6,
            }
            if(i === prevElement.index) {
                // 上一个
                left = this.bannerPositionData.prevLeft
                style = {
                    ...style,
                    left: left + 'px',
                  'text-align': 'left',
                }
            }else if(i === this.index){
                // 当前
                left = this.bannerPositionData.currentLeft
                style = {
                    ...style,
                    'z-index': 13,
                    opacity: 1,
                    transform: `scale(1)`,
                    left: left + 'px',
                  'text-align': 'center',
                }
            }else if(i === nextElement.index){
                // console.log(nextElement)
                // 下一个
                left = this.bannerPositionData.nextLeft
                style = {
                    ...style,
                    left: left + 'px',
                   'text-align': 'right',
                }
            } else {
                // 下一个
                left = this.bannerPositionData.currentLeft
                style = {
                    ...style,
                    left: left + 'px',
                }
            }
            element.setAttribute('style', this.styleObjToAttr(style))
            this.childrenStyles[i] = {
                left,
                style
            }
        }
    }
    setMoveData(moveX, isTouchend){
        let isMax = false
        if(moveX < -this.bannerPositionData.maxMove) {
            moveX = -this.bannerPositionData.maxMove
            isMax = true
        }
        if(moveX > this.bannerPositionData.maxMove) {
            moveX = this.bannerPositionData.maxMove
            isMax = true
        }
        this.clearIntervalLoop()
        if(isTouchend) {
            if(isMax) {
                if(moveX > 0){
                    this.prev();
                } else{
                    this.next();
                }
            }
            this.setPlayData()
            this.setAutoPlay()
        } else {
            this.setMoveCurrentStyle(moveX);
            this.setMovePrevStyle(moveX);
            this.setMoveNextStyle(moveX);
        }
    }
    setMoveCurrentStyle(moveX) {
        // let currentElement = this.getCurrentElement()
        const { style, element, left } = this.getCurrentElement()
        let scale = this.getScale(moveX < 0 ? Math.abs(moveX) : moveX);
        this.setElementAttrStyle(element, {
            ...style,
            transition: 'all .1s',
            left: (left + moveX) + 'px',
            'z-index': 13,
            transform: `scale(${scale.current})`,
        })
    }
    // 设置上一个元素的样式
    setMovePrevStyle(moveX){
        let prevElement = this.getPrevElementSibling()
        const { style, left, element } = prevElement
        let opacity = 0.8 ;
        let myLeft = 0 ;
        let scale = 0.8;
        let zIndex = 10;
        let scaleData = this.getScale(moveX < 0 ? Math.abs(moveX) : moveX);
        // 右滑动
        if(moveX > 0) {
            // 本元素需要放大显示
            // myLeft = left + moveX
            myLeft = left + this.getMoveXCurve(moveX)
            scale = scaleData.next
            zIndex = 12
            opacity = 1
        } else {
            myLeft =  left - moveX
        }
        this.setElementAttrStyle(element, {
            ...style,
            transition: 'all .1s',
            'z-index': zIndex,
            opacity,
            transform: `scale(${scale})`,
            left: myLeft + 'px'
        })
    }
    setMoveNextStyle(moveX){
        let nextElement = this.getNextElementSibling()
        const { style, element, left } = nextElement
        let myLeft = 0 ;
        let opacity = 0.8 ;
        let scale =  0.8;
        let zIndex = 10;
        let scaleData = this.getScale(moveX < 0 ? Math.abs(moveX) : moveX);
        // 右滑动
        if(moveX > 0) {
            myLeft = left - moveX
        } else {
            // 本元素需要放大显示
            myLeft = left +  this.getMoveXCurve(moveX)
            // myLeft = left  + this.getMoveXCurve(moveX)
            scale = scaleData.next
            zIndex = 12
            opacity = 1
        }
        this.setElementAttrStyle(element, {
            ...style,
            transition: 'all .1s',
            opacity,
            'z-index': zIndex,
            transform: `scale(${scale})`,
            left: myLeft + 'px'
        })
    }
    getMoveXCurve(moveX) {
      const {maxMove, itemWidth} = this.bannerPositionData
      let max = itemWidth * 0.15;
      let p = max / 10
      let moveXCurve = 0
      if(moveX < 0) {
        if(moveX > -max) {
          moveXCurve = moveX +  -moveX * p
        }else {
          moveXCurve =  moveX + max + -moveX * 0.7
        }
      } else{
        if(moveX < max) {
          moveXCurve = moveX +  -moveX * p
        }else {
          moveXCurve =  moveX - max + -moveX * 0.7
        }
      }
      // console.log(moveXCurve)
      return moveXCurve
      // if(moveX > -max || moveX  < max) {
      //   console.log('right:',-moveX * p)
      //   return -moveX * p
      // }else{
      //   console.log('left:',-moveX * -p)
      //   console.log(moveX * p)
      //   // return -moveX * -p
      // }
    }
    setElementAttrStyle(element, styleObj){
        // console.log(this.styleObjToAttr(styleObj))
        element.setAttribute('style', `${this.styleObjToAttr(styleObj)}`)
    }
}
export  default  BannerTouch
