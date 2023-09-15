import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createTinyForm } from "./core";

afterEach(cleanup);

describe(createTinyForm, () => {
  it("basic", async () => {
    const mockSubmit = vi.fn();

    function Demo() {
      const form = createTinyForm(
        React.useState({
          email: "",
          password: "",
          remember: false,
        })
      );

      return (
        <form onSubmit={form.handleSubmit(() => mockSubmit(form.data))}>
          <label>
            Username
            <input {...form.fields.email.valueProps()} />
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
          <pre data-testid="debug">{JSON.stringify(form.data, null, 2)}</pre>
        </form>
      );
    }

    render(<Demo />);
    expect(JSON.parse(await getTestidText("debug"))).toMatchInlineSnapshot(`
      {
        "email": "",
        "password": "",
        "remember": false,
      }
    `);

    await userEvent.type(screen.getByLabelText("Username"), "asdf");
    expect(JSON.parse(await getTestidText("debug"))).toMatchInlineSnapshot(`
      {
        "email": "asdf",
        "password": "",
        "remember": false,
      }
    `);

    await userEvent.type(screen.getByLabelText("Password"), "jkl;");
    expect(JSON.parse(await getTestidText("debug"))).toMatchInlineSnapshot(`
      {
        "email": "asdf",
        "password": "jkl;",
        "remember": false,
      }
    `);

    await userEvent.click(screen.getByLabelText("Remember"));
    expect(JSON.parse(await getTestidText("debug"))).toMatchInlineSnapshot(`
      {
        "email": "asdf",
        "password": "jkl;",
        "remember": true,
      }
    `);

    expect(mockSubmit.mock.calls).toMatchInlineSnapshot("[]");
    await userEvent.click(screen.getByRole("button"));
    expect(mockSubmit.mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "email": "asdf",
            "password": "jkl;",
            "remember": true,
          },
        ],
      ]
    `);
  });
});

async function getTestidText(testId: string) {
  const el = await screen.findByTestId(testId);
  return el.textContent ?? "";
}
