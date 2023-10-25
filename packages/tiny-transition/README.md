# tiny-transition

Simple framework-agnostic transition-based animation utility.
API is similar to [headlessui's `Transition`](https://headlessui.com/react/transition).

## examples

- https://unocss-preset-antd-hiro18181.vercel.app/Slide
- https://unocss-preset-antd-hiro18181.vercel.app/Collapse
- https://unocss-preset-antd-hiro18181.vercel.app/Toast
- https://unocss-preset-antd-hiro18181.vercel.app/Modal
- https://unocss-preset-antd-hiro18181.vercel.app/Popover
- https://unocss-preset-antd-solidjs-hiro18181.vercel.app/Drawer
- https://unocss-preset-antd-solidjs-hiro18181.vercel.app/Popover

## limitation compared to `@headlessui/react`

- always `remount`
- no `Transition.Child`
  - this can be mostly workaround by setting same animation duration for all components
