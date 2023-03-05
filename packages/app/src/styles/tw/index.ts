import { createRuntime } from "@hiogawa/unocss-typescript-dsl/dist/runtime";
import type { Api } from "./types";

export const tw = createRuntime() as Api;
