---
order: 3
title:
  en-US: Router and Nav
  zh-CN: 路由和菜单
type: 入门
---

路由和菜单是组织起一个应用的关键骨架，pro 中的路由为了方便管理，使用了中心化的方式，在 [`router.config.js`](https://github.com/ant-design/ant-design-pro/blob/master/config/router.config.js) 统一配置和管理。

---

## 基本结构

在这一部分，脚手架通过结合一些配置文件、基本算法及工具函数，搭建好了路由和菜单的基本框架，主要涉及以下几个模块/功能：

- `路由管理` 通过约定的语法根据在 [`router.config.js`](https://github.com/ant-design/ant-design-pro/blob/master/config/router.config.js) 中配置路由。
- `菜单生成` 根据路由配置来生成菜单。菜单项名称，嵌套路径与路由高度耦合。
- `面包屑` 组件 [PageHeader](http://pro.ant.design/components/PageHeader) 中内置的面包屑也可由脚手架提供的配置信息自动生成。

下面简单介绍下各个模块的基本思路，如果你对实现过程不感兴趣，只想了解应该怎么实现相关需求，可以直接查看[需求实例](/docs/router-and-nav#需求实例)。

### 路由

目前脚手架中所有的路由都通过 [`router.config.js`](https://github.com/ant-design/ant-design-pro/blob/master/config/router.config.js) 来统一管理，在 umi 的配置中我们增加了一些参数，如 `name`,`icon`,`hideChildren`,`authority`，来辅助生成菜单。其中：

- `name` 和 `icon`分别代表生成菜单项的图标和文本。
- `hideChildren` 用于隐藏不需要在菜单中展示的子路由。用法可以查看 `分步表单` 的配置。
- `hideInMenu` 可以在菜单中不展示这个路由，包括子路由。效果可以查看 `exception/trigger`页面。
- `authority` 用来配置这个路由的权限，如果配置了将会验证当前用户的权限，并决定是否展示。
  > 你可能注意到配置中的 `name` 和菜单实际展示的不同，这是因为我们使用了全球化组件的原因，具体参见 [i18n](/docs/i18n)

### 菜单

菜单根据 [`router.config.js`](https://github.com/ant-design/ant-design-pro/blob/master/config/router.config.js) 生成，具体逻辑在 `src/layouts/BasicLayout` 中的 `formatter` 方法实现。

> 如果你的项目并不需要菜单，你可以直接在 `BasicLayout` 中删除 `SiderMenu` 组件的挂载。并在 [`src/layouts/BasicLayout`](https://github.com/ant-design/ant-design-pro/blob/master/src/layouts/BasicLayout.js#L227) 中 设置 `const MenuData = []`。

> 如果你需要从服务器请求菜单，可以将 [menuData](https://github.com/ant-design/ant-design-pro/blob/master/src/layouts/BasicLayout.js#L227)  设置为 state，然后通过网络获取来修改了 state。

### 面包屑

面包屑由 `PageHeaderLayout` 实现，`MenuContext` 将 根据 `MenuData` 生成的 `breadcrumbNameMap` 通过 props 传递给了 `PageHeader`，如果你要做自定义的面包屑，可以通过修改传入的 `breadcrumbNameMap` 来解决。

`breadcrumbNameMap` 示例数据如下：

```js
{
  '/': { path: '/', redirect: '/dashboard/analysis', locale: 'menu' },
  '/dashboard/analysis': {
    name: 'analysis',
    component: './Dashboard/Analysis',
    locale: 'menu.dashboard.analysis',
  },
  ...
}
```

## 需求实例

上面对这部分的实现概要进行了介绍，接下来通过实际的案例来说明具体该怎么做。

### 新增页面

脚手架默认提供了两种布局模板：`基础布局 - BasicLayout` 以及 `账户相关布局 - UserLayout`：

<img alt="基础布局" src="https://gw.alipayobjects.com/zos/rmsportal/oXmyfmffJVvdbmDoGvuF.png" />

<img alt="账户相关布局" src="https://gw.alipayobjects.com/zos/rmsportal/mXsydBXvLqBVEZLMssEy.png" />

如果你的页面可以利用这两种布局，那么只需要在路由配置中增加一条即可：

```js
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      { path :'/dashboard/test',component:"./Dashboard/Test"},
    ...
},
```

加好后，会默认生成相关的路由及导航。

### 新增布局

在脚手架中我们通过嵌套路由来实现布局模板。[`router.config.js`](https://github.com/ant-design/ant-design-pro/blob/master/config/router.config.js) 是一个数组，其中第一级数据就是我们的布局，如果你需要新增布局可以在直接增加一个新的一级数组。

```js
module.exports = [
   // user
   {
    path: '/user',
    component: '../layouts/UserLayout',
    routes:[...]
   },
   // app
   {
    path: '/',
    component: '../layouts/BasicLayout',
    routes:[...]
   },
   // new
   {
    path: '/new',
    component: '../layouts/new_page',
    routes:[...]
   },
]

```

### 带参数的路由

脚手架默认支持带参数的路由,但是在菜单中显示带参数的路由并不是个好主意，我们并不会自动的帮你注入一个参数，你可能需要在代码中自行处理。

```js
{ path: '/dashboard/:page',hideInMenu:true, name: 'analysis', component: './Dashboard/Analysis' },
```

你可以通过以下代码来跳转到这个路由：

```js
import router from 'umi/router';

router.push('/dashboard/anyParams')

//or

import Link from 'umi/link';

<Link to="/dashboard/anyParams">go</Link>
```

在路由组件中，可以通过`this.props.match.params` 来获得路由参数。


更多详细内容请参见：[umi#路由](https://umijs.org/guide/router.html#%E7%BA%A6%E5%AE%9A%E5%BC%8F%E8%B7%AF%E7%94%B1)
