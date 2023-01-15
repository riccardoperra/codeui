import { Component } from "solid-js";

export type GetKobalteParams<T extends Component<any>> = Parameters<T>[0];
