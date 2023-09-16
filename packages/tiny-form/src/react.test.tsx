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
