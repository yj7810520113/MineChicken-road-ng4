import { MineChickenNg4Page } from './app.po';

describe('mine-chicken-ng4 App', () => {
  let page: MineChickenNg4Page;

  beforeEach(() => {
    page = new MineChickenNg4Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
