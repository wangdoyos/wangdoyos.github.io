# 快速开始

建议全局安装 `docsify-cli` ，有助于在本地初始化和预览网站。

```bash
npm i docsify-cli -g
```

## 初始化

可以使用 `init` 命令在 `./docs`子目录下写文档

```bash
docsify init ./docs
```

## 写内容

 `init` 初始化编译之后，你可以在 `./docs` 目录下查看文档.

- `index.html` 文件入库
- `README.md` 主页
- `.nojekyll` 防止GitHub Pages忽略以下划线开头的文件

你可以轻松的在`./docs/README.md`文件中更新文档，也可以添加 [更多页面](adding-pages.md).

## 预览你的网站

使用 `docsify serve`命令在本地运行服务。你可以在浏览器输入 `http://localhost:3000`预览你的网站.

```bash
docsify serve docs
```

?> `docsify-cli`的更多使用案例，请查阅 [docsify-cli 文档](https://github.com/docsifyjs/docsify-cli)。

## 手动初始化

使用以下代码编写一个 `index.html` :

<div id="template">

<a href="#" class="button primary" download="index.html">或者点击直接下载模板</a>

<!-- prettier-ignore -->
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

    <!-- Core Theme -->
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/core.min.css">
  </head>
  <body class="loading">
    <div id="app"></div>

    <!-- Configuration -->
    <script>
      window.$docsify = {
        //...
      };
    </script>

    <!-- Docsify.js -->
    <script src="//cdn.jsdelivr.net/npm/docsify@5"></script>

    <!-- Plugins (optional) -->
    <!-- <script src="//cdn.jsdelivr.net/npm/docsify@5/dist/plugins/search.min.js"></script> -->
  </body>
</html>
```

</div>

### 指定文档版本

?> 请注意，在下面的两个示例中，当docsify的新主版本发布时，需要手动更新docsify的url。(例如：`v5.x. x` => `v6.x.x`)。定期查看docsify网站，看看是否发布了新的主要版本。

在URL中指定一个主版本（“@5”）将允许您的站点自动接收非破坏性升级(即：“次要”更新)和bug修复(例如:“patch”更新)。这是加载多文件资源的推荐方法。

<!-- prettier-ignore -->
```html
<!-- 核心主题 -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/core.min.css">

<!-- Docsify -->
<script src="//cdn.jsdelivr.net/npm/docsify@5"></script>
```

如果你希望将docsify锁定到特定版本，请在URL中的“@”符号后面指定完整版本。这是最安全的方法，可以确保无论未来docsify的版本做任何更改，你的站点都能保持相同的外观和行为。

<!-- prettier-ignore -->
```html
<!-- 核心主题 -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5.0.0/themes/core.min.css">

<!-- Docsify -->
<script src="//cdn.jsdelivr.net/npm/docsify@5.0.0"></script>
```

### 手动预览你的网站

如果你的系统上安装了Python，你可以轻松地使用它来运行静态服务器预览您的站点。

```python
# Python 2
cd docs && python -m SimpleHTTPServer 3000
```

```python
# Python 3
cd docs && python -m http.server 3000
```

## 加载对话框

你可以在docsify开始渲染你的文档之前显示一个加载对话框：

```html
<!-- index.html -->

<div id="app">请等待...</div>
```

如果你修改了`el`，你需要设置`data-app`属性：

```html
<!-- index.html -->

<div data-app id="main">请等待...</div>

<script>
  window.$docsify = {
    el: '#main',
  };
</script>
```
 
参考 [el configuration](configuration.md#el)。

<script>
  (function() {
    const linkElm = document.querySelector('#template a[download="index.html"]');
    const codeElm = document.querySelector('#template code');
    const html = codeElm?.textContent;

    linkElm?.setAttribute('href', `data:text/plain,${html}`);
  })();
</script>
