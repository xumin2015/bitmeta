# 玩家控制

## 项目里程碑
- [x] [替换人物模型](https://juejin.cn/post/7359084920596004902#heading-4)
- [x] [添加人物动画](https://juejin.cn/post/7359084920596004902#heading-5)
- [x] [加载场景模型](https://juejin.cn/post/7359084920596004902#heading-6)
- [x] [添加音乐、音效](https://juejin.cn/post/7361688292352213019)
- [x] [添加海水、调整光照](https://juejin.cn/post/7362547962605174821#heading-1)
- [x] [添加云朵、雾(云在不同浏览器中，着色器语言差异导致 可能 shader 执行失败)](https://juejin.cn/post/7362547962605174821#heading-4)
- [x] [添加小地图](https://juejin.cn/post/7365334891472355365)
- [x] [多人模式（待完善）](https://juejin.cn/post/7380694342745210918)

## 项目截图

### 物理效果人物控制

![人物控制](https://gitee.com/brother_shui/player-control/raw/game/screenshots/image-0.png)

### 切换模型加载环境

![模型切换](https://gitee.com/brother_shui/player-control/raw/game/screenshots/image-1.png)

### 添加海洋和云

![海洋](https://gitee.com/brother_shui/player-control/raw/game/screenshots/image-2.png)
![云朵](https://gitee.com/brother_shui/player-control/raw/game/screenshots/image-3.png)

### 小地图

![小地图](https://gitee.com/brother_shui/player-control/raw/game/screenshots/image-4.png)
![地图放大](https://gitee.com/brother_shui/player-control/raw/game/screenshots/image-5.png)
### 多人在线
![多人同屏](https://gitee.com/brother_shui/player-control/raw/game/screenshots/image-6.png)
## 项目搭建
在base基础上添加以下内容
- 添加 less 方便样式嵌套

```shell
  npm install less
```

- 添加数据管理 zustand

```shell
  npm install zustand
```
- 添加socket.io-client用来做消息同步
```shell
  npm install socket.io-client
```


