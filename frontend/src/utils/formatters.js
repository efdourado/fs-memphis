export const formatTotalDuration = (totalSeconds) => {
  if (totalSeconds < 60) {
    return 'less than a minute';
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const parts = [];

  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} min`);
  }
  
  return parts.length > 0 ? `about ${parts.join(' ')}` : 'less than a minute';
};