import {BrowserHelper} from './browser-helper';

describe('BrowserHelper', () => {
  const ie11UserAgents = [
    'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko',
    'Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko'
  ];

  const ie10UserAgents = [
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 7.0; InfoPath.3; .NET CLR 3.1.40767; Trident/6.0; en-IN)',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/5.0)',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/4.0; InfoPath.2; SV1; .NET CLR 2.0.50727; WOW64)',
    'Mozilla/5.0 (compatible; MSIE 10.0; Macintosh; Intel Mac OS X 10_7_3; Trident/6.0)',
    'Mozilla/4.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/5.0)',
    'Mozilla/1.22 (compatible; MSIE 10.0; Windows 3.1)'
  ];

  const ie7UserAgents = [
    'Mozilla/5.0 (Windows; U; MSIE 7.0; Windows NT 6.0; en-US)',
    'Mozilla/5.0 (Windows; U; MSIE 7.0; Windows NT 6.0; el-GR)'
  ];

  const chromeUserAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36'
  ];

  function checkAgents(userAgents: string[], expectedBrowserVersion): void {
    userAgents.forEach(userAgent => {
      window.navigator['__defineGetter__']('userAgent', () => {
        return userAgent;
      });
      expect(BrowserHelper.getIEVersion()).toBe(expectedBrowserVersion);
    });
  }

  it('should successfully create browser helper', () => {
    const browserHelper = new BrowserHelper();
    expect(browserHelper).toBeTruthy();
  });

  describe('Testing IE version', () => {
    it('should return 11 for IE11 user agents', () => {
      checkAgents(ie11UserAgents, 11);
      expect(BrowserHelper.isIE()).toBeTruthy();
    });

    it('should return 10 for IE10 user agents', () => {
      checkAgents(ie10UserAgents, 10);
      expect(BrowserHelper.isIE()).toBeTruthy();
    });

    it('should return 7 for IE7 user agents', () => {
      checkAgents(ie7UserAgents, 7);
      expect(BrowserHelper.isIE()).toBeTruthy();
    });

    it('should return 0 for Chrome user agents', () => {
      checkAgents(chromeUserAgents, 0);
      expect(BrowserHelper.isIE()).toBeFalsy();
    });
  });
});
