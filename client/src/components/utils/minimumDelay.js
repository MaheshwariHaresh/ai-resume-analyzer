const minimumDelay = async (promise, minimumTime = 1000) => {
  const startTime = Date.now();

  const result = await promise;

  const elapsedTime = Date.now() - startTime;
  const remainingTime = minimumTime - elapsedTime;

  if (remainingTime > 0) {
    await new Promise((resolve) => {
      setTimeout(resolve, remainingTime);
    });
  }

  return result;
};

export default minimumDelay;
