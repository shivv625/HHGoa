export function buildTweetUrl(shareUrl: string) {
  const text = encodeURIComponent('Just made my HH Goa 2026 frame 🌴☀️ #FrameInGoa');
  return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`;
}
