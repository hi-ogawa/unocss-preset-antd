# tiny-transition

Rendering framework agnostic transition/animation utility.

## limitation compared to `@headlessui/react`

- always `remount`
- no `Transition.Child`
  - can workaround by setting same animation duration for all components + set `appear` for inner components
