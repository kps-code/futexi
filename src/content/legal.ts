/**
 * Privacy and Terms text. Seed and fallback values; the admin's Legal Pages
 * global overrides them. Placeholders: {brand}, {email}, {phone}, {price}.
 * Paragraphs are separated by a blank line.
 */

export type LegalSection = { title: string; body: string }
export type LegalPageContent = { title: string; intro: string; updatedOn: string; sections: LegalSection[] }

export const privacyDefaults: LegalPageContent = {
  title: 'Privacy Policy',
  intro: 'How {brand} handles information on this website.',
  updatedOn: '2026-10-07',
  sections: [
    {
      title: 'What we collect',
      body: 'When you browse, we record anonymous usage: pages viewed, time on page, scroll depth, button clicks, the page that referred you, your device type, browser, and country or city. We do not store your IP address; it is hashed with a daily key and cannot be reversed.\n\nWhen you submit the contact form, we store what you type: name, business name, email, WhatsApp number, business type, what you need, budget range and project details. We link it to your anonymous browsing so we can understand how you found us.',
    },
    {
      title: 'Cookies',
      body: 'We set two first-party cookies: kf_vid identifies your browser for up to 13 months and kf_sid groups one visit (it expires after 30 minutes of inactivity). They contain random identifiers only. We use no advertising or third-party tracking cookies.',
    },
    {
      title: 'How we use it',
      body: 'To reply to your enquiry, to understand which pages and demos are useful, and to improve the website. We never sell or share your information with third parties for marketing.',
    },
    {
      title: 'Retention',
      body: 'Anonymous browsing data is kept for 180 days and technical request logs for 90 days. Enquiries are kept until you ask us to delete them.',
    },
    {
      title: 'Your rights',
      body: 'You can ask us to show, correct or delete your information at any time. Email {email} or message us on WhatsApp at {phone}.',
    },
    {
      title: 'Services we use',
      body: 'The site is hosted on Vercel. Images are stored on Vercel Blob. Error reports may be sent to Sentry. Lead notification emails are sent through Resend. Each provider processes data only to deliver its service.',
    },
  ],
}

export const termsDefaults: LegalPageContent = {
  title: 'Terms',
  intro: 'Plain-language terms for using this website and working with {brand}.',
  updatedOn: '2026-10-07',
  sections: [
    {
      title: 'This website',
      body: 'Content, demos and designs on this site are the work of {brand}. You may browse and share links freely. Please do not copy the demos or designs for commercial use without asking.\n\nDemos are concept projects. Businesses shown in them are examples unless stated otherwise.',
    },
    {
      title: 'Enquiries and quotes',
      body: '{price}. A quote is prepared after we understand your requirements and is valid for 30 days. The final scope, price and timeline are confirmed in writing before work begins.',
    },
    {
      title: 'Projects',
      body: 'Work starts after the agreed advance payment. We deliver in stages and share progress for your review. Change requests outside the agreed scope are quoted separately. You own the final website, its content and its domain once the project is paid in full.',
    },
    {
      title: 'Third-party services',
      body: 'Domains, hosting, email, AI APIs and similar services are billed by their providers at their rates. We help you set them up in accounts you own.',
    },
    {
      title: 'Support',
      body: 'Bugs in delivered work are fixed free of charge for 30 days after launch. Ongoing updates and maintenance are available as a separate agreement.',
    },
    {
      title: 'Contact',
      body: 'Questions about these terms: {email}.',
    },
  ],
}
