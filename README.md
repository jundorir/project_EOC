# build 方式

    1. npm run build
    2. 如果图片资源无修改 跳转5 如果图片资源有修改跳转3
    3. node reader.js
    4. 将reader.js中的copy到src/const/preload/index.js ===> resoure 参数中
    5. 重新build
    6. 将build目录下的html 进行 资源路径修改 http://112.5.37.13:83 ===> .
    7. 将图片(如果有修改) 发给 资源服务器
    8. 将资源中的图片资源目录移除 剩余的打包给服务器

# layout

Pages => {

      Home(首页),
      Hero(英雄) => {
          List(列表),
          LvUp(升级),
          Synthesis(合成),
          BattleFormation(布阵)
      },
      HeroHire(英雄雇佣) => {
          Hire(出租英雄),
          MyHire(我的出租),
          MyEmployee(我的雇佣)
      }
      Battle(战役) => {

      },
      Tavern(酒馆) => {

      },
      Production(生产),
      Union(公会),
      UnionBattle(公会战),
      Market(市场) => {

      },

}

### ahooks

ahooks(https://ahooks.js.org/)

### react-spring

react-spring(https://react-spring.io/)

### use-gesture

use-gesture (https://use-gesture.netlify.com/)
