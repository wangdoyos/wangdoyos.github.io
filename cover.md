# 封面

通过将 `coverpage` 设置为 `true`，就可以激活封面功能。参考 [封面配置](configuration.md#coverpage)。

## 基本用法

设置 `coverpage` 为 **true**，并创建一个 `_coverpage.md`:

```js
window.$docsify = {
  coverpage: true,
};
```

```markdown
<!-- _coverpage.md -->

![logo](_media/icon.svg)

# docsify

> 一个神奇的网站生成器

- 简单、高亮
- 没有静态构建的HTML文件
- 多个主题

[GitHub](https://github.com/docsifyjs/docsify/)
[开始](#docsify)
```

## 定制化

封面页可以通过 [主题属性](themes#theme-properties) 进行定制。

<!-- prettier-ignore -->
```css
:root {
  --cover-bg         : url('path/to/image.png');
  --cover-bg-overlay : rgba(0, 0, 0, 0.5);
  --cover-color      : #fff;
  --cover-title-color: var(--theme-color);
  --cover-title-font : 600 var(--font-size-xxxl) var(--font-family);
}
```

一个背景色或者图片也可以在封面页的 Markdown 中指定。

```markdown
<!-- background color -->

![color](#f0f0f0)
```

```markdown
<!-- background image -->

![](_media/bg.png)
```

## 封面页作为主页

通常情况下，封面和主页是同时出现的。当然，你也可以使用 [`onlyCover`](configuration.md#onlycover) 选项单独设置封面。

## 多个封面

如果你的文档网站有多个语言版本，设置多个封面可能会很有用。

例如，你的文档结构如下：

```text
.
└── docs
    ├── README.md
    ├── guide.md
    ├── _coverpage.md
    └── zh-cn
        ├── README.md
        └── guide.md
        └── _coverpage.md
```

你可以设置

```js
window.$docsify = {
  coverpage: ['/', '/zh-cn/'],
};
```

或者指定一个文件名

```js
window.$docsify = {
  coverpage: {
    '/': 'cover.md',
    '/zh-cn/': 'cover.md',
  },
};
```
