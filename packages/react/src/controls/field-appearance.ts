"use client";

import type { TextFieldStyleOptions } from "@codeui/styles/textfield";
import { createContext } from "react";

export type FieldAppearance = Omit<TextFieldStyleOptions, "class">;

/** Size and variant a field root hands to the input composed inside it. */
export const FieldAppearanceContext = createContext<FieldAppearance>({});
