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
        remember: false,
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
            <input {...form.fields.username.valueProps()} />
          </label>
          <label>
            Password
            <input type="password" {...form.fields.password.valueProps()} />
          </label>
          <label>
            Remember
            <input type="checkbox" {...form.fields.remember.checkedProps()} />
          </label>
          <button>Signin</button>
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
          "remember": false,
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
          "remember": false,
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
          "remember": false,
          "username": "asdf",
        },
        "isDirty": true,
      }
    `);

    await userEvent.click(screen.getByLabelText("Remember"));
    expect(JSON.parse(await getTestidText("debug"))).toMatchInlineSnapshot(`
      {
        "data": {
          "password": "jkl;",
          "remember": true,
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
            "password": "jkl;",
            "remember": true,
            "username": "asdf",
          },
        ],
      ]
    `);
    expect(JSON.parse(await getTestidText("debug"))).toMatchInlineSnapshot(`
      {
        "data": {
          "password": "jkl;",
          "remember": true,
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
