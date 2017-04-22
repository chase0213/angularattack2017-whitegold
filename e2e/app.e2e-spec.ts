import { Angularattack2017Page } from './app.po';

describe('angularattack2017 App', () => {
  let page: Angularattack2017Page;

  beforeEach(() => {
    page = new Angularattack2017Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
