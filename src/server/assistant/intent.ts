/**
 * Does the visitor's own message ask for a quote, a call back or a start? The model is told to
 * emit the quote-form token only in that case, but it over-uses it on plain price questions, so
 * the route shows the form only when the model asked for it AND the visitor's words agree.
 */
const QUOTE_INTENT =
  /\b(quote|quotation|estimate|proposal|call ?back|call me|ring me|contact me|reach me|get in touch|talk to (you|someone|sankar)|start|proceed|go ahead|let'?s (do|go|begin)|book|hire|interested|sign ?up|my (number|phone|whatsapp)|whatsapp me|venum|vendum|pannanum|pannunga|pannalam|pesalam|seiyalam|aarambikkalam|thodangalam)\b|\b\d{10}\b|\+91/i

/** Tamil-script equivalents: want, start, call, quote. */
const QUOTE_INTENT_TAMIL = /வேண்டும்|ஆரம்பி|தொடங்க|அழை|கூப்பிட|மேற்கோள்|விலைப்பட்டியல்|பேச/

export function wantsQuoteForm(text: string): boolean {
  return QUOTE_INTENT.test(text) || QUOTE_INTENT_TAMIL.test(text)
}
