export const waitAsync = async <T extends () => any>(
  conditionCallback: () => boolean,
  callback: T,
  intervalMillSecond = 100
): Promise<ReturnType<T>> => {
  if (conditionCallback()) {
    return callback();
  }

  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      if (!conditionCallback()) {
        return;
      }
      clearInterval(intervalId);
      resolve(callback());
    }, intervalMillSecond);
  });
};
