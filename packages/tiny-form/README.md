# tiny-form

Simple but convenient enough framework-agnostic type-safe form input management utility.

API is inspired by

- https://github.com/react-hook-form/react-hook-form
- https://github.com/edmundhung/conform

## features

- type-safe form input fields accessor: `form.fields`
- input props helper: `value/checked/onChange`
- track form dirty state: `isDirty/resetDirty`

### not supported

- array
- nested object
- validator integration

## example

- https://unocss-preset-antd-hiro18181.vercel.app/Form
- https://github.com/hi-ogawa/unocss-preset-antd/blob/main/packages/app/src/components/stories.tsx

<!--
%template-input-start:example%

```tsx
import React from "react";
import { createTinyForm } from "@hiogawa/tiny-form";

{%shell node -e 'console.log(fs.readFileSync("../app/src/components/stories.tsx", "utf-8").match(/^export function StoryForm(.*?)^}/ms)[0])' %}
```

%template-input-end:example%
-->

<!-- %template-output-start:example% -->

```tsx
import React from "react";
import { createTinyForm } from "@hiogawa/tiny-form";

export function StoryForm() {
  const form = createTinyForm(
    React.useState({
      username: "",
      password: "",
      age: undefined as number | undefined,
      subscribe: false,
    })
  );

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="w-full max-w-lg border p-4">
        <form
          className="flex flex-col gap-3"
          onSubmit={form.handleSubmit(() => {
            window.alert(
              "Submission data\n" + JSON.stringify(form.data, null, 2)
            );
          })}
        >
          <h2 className="text-xl">Register</h2>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-colorTextLabel">Username</span>
              <input
                className="antd-input p-1"
                required
                {...form.fields.username.props()}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-colorTextLabel">Password</span>
              <input
                className="antd-input p-1"
                type="password"
                required
                {...form.fields.password.props()}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-colorTextLabel">Age (optional)</span>
              <input
                type="number"
                className="antd-input p-1"
                name={form.fields.age.name}
                value={String(form.fields.age.value ?? "")}
                onChange={(e) =>
                  form.fields.age.onChange(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-colorTextLabel">
                Subscribe to a news letter
              </span>
              <input
                type="checkbox"
                {...form.fields.subscribe.props({ checked: true })}
              />
            </label>
            <button className="antd-btn antd-btn-primary p-1">Submit</button>
            <div className="border-t my-1"></div>
            <label className="flex flex-col gap-1 text-colorTextSecondary">
              <span>Debug</span>
              <pre className="text-sm">
                {JSON.stringify(form.data, null, 2)}
              </pre>
            </label>
          </div>
        </form>
      </section>
    </div>
  );
}
```

<!-- %template-output-end:example% -->
