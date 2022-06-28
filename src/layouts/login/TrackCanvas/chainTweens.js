export default function chainTweens(tweens = []) {
  const [first, ...other] = tweens;

  const last = other.reduce((t1, t2) => {
    t1.chain(t2);
    return t2;
  }, first);

  const run = (onComplete) => {
    if (last && onComplete) {
      last.onComplete(onComplete);
    }
    return first && first.start();
  };

  return run;
}
