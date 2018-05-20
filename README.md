# 杭州科沃流体设备有限公司

> 朋友没时间，让我帮忙做一下这个企业网站。  
> 耗时5个小时。  
> 动画还需要优化，暂时能满足需求就这样吧。  
> 页面SEO还需要加meta标签。  
> 内页的bread crumb和二级导航还可以做成组件，跟全局导航一样。  
> 没有做兼容性测试。  


## 运行项目

1. 安装node.js。

- 可以参考这个[链接](http://xiaoyaojones.blog.163.com/blog/static/28370125201351501113581/)来安装。

2. 安装依赖。

- 能翻墙，使用cmd命令到项目文件下，输入`npm install`。
- 不能翻墙，就安装[淘宝 NPM 镜像](https://npm.taobao.org/)，网上去搜下教程。然手输入`cnpm install`来安装工具包。

3. 运行命令。

- 安装成功输入`npm run dev`。
- 编译成功后浏览器会自动打开页面`http://localhost:8080/page/index.html`。端口如果被占用就会变。具体地址看log。
- 修改src中的文件浏览器会自动刷新。


## 页面配置
```
kewo
  |---dist 编译后的目录（浏览器可以识别的页面）
  |---src 开发目录
    |---img 图片资源
    |---js js文件
    |---page 页面
      |--- layout 公用组件（不生成页面）
        |---footer.html 公用底部 （包括版权，联系方式，友情链接等公用组件）
        |---head.html 页面头部（包括引用css，js，各种meta等公用代码）
        |---header.html 公用头部 （包括全局导航和logo等公用组件）
      |--- index.html 网站首页
      |--- about_us.html 关于我们
    |---style 全局样式
      |--- index.less 页面样式文件
      |--- normalize.less
      |--- reset.less
  |---.babelrc babel配置文件，能够使用es6新特性。
  |---.editorconfig 编辑器配置文件。统一代码风格。
  |---.gitigonre git忽略配置文件。
  |---gulpfile.js gulp配置文件。
  |---package.json
```

## 注意事项

- css命名。采用BEM形式。
- 文件名。用下划线作为连字符，不使用驼峰或中划线等方式。
- 缩进。使用2个空格。
- 使用[scrollreveal.js](https://github.com/jlmakes/scrollreveal)实现页面滚动动画。
- 使用less做css预编译。如果不会用直接在less文件里面写css样式就行。
- 使用gulp作为构建工具来构建服务器环境，编译less，热更新等。


## 如何使用gulp-file-include

- [官方介绍](https://www.npmjs.com/package/gulp-file-include)
- 用[导航传参](https://www.cnblogs.com/nzbin/p/7467546.html)来设置对应的选中状态。

index.html页面

```
<!DOCTYPE html>
<html>
  <body>
  @@include('layout/header.html', {
    "index": "current"
  })
  </body>
</html>
```

header.html
```
<nav class="header__nav">
  <ul class="clearfix">
    <li
      @@if (context.index !== 'current') { class="header__nav-item" }
      @@if (context.index === 'current') { class="header__nav-item header__nav-item_current" }
    >
      <a href="index.html">首页</a>
    </li>
    <li
      @@if (context.aboutUs !== 'current') { class="header__nav-item" }
      @@if (context.aboutUs === 'current') { class="header__nav-item header__nav-item_current" }
    >
      <a href="about_us.html">关于我们</a>
    </li>
    <li class="header__nav-item"><a href="#">科沃品牌</a></li>
    <li class="header__nav-item"><a href="#">新闻资讯</a></li>
    <li class="header__nav-item"><a href="#">技术支持</a></li>
    <li class="header__nav-item"><a href="#">下载中心</a></li>
    <li class="header__nav-item"><a href="#">联系我们</a></li>
  </ul>
</nav>
```

编译结果
```
<nav class="header__nav">
  <ul class="clearfix">
    <li class="header__nav-item header__nav-item_current">
      <a href="index.html">首页</a>
    </li>
    <li class="header__nav-item">
      <a href="about_us.html">关于我们</a>
    </li>
    <li class="header__nav-item"><a href="#">科沃品牌</a></li>
    <li class="header__nav-item"><a href="#">新闻资讯</a></li>
    <li class="header__nav-item"><a href="#">技术支持</a></li>
    <li class="header__nav-item"><a href="#">下载中心</a></li>
    <li class="header__nav-item"><a href="#">联系我们</a></li>
  </ul>
</nav>
```
