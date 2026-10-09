import { useCallback, useEffect, useState } from 'react';
import { errorMessage } from './api';

// Loads one resource and keeps loading and error states next to it.
export function useResource(load, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });

  const run = useCallback(() => {
    let active = true;
    setState((previous) => ({ ...previous, loading: true, error: '' }));
    load()
      .then((result) => active && setState({ data: result, loading: false, error: '' }))
      .catch((error) => active && setState({
        data: null,
        loading: false,
        error: errorMessage(error),
        status: error?.response?.status,
      }));
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(run, [run]);

  return { ...state, reload: run, setData: (data) => setState((s) => ({ ...s, data })) };
}

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Memphis` : 'Memphis';
  }, [title]);
}

export const formatDate = (value) => {
  if (!value) return '';
  const text = String(value);
  if (/^\d{4}$/.test(text)) return text;
  if (/^\d{4}-\d{2}$/.test(text)) {
    const [year, month] = text.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  }
  // Catalog dates are calendar days stored at UTC midnight; reading them in
  // local time would move them a day back west of Greenwich.
  const isCalendarDay = text.length === 10 || text.endsWith('T00:00:00.000Z');
  const date = new Date(text.length === 10 ? `${text}T00:00:00Z` : text);
  return date.toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: isCalendarDay ? 'UTC' : undefined });
};

export const yearOf = (value) => String(value || '').slice(0, 4);
