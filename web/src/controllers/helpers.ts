export function formatNumber(number: number) {
    if (number >= 1000000000000000) {
      return (number / 1000000000000000).toFixed(1).replace(/\.0$/, '') + 'q';
    }
    if (number >= 1000000000000) {
      return (number / 1000000000000).toFixed(1).replace(/\.0$/, '') + 't';
    }
    if (number >= 1000000000) {
      return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'b';
    }
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (number >= 1000) {
      return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return number.toString();
  }
  