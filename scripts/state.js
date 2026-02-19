import { load } from "./storage.js";

export const state = {
  records: load(),
  cap: 0
};
