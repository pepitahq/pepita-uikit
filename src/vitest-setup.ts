import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement the Web Animations API that Svelte's JS transitions
// (fly/slide/…) drive via element.animate(). Stub it so transition-using
// components can be tested; the returned animation reports itself finished.
if (typeof Element !== 'undefined' && !Element.prototype.animate) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Element.prototype.animate = function (): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anim: any = {
      onfinish: null,
      oncancel: null,
      currentTime: 0,
      startTime: 0,
      playbackRate: 1,
      playState: 'finished',
      pending: false,
      finished: Promise.resolve(),
      ready: Promise.resolve(),
      effect: null,
      cancel() {
        this.oncancel?.({});
      },
      finish() {},
      play() {},
      pause() {},
      reverse() {},
      updatePlaybackRate() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false;
      }
    };
    // Svelte's outro completes when the animation finishes; fire it next tick
    // (onfinish is assigned by Svelte right after animate() returns).
    setTimeout(() => anim.onfinish?.({ target: anim }), 0);
    return anim;
  };
}
