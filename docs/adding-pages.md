# 添加页面

如果你需要更多页面，你可以在你的 docsify 文件夹下创建更多markdown文件。如果你创建了一个名为 `guide.md`的文件，它可以通过`/#/guide`被访问到.

例如，你的目录结构如下：

```text
.
└── docs
    ├── README.md
    ├── guide.md
    └── zh-cn
        ├── README.md
        └── guide.md
```

路径映射

```text
docs/README.md        => http://domain.com
docs/guide.md         => http://domain.com/#/guide
docs/zh-cn/README.md  => http://domain.com/#/zh-cn/
docs/zh-cn/guide.md   => http://domain.com/#/zh-cn/guide
```

## 侧边栏

为了有一个侧边栏，你可以创建你自己的 `_sidebar.md`（参见 [本页的侧边栏](_sidebar.md) 作为例子）。

首先要设置 `loadSidebar` 为 `true`。更多信息请查看 [配置章节](configuration.md#loadsidebar)。

```html
<!-- index.html -->

<script>
  window.$docsify = {
    loadSidebar: true,
  };
</script>
<script src="//cdn.jsdelivr.net/npm/docsify@5/dist/docsify.min.js"></script>
```

创建 `_sidebar.md`:

```markdown
<!-- docs/_sidebar.md -->

- [Home](/)
- [Page 1](page-1.md)
```

创建目录：

```markdown
<!-- docs/_sidebar.md -->

- 目录1

  - [Home](/)
  - [Page 1](page-1.md)

- 目录2

  - [Page 2](page-2.md)
  - [Page 3](page-3.md)
```

你需要在`./docs`中创建一个`.nojekyll`，以防止GitHub Pages忽略以`_`开头的文件。

!> Docsify只在当前文件夹中寻找`_sidebar.md`，并且使用它，如果没有找到，它就会回退到使用`window.$docsify.loadSidebar`配置。

示例文件结构：

```text
└── docs/
    ├── _sidebar.md
    ├── index.md
    ├── getting-started.md
    └── running-services.md
```

## 嵌套侧边栏

你可能希望在导航后更新侧边栏以反映当前目录，这可以通过在每个文件夹中创建一个`_sidebar.md`文件实现。

`_sidebar.md` 从每个级别的目录中加载。如果当前目录没有`_sidebar.md`，它将回退到父目录。例如，如果当前路径是`/guide/quick-start`，则`_sidebar.md`将加载自`/guide/_sidebar.md`。 

你可以使用`alias`来避免不必要的回退。

```html
<script>
  window.$docsify = {
    loadSidebar: true,
    alias: {
      '/.*/_sidebar.md': '/_sidebar.md',
    },
  };
</script>
```

你可以子目录中创建一个`README.md`文件，用作路由的落地页。

## 在侧边栏选择设置页面标题

一个页面的`title`标签是选中的侧边栏项目名称生成的。为了更好地 SEO，你可以通过在文件名之后指定一个字符串来定制标题。

```markdown
<!-- docs/_sidebar.md -->

- [首页](/)
- [指南](guide.md '世界上最好的指南')
```

## 目录树结构

一旦你创建了`_sidebar.md`，侧边栏的内容将自动根据markdown文件的标题生成。

一个自定义的侧边栏也可以通过设置`subMaxLevel`自动生成目录树结构。参考 [目录树设置](configuration.md#submaxlevel).

```html
<!-- index.html -->

<script>
  window.$docsify = {
    loadSidebar: true,
    subMaxLevel: 2,
  };
</script>
<script src="//cdn.jsdelivr.net/npm/docsify@5/dist/docsify.min.js"></script>
```

## 忽略子目录

当设置了`subMaxLevel`，默认情况下每个标题都会自动添加到目录中。如果你想忽略特定的标题，可以在其上添加`<!-- {docsify-ignore} -->`。

```markdown
# 开始

## 标题 <!-- {docsify-ignore} -->

这个标题不会出现在侧边栏目录中。
```

想要忽略指定页面全部的标题，你可以在页面的第一个标题上使用 `<!-- {docsify-ignore-all} -->` 。

```markdown
# 开始 <!-- {docsify-ignore-all} -->

## 标题

这个标题不会出现在侧边栏目录中。
```

`<!-- {docsify-ignore} -->` 和 `<!-- {docsify-ignore-all} -->` 使用时不会在页面被呈现出来


`{docsify-ignore}` 和 `{docsify-ignore-all}` 在页面上呈现的效果一致
