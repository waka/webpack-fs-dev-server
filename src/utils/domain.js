import url from 'url';
import ip from'internal-ip';

const createDomain = (options, server) => {
  const protocol = options.https ? 'https' : 'http';
  const hostname = options.useLocalIp
    ? ip.v4.sync() || 'localhost'
    : options.host || 'localhost';

  // eslint-disable-next-line no-nested-ternary
  const port = server ? server.address().port : 0;

  // the formatted domain (url without path) of the webpack server
  return url.format({ protocol, hostname, port });
};

export { createDomain };
