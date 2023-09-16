# tiny-form

Simple but convenient enough framework-agnostic type-safe form input management utility.

API is inspired by

- https://github.com/react-hook-form/react-hook-form
- https://github.com/edmundhung/conform

## example

- https://unocss-preset-antd-hiro18181.vercel.app/#/Form
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
      email: "",
      password: "",
      remember: false,
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
          <h2 className="text-xl">Signin</h2>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-colorTextLabel">Email</span>
              <input
                className="antd-input p-1"
                required
                {...form.fields.email.valueProps()}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-colorTextLabel">Password</span>
              <input
                className="antd-input p-1"
                type="password"
                required
                {...form.fields.password.valueProps()}
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-colorTextLabel">
                Stay signed in for a week
              </span>
              <input type="checkbox" {...form.fields.remember.checkedProps()} />
            </label>
            <button className="antd-btn antd-btn-primary p-1">Signin</button>
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
