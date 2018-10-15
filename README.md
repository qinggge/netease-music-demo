# 仿网易云音乐 管理端

## 介绍
界面仿网易云音乐的一款云音乐播放器。（因账号安全问题，暂时无法提供上传功能）

## 预览
- [移动端播放页面](https://zhuhuang.me/netease-music-demo/src/index)
- [PC端歌曲管理页面](https://zhuhuang.me/netease-music-demo/src/admin)
- [PC端歌单管理页面](https://zhuhuang.me/netease-music-demo/src/admin-playlists)  
  
## 功能实现
- 歌单歌曲关联
- 在线歌曲播放
- 歌词滚动展示
- 歌曲页面光盘滚动
- 后台歌曲管理新建/编辑/上传歌曲
- 后台歌单管理新建/编辑/关联歌单

## 技术栈
- HTML5：根据 `HTML` 最新标准，使用语义化标签；  
- CSS3：实现页面光盘旋转等功能；
- 原生JS & jQuery：使用原生 `JS` 及 `jQuery` 库操作 `DOM` 及调用 `JS API`；
- MVC设计模式：即Model-View-Controller，面向对象编程；
- 发布/订阅模式：通过使用 `EventHub` 来发布/订阅事件，以用于实现模块间的通信，在歌曲及歌单管理中使用；
- [LeanCloud](https://leancloud.cn/)：云服务，用于存储歌曲及歌单信息的后台云服务器；
- [七牛云](https://www.qiniu.com/)：云服务，用于存储歌曲文件的后台云服务器。  

## 数据处理
考虑到歌曲及歌单的复杂性，后台数据库使用`中间表实现多对多关系`，通过中间表的关联，以便从歌曲查询对应的歌单，或从歌单查询从属的歌曲列表。