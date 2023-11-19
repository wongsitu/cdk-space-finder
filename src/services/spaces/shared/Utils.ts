import { JSONError } from "./Validators";

export function parseJSON<T>(json: string): T {
  try {
    return JSON.parse(json);
  } catch (e: any) {
    throw new JSONError(e.message);
  }
}