---
order: 11
title: Development
type: Basic Usage
---

Ant Design Pro 以 umi 作为脚手架，启动和开发与 umi 基本相同。

## start your build

Execute `npm run start` under the project root to start the project.

![strat](https://gw.alipayobjects.com/zos/antfincdn/%26df0HXZbRD/4B634700-7C4F-44BA-A45C-E250601C8971.png)

Visit the following interface at [http://localhost:8000/](http://localhost:8000/).

![app](https://gw.alipayobjects.com/zos/antfincdn/9bvHFQRjep/0B7EE9A4-2CD7-4626-9B8E-DEEA85EE2126.png)

> Because user permissions are used by default, you can use admin to sign in to see all pages.

### Environment

For many projects, a variable that differentiates the environment is required, but it also provides a quick way to start and the corresponding ui presentation. Pro has three environments built in `dev`, `test`, `pre`. You can start separately by running commands such as `npm run start:test`. It also injects a 'REACT_APP_ENV' variable into each page to distinguish.

> `dev`, `test`, `pre` environments all turn off the mock by default. `REACT_APP_ENV` is not mounted in windows and cannot pass `windows.REACT_APP_ENV` to get.

## Layout

The layout is a must-have for a background application, and a layout, ProTable and Form, gives you a CRUD page. [plugin-layout](https://umijs.org/plugins/plugin-layout) built in Pro 。

### Use by plugin

We can reduce boilerplate code by [plugin-layout](https://umijs.org/plugins/plugin-layout). In simple use we only need to configure the layout property in `config.ts`.

```tsx
import { defineConfig } from 'umi';

export const config = defineConfig({
  layout: {
    name: 'Ant Design Pro',
    logo: 'https://preview.pro.ant.design/static/logo.f0355d39.svg',
  },
});
```

If you need a more complex configuration that can be configured in `app.tsx`, take Pro as an example:

```tsx
export const layout = {
  rightRender: () => {
    return <RightContent />;
  },
  footerRender: () => <Footer />,
};
```

This configuration supports any ProLayout configuration. You can see this in [detail](https://prolayout.ant.design).

### Use code to implement layout

Plugin-layout may not be able to meet complex requirements, and we need to write our own code for complex layout configurations. The current subpage is automatically injected into the layout's props. One of the simplest layouts is the following.

```tsx
const Layout = ({ children }) => children;
export default Layout;
```

#### Layout implementation in v4

```tsx
import ProLayout, {
  BasicLayoutProps as ProLayoutProps,
  DefaultFooter,
} from '@ant-design/pro-layout';
import React from 'react';
import { Link, useIntl } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import RightContent from '@/components/GlobalHeader/RightContent';

const defaultFooterDom = (
  <DefaultFooter
    copyright="2019 蚂蚁金服体验技术部出品"
    links={[
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);

const BasicLayout: React.FC<ProLayoutProps> = (props) => {
  const {
    children,
    location = {
      pathname: '/',
    },
  } = props;

  const { formatMessage } = useIntl();

  return (
    <ProLayout
      logo={logo}
      formatMessage={formatMessage}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/">
          {logoDom}
          {titleDom}
        </Link>
      )}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({ id: 'menu.home' }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={() => defaultFooterDom}
      rightContentRender={() => <RightContent />}
      {...props}
    >
      {children}
    </ProLayout>
  );
};

export default BasicLayout;
```

## MOCK

In many cases, the front end is really developed before it's completed, and we need to use mock data. Two ways of defining mocks are agreed in Pro.

- Access in the mock of the root
- Configured in the file of mock.ts in src/page

A standard mock consists of three parts, for example, a List configuration.

```tsx
export default {
  'GET /api/rule': [{ name: '12' }],
  'POST /api/rule': (req: Request, res: Response, u: string) => {
    res.send({
      success: true,
    });
  },
};
```

The first part is the Method configuration of the network request, the full list can be seen [here](https://developer.mozilla.org/zh-CN/docs/web/HTTP/Methods). Generally we use GET and POST.

The second part is the URL, which is the address where we initiate the network request. Generally we will use a uniform prefix to facilitate the use of agents.

The third part is data processing, we can configure a JSON, JSON data will be returned directly. Or configure a function with three parameters [req](https://expressjs.com/en/4x/api.html#req), [res](https://expressjs.com/en/4x/api.html#res),url 。 Use it in the same way as [express](https://expressjs.com/). The data must be returned by `res.send`.

## PROXY

The agent is designed to solve cross-domain problems while facilitating the use of technology, in Pro we have built-in proxy, and made environmental distinctions. A standard configuration is this.

```ts
export default {
  dev: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
```

The agent has some important configurations first one to match the route's regular rules, `/api/` will match `/api/list`, but will not match `api/list`, or `/list/api`. Target needs the location of the request, `target: 'https://preview.pro.ant.design,` will `/api/list` stitched into `https://preview.pro.ant.design/api/list` to make the request. pathRewrite is an object of `'/api': '/qixian'` will replace the url `/api` all with `/qixian` and then send out

> The agent does not modify the url of the console, and all of its operations are in node.js.

## ProTable

Developing a table is a basic in-background practice, and we encapsulate a heavy-duty component to introduce boilerplate code, which has two code-saving features, starting with support for request to request data so that refreshes and all that he can trigger automatically. Second, it supports many presets such as common numbers, dates, or complex enumerations, which he can handle automatically for you and generate query forms by the way. The following image is a simple ProTable usage.

![protable](https://gw.alipayobjects.com/zos/antfincdn/Qi5lwGanlE/47FCD236-C1D4-4FD1-9721-6B4F2443F420.png)

Reference documents: <https://protable.ant.design/>