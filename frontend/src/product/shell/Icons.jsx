// One quiet stroke icon set for the product shell.
const Svg = ({ children, size = 22, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

export const DiscoverIcon = (props) => (
  <Svg {...props}><circle cx="12" cy="12" r="8.5" /><path d="m15.2 8.8-1.9 4.5-4.5 1.9 1.9-4.5z" /></Svg>
);

export const SearchIcon = (props) => (
  <Svg {...props}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></Svg>
);

export const UpdatesIcon = (props) => (
  <Svg {...props}><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z" /><path d="M10 20.5a2.2 2.2 0 0 0 4 0" /></Svg>
);

export const YouIcon = (props) => (
  <Svg {...props}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="10" r="3" /><path d="M6.6 18.2c1.2-2.2 3.1-3.3 5.4-3.3s4.2 1.1 5.4 3.3" /></Svg>
);

export const BackIcon = (props) => (
  <Svg {...props}><path d="M14.5 5.5 8 12l6.5 6.5" /></Svg>
);

export const SunIcon = (props) => (
  <Svg {...props}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" /></Svg>
);

export const MoonIcon = (props) => (
  <Svg {...props}><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z" /></Svg>
);

export const BookmarkIcon = ({ filled, ...props }) => (
  <Svg {...props}><path d="M7 4.5h10v15l-5-3.5-5 3.5z" fill={filled ? 'currentColor' : 'none'} /></Svg>
);

export const ArrowIcon = (props) => (
  <Svg {...props}><path d="M7 17 17 7M9 7h8v8" /></Svg>
);

export const CompareIcon = (props) => (
  <Svg {...props}><path d="M8 4v16M16 4v16M4 8h4M16 16h4" /></Svg>
);

export const CloseIcon = (props) => (
  <Svg {...props}><path d="m7 7 10 10M17 7 7 17" /></Svg>
);
