import { PylonpanelPage } from './app.po';

describe('pylonpanel App', function() {
  let page: PylonpanelPage;

  beforeEach(() => {
    page = new PylonpanelPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
