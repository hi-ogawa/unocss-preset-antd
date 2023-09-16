import { none } from "@hiogawa/utils";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createTinyForm } from "./core";
import { useTinyForm } from "./react";

afterEach(cleanup);

describe(createTinyForm, () => {
  it("basic", async () => {
    const mockSubmit = vi.fn();

    function Demo() {
      const form = useTinyForm({
        username: "",
        password: "",
        age: none<number>(),
        subscribe: false,
      });

      return (
        <form
          onSubmit={form.handleSubmit(() => {
            mockSubmit(form.data);
            form.resetDirty();
          })}
        >
          <label>
            Username
            <input {...form.fields.username.props()} />
          </label>
          <label>
            Password
            <input type="password" {...form.fields.password.props()} />
          </label>
          <label>
            Age
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              className="antd-input p-1"
              name={form.fields.age.name}
              value={form.fields.age.value ?? ""}
              onChange={(e) => {
                if (!e.target.validity.patternMismatch) {
                  form.fields.age.onChange(
                    e.target.value ? Number(e.target.value) : undefined
                  );
                }
              }}
            />
          </label>
          <label>
            Subscribe
            <input
              type="checkbox"
              {...form.fields.subscribe.props({ checked: true })}
            />
          </label>
          <button>Submit</button>
          <pre data-testid="debug">
            {JSON.stringify({ data: form.data, isDirty: form.isDirty })}
          </pre>
        </form>
      );
    }

    render(<Demo />);
    expect(JSON.parse(await getTestidText("debug"))).toMatchInlineSnapshot(`
      {
        "data": {
          "password": "",
          "subscribe": false,
          "username": "",
        },
        "isDirty": false,
      }
    `);

    // "name" attribute
    expect(screen.getByLabelText("Username")).toMatchInlineSnapshot(`
      <input
        name="username"
        value=""
      />
    `);

    await userEvent.type(screen.getByLabelText("Username"), "asdf");
    expect(JSON.parse(await getTestidText("debug"))).toMatchInlineSnapshot(`
      {
        "data": {
          "password": "",
          "subscribe": false,
          "username": "asdf",
        },
        "isDirty": true,
      }
    `);

    await userEvent.type(screen.getByLabelText("Password"), "jkl;");
    expect(JSON.parse(await getTestidText("debug"))).toMatchInlineSnapshot(`
      {
        "data": {
          "password": "jkl;",
          "subscribe": false,
          "username": "asdf",
        },
        "isDirty": true,
      }
    `);

    await userEvent.type(screen.getByLabelText("Age"), "20");
    expect(JSON.parse(await getTestidText("debug"))).toMatchInlineSnapshot(`
      {
        "data": {
          "age": 20,
          "password": "jkl;",
          "subscribe": false,
          "username": "asdf",
        },
        "isDirty": true,
      }
    `);

    await userEvent.clear(screen.getByLabelText("Age"));
    expect(JSON.parse(await getTestidText("debug"))).toMatchInlineSnapshot(`
      {
        "data": {
          "password": "jkl;",
          "subscribe": false,
          "username": "asdf",
        },
        "isDirty": true,
      }
    `);

    await userEvent.click(screen.getByLabelText("Subscribe"));
    expect(JSON.parse(await getTestidText("debug"))).toMatchInlineSnapshot(`
      {
        "data": {
          "password": "jkl;",
          "subscribe": true,
          "username": "asdf",
        },
        "isDirty": true,
      }
    `);

    expect(mockSubmit.mock.calls).toMatchInlineSnapshot("[]");
    await userEvent.click(screen.getByRole("button"));
    expect(mockSubmit.mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "age": undefined,
            "password": "jkl;",
            "subscribe": true,
            "username": "asdf",
          },
        ],
      ]
    `);
    expect(JSON.parse(await getTestidText("debug"))).toMatchInlineSnapshot(`
      {
        "data": {
          "password": "jkl;",
          "subscribe": true,
          "username": "asdf",
        },
        "isDirty": false,
      }
    `);
  });
});

async function getTestidText(testId: string) {
  const el = await screen.findByTestId(testId);
  return el.textContent ?? "";
}
