class Scroll{
  static scrollByY({ele, max, num = 0}){
    let scrollY = max / 30;
    num = num +1
    if(num > 30){
      return num
    }
    ele.scrollBy(0, scrollY)
    return requestAnimationFrame(()=> this.scrollByY({ele, max, num}))
  }
}
export default Scroll
