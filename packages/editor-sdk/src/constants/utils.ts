// runtime /utils/EvalUtils.ts
export default {
  '!name': 'runtimescript',
  Utils: {
    '!type': 'fn()',
    url: {
      '!type': 'fn()',
      hash: {
        '!doc':
          "The hash property of the URL interface is a string containing a '#' followed by the fragment identifier of the URL.",
      },
      host: {
        '!doc': `The host property of the URL interface is a string containing the host, that is the hostname, and then, if the port of the URL is nonempty, a ':', followed by the port of the URL.`,
      },
      hostname: {
        '!doc': `The hostname property of the URL interface is a string containing the domain name of the URL.`,
      },
      href: {
        '!doc':
          'The href property of the URL interface is a string containing the whole URL.',
      },
      origin: {
        '!doc':
          'The origin read-only property of the URL interface returns a string containing the Unicode serialization of the origin of the represented URL.',
      },
      password: {
        '!doc':
          'The password property of the URL interface is a string containing the password specified before the domain name.',
      },
      pathname: {
        '!doc': `The pathname property of the URL interface represents a location in a hierarchical structure. It is a string constructed from a list of path segments, each of which is prefixed by a / character. If the URL has no path segments, the value of its pathname property will be the empty string.`,
      },
      port: {
        '!doc':
          'The port property of the URL interface is a string containing the port number of the URL.',
      },
      protocol: {
        '!doc': `The protocol property of the URL interface is a string representing the protocol scheme of the URL, including the final ':'.`,
      },
      search: {
        '!doc': `The search property of the URL interface is a search string, also called a query string, that is a string containing a '?' followed by the parameters of the URL.`,
      },
      searchParams: {
        '!doc': `The searchParams readonly property of the URL interface returns a URLSearchParams object allowing access to the GET decoded query arguments contained in the URL.`,
      },
      username: {
        '!doc': `The username property of the URL interface is a string containing the username specified before the domain name.`,
      },
      '!url': 'https://developer.mozilla.org/en-US/docs/Web/API/URL/URL',
      '!doc':
        'The URL(location.href) constructor returns a newly created URL object representing the URL defined by the parameters.',
    },
    '!doc': 'Creates an utils wrapper.',
  },
};
