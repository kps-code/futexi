/** Tamil script block (U+0B80 to U+0BFF). Tanglish is written in Latin letters and does not match. */
const TAMIL_SCRIPT = /[஀-௿]/

export function hasTamilScript(text: string): boolean {
  return TAMIL_SCRIPT.test(text)
}
