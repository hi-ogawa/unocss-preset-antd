import { createRuntime } from "@hiogawa/unocss-typescript-dsl/dist/runtime";
import type { Api } from "./tw-api";

export const tw = createRuntime() as Api;
