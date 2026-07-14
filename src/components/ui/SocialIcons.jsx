// lucide-react no longer ships brand/social icons, so these are small
// hand-rolled outline icons kept visually consistent with the rest of the UI.

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 9h2V6h-2c-1.66 0-3 1.34-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14V9z" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 5.8c-.7.3-1.4.5-2.2.6.8-.5 1.4-1.2 1.7-2.1-.7.4-1.6.8-2.4.9a3.7 3.7 0 0 0-6.4 3.4A10.6 10.6 0 0 1 3.1 4.7a3.7 3.7 0 0 0 1.2 5 3.7 3.7 0 0 1-1.7-.5v.1c0 1.8 1.3 3.3 2.9 3.6-.5.1-1.1.2-1.6.1a3.7 3.7 0 0 0 3.5 2.6A7.5 7.5 0 0 1 2 17.1a10.6 10.6 0 0 0 5.7 1.7c6.9 0 10.6-5.7 10.6-10.6v-.5c.7-.5 1.3-1.2 1.8-1.9z" />
    </svg>
  );
}

export function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10.5 9.3v5.4l5-2.7-5-2.7z" fill="currentColor" stroke="none" />
    </svg>
  );
}
