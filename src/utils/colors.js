const info = (msg) => {
  // Make text blue and bold, so it *pops*
  return `\u001b[1m\u001b[34m${msg}\u001b[39m\u001b[22m`;
};

const error = (msg) => {
  // Make text red and bold, so it *pops*
  return `\u001b[1m\u001b[31m${msg}\u001b[39m\u001b[22m`;
};

export { info, error };
