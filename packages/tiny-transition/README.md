# tiny-transition

Simple framework-agnostic transition-based animation utility.

## limitation compared to `@headlessui/react`

- always `remount`
- no `Transition.Child`
  - this can be mostly workaround by setting same animation duration for all components
