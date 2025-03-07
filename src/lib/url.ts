export let ensureUrl = (url: string) => {
  if (url.startsWith('http://')) {
    url = url.replace('http://', 'ws://');
  } else if (url.startsWith('https://')) {
    url = url.replace('https://', 'wss://');
  } else if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
    url = `ws://${url}`;
  }

  try {
    let u = new URL(url);
    if (u.protocol == 'ws:' || u.protocol == 'wss:') return u.toString();

    u.protocol = 'ws:';

    return u.toString();
  } catch (e) {
    if (url.startsWith('ws://') || url.startsWith('wss://')) return url;

    try {
      let u = new URL(`ws://${url}`);
      return u.toString();
    } catch (e) {
      return null;
    }
  }
};
