import React from 'react';
import {
  fireEvent, render, screen, waitFor, within
} from '@testing-library/react';
import HowIllDeliver from './index';

// "scaled" is the two-column layout for desktops and landscape tablets, "stacked" the single column.
const mockLayout = (layout) => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: layout === 'scaled',
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  }));
};

const open = (annotation, layout = 'scaled') => {
  mockLayout(layout);
  render(<HowIllDeliver />);
  const trigger = screen.getByRole('button', { name: annotation });
  fireEvent.click(trigger);
  return trigger;
};

beforeEach(() => {
  mockLayout('stacked');
});

afterEach(() => {
  jest.restoreAllMocks();
  delete global.fetch;
});

describe('every sheet', () => {
  test('"open to work" keeps the original single sheet and its accent color', () => {
    render(<HowIllDeliver />);
    const trigger = screen.getByRole('button', { name: '(open to work)' });
    trigger.style.setProperty('--annotation-border-color', '#ff0000');
    fireEvent.click(trigger);

    expect(screen.getByRole('dialog', { name: 'Open to work' })).toHaveStyle('--sheet-accent-color: #ff0000');
    expect(document.querySelector('[class*="sheetBackdropLight"]')).not.toBeInTheDocument();
  });

  test.each([
    ['(freelance/contract)', 'Freelance / contract'],
    ['(hiring manager)', 'Hiring managers']
  ])('%s opens a two-column sheet named after it, over the light backdrop', (annotation, title) => {
    open(annotation);

    expect(screen.getByRole('dialog', { name: title })).toBeInTheDocument();
    expect(document.querySelector('[class*="sheetBackdropLight"]')).toBeInTheDocument();
  });

  test.each([
    ['(open to work)'],
    ['(freelance/contract)'],
    ['(hiring manager)']
  ])('%s closes with Escape and returns focus to its button', (annotation) => {
    const trigger = open(annotation);
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  test('closes with the close button, which has focus when the sheet opens', () => {
    open('(hiring manager)');
    const close = screen.getByRole('button', { name: 'Close sheet' });

    expect(close).toHaveFocus();
    fireEvent.click(close);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('closes when the backdrop is clicked, but not when the sheet is', () => {
    open('(freelance/contract)');

    fireEvent.mouseDown(screen.getByRole('heading', { name: 'Why work with me' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.mouseDown(document.querySelector('[class*="sheetBackdrop"]'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('uses the scaled layout on desktop and the stacked layout on phones', () => {
    open('(hiring manager)', 'scaled');
    expect(screen.getByRole('dialog')).toHaveAttribute('data-layout', 'scaled');
  });

  test('uses the stacked layout when scaling would not fit', () => {
    open('(hiring manager)', 'stacked');
    expect(screen.getByRole('dialog')).toHaveAttribute('data-layout', 'stacked');
  });

  test('Tab stays inside the sheet, including form fields', () => {
    open('(freelance/contract)', 'stacked');
    const lastLink = screen.getAllByRole('link').pop();

    lastLink.focus();
    fireEvent.keyDown(document, { key: 'Tab' });

    expect(screen.getByRole('button', { name: 'Close sheet' })).toHaveFocus();
  });
});

describe('hiring manager sheet', () => {
  test('shows the first role, the resume and that role\'s lists', () => {
    open('(hiring manager)');

    expect(screen.getByRole('button', { name: 'Interaction' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('tab', { name: 'File: Resume' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { name: 'Motheo' })).toBeInTheDocument();

    const lists = within(screen.getByRole('group', { name: /Tools, skills and languages/ }));
    expect(lists.getByText('Figma')).toBeInTheDocument();
    expect(lists.getByText('Wireframing')).toBeInTheDocument();
  });

  test('choosing a role changes the resume and the lists', () => {
    open('(hiring manager)');
    expect(screen.getByText(/My work sits across the design and development process/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Frontend Development' }));

    expect(screen.getByRole('button', { name: 'Frontend Development' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Interaction' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText(/I build the screen: responsive, accessible interfaces/)).toBeInTheDocument();
    expect(screen.queryByText(/My work sits across the design and development process/)).not.toBeInTheDocument();

    const lists = within(screen.getByRole('group', { name: /Tools, skills and languages/ }));
    expect(lists.queryByText('Figma')).not.toBeInTheDocument();
    expect(lists.getByText('Azure Cloud')).toBeInTheDocument();
  });

  test('the cover letter tab swaps the file and follows the chosen role', () => {
    open('(hiring manager)');
    fireEvent.click(screen.getByRole('tab', { name: 'File: Cover letter' }));

    expect(screen.getByRole('tab', { name: 'File: Cover letter' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { name: 'Cover letter' })).toBeInTheDocument();
    expect(screen.getByText('For interaction and UX roles')).toBeInTheDocument();
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', screen.getByRole('tab', { name: 'File: Cover letter' }).id);

    fireEvent.click(screen.getByRole('button', { name: 'Frontend Development' }));
    expect(screen.getByText('For frontend development roles')).toBeInTheDocument();
  });

  test('arrow keys move between the file tabs', () => {
    open('(hiring manager)');
    const resume = screen.getByRole('tab', { name: 'File: Resume' });

    resume.focus();
    fireEvent.keyDown(resume, { key: 'ArrowRight' });

    expect(screen.getByRole('tab', { name: 'File: Cover letter' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'File: Cover letter' })).toHaveFocus();
    expect(resume).toHaveAttribute('tabindex', '-1');
  });

  test('choosing a scenario swaps the sentence', () => {
    open('(hiring manager)');
    fireEvent.click(screen.getByRole('button', { name: 'Marketing team' }));

    expect(screen.getByRole('button', { name: 'Marketing team' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/campaign ideas into on-brand pages/)).toBeInTheDocument();
    expect(screen.queryByText(/prototype in code early/)).not.toBeInTheDocument();
  });

  test('"Online" is the two profile cards, each one link, with no call to action', () => {
    open('(hiring manager)');
    const online = within(screen.getByRole('region', { name: 'Online' }));

    expect(online.getByRole('link', { name: /GitHub profile/ })).toHaveAttribute('href', 'https://github.com/king-maverickk');
    expect(online.getByRole('link', { name: /LinkedIn profile/ })).toHaveAttribute('href', 'https://www.linkedin.com/in/motheo-m-moleko/');
    expect(online.getByRole('link', { name: /LinkedIn profile/ })).toHaveAttribute('target', '_blank');
    expect(online.getByRole('link', { name: /LinkedIn profile/ })).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(online.getAllByRole('link')).toHaveLength(2);
    expect(online.getByText('Open to Work').closest('a')).toBe(online.getByRole('link', { name: /LinkedIn profile/ }));
    expect(screen.queryByRole('button', { name: 'Start a project' })).not.toBeInTheDocument();
  });

  describe('the resume in the scaled layout', () => {
    // jsdom has no layout, so pretend the preview is taller than the paper it sits in.
    const overflow = (scrollHeight, clientHeight) => {
      jest.spyOn(Element.prototype, 'scrollHeight', 'get').mockImplementation(function scroll() {
        return String(this.className).includes('preview') ? scrollHeight : 0;
      });
      jest.spyOn(Element.prototype, 'clientHeight', 'get').mockImplementation(function client() {
        return String(this.className).includes('preview') ? clientHeight : 0;
      });
    };

    test('opens the full resume when it is taller than the paper, and Esc closes only that view', async () => {
      overflow(900, 500);
      open('(hiring manager)');

      const expand = await screen.findByRole('button', { name: 'View full resume' });
      fireEvent.click(expand);

      const view = screen.getByRole('dialog', { name: 'resume, full view' });
      expect(within(view).getByRole('heading', { name: 'Motheo' })).toBeInTheDocument();
      expect(within(view).getByRole('button', { name: 'Close resume' })).toHaveFocus();

      fireEvent.keyDown(window, { key: 'Escape' });

      await waitFor(() => expect(screen.queryByRole('dialog', { name: 'resume, full view' })).not.toBeInTheDocument());
      expect(screen.getByRole('dialog', { name: 'Hiring managers' })).toBeInTheDocument();
      await waitFor(() => expect(expand).toHaveFocus());
    });

    test('the close button and a click outside the page both close the full view', async () => {
      overflow(900, 500);
      open('(hiring manager)');

      fireEvent.click(await screen.findByRole('button', { name: 'View full resume' }));
      fireEvent.click(screen.getByRole('button', { name: 'Close resume' }));
      expect(screen.queryByRole('dialog', { name: 'resume, full view' })).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'View full resume' }));
      fireEvent.mouseDown(screen.getByRole('dialog', { name: 'resume, full view' }));
      expect(screen.queryByRole('dialog', { name: 'resume, full view' })).not.toBeInTheDocument();
      expect(screen.getByRole('dialog', { name: 'Hiring managers' })).toBeInTheDocument();
    });

    test('a document that already fits has no button', () => {
      overflow(400, 500);
      open('(hiring manager)');

      expect(screen.queryByRole('button', { name: /View full/ })).not.toBeInTheDocument();
    });

    test('switching files closes the full view', async () => {
      overflow(900, 500);
      open('(hiring manager)');
      fireEvent.click(await screen.findByRole('button', { name: 'View full resume' }));

      fireEvent.click(screen.getByRole('tab', { name: 'File: Cover letter' }));

      expect(screen.queryByRole('dialog', { name: 'resume, full view' })).not.toBeInTheDocument();
    });
  });

  test('the stacked layout shows the whole resume with no button to open it', () => {
    open('(hiring manager)', 'stacked');

    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /View full/ })).not.toBeInTheDocument();
  });
});

describe('freelance sheet', () => {
  test('shows the workflow tree first, with the 6-7 week timeline', () => {
    open('(freelance/contract)');

    expect(screen.getByRole('tab', { name: 'File: Workflow' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { name: 'Project Plan' })).toBeInTheDocument();
    expect(screen.getByText('Typical project: about 6-7 weeks')).toBeInTheDocument();
    expect(screen.getByText(/about 6-7 weeks for a typical site/)).toBeInTheDocument();
  });

  test('the tabs switch between workflow, deliverables and the form', () => {
    open('(freelance/contract)');

    fireEvent.click(screen.getByRole('tab', { name: 'File: What you get' }));
    expect(screen.getByRole('heading', { name: 'What you get' })).toBeInTheDocument();
    expect(screen.getByText('CA$800')).toBeInTheDocument();
    expect(screen.getByText('CA$2,600')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'File: Start a project' }));
    expect(screen.getByRole('textbox', { name: 'Hi! My name is' })).toBeInTheDocument();
  });

  test('the chips only change the scenario sentence', () => {
    open('(freelance/contract)');
    fireEvent.click(screen.getByRole('button', { name: 'Brand designers' }));

    expect(screen.getByRole('button', { name: 'Brand designers' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/I build your designs as drawn/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Project Plan' })).toBeInTheDocument();
  });

  test('"Start a project" opens the form and puts the cursor in the name field', async () => {
    open('(freelance/contract)');
    fireEvent.click(screen.getByRole('button', { name: 'Start a project' }));

    expect(screen.getByRole('tab', { name: 'File: Start a project' })).toHaveAttribute('aria-selected', 'true');
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Hi! My name is' })).toHaveFocus());
  });

  test('the stacked layout shows every file in turn, with no tabs', () => {
    open('(freelance/contract)', 'stacked');

    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Project Plan' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What you get' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Hi! My name is' })).toBeInTheDocument();
  });

  describe('the project form', () => {
    const type = (name, value) => fireEvent.change(screen.getByRole('textbox', { name }), { target: { value } });

    const fill = async () => {
      open('(freelance/contract)', 'stacked');
      type('Hi! My name is', 'Alex Rivera');
      type('and you can reach me at', 'alex@example.com');
      fireEvent.click(screen.getByRole('radio', { name: 'Redesign' }));
      type('My current site is', 'alex.example.com');
      type(/I’d like to share more/, 'A new gallery site');
    };

    test('promises a reply within 24 hours and starts on "Portfolio site"', () => {
      open('(freelance/contract)', 'stacked');

      expect(screen.getByText('Tell me a little about it. I reply within 24 hours.')).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Portfolio site' })).toBeChecked();
    });

    test('posts what was typed to /api/contact and then says thanks', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true });
      await fill();
      fireEvent.click(screen.getByRole('button', { name: 'Send' }));

      await screen.findByText('Thank you, I have your message.');
      expect(global.fetch).toHaveBeenCalledTimes(1);

      const [url, options] = global.fetch.mock.calls[0];
      expect(url).toBe('/api/contact');
      expect(options.method).toBe('POST');
      expect(JSON.parse(options.body)).toEqual({
        name: 'Alex Rivera',
        email: 'alex@example.com',
        kind: 'redesign',
        currentSite: 'alex.example.com',
        message: 'A new gallery site',
        company: ''
      });
    });

    test('shows an error and keeps what was typed when sending fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
      await fill();
      fireEvent.click(screen.getByRole('button', { name: 'Send' }));

      expect(await screen.findByRole('alert')).toHaveTextContent('That did not send');
      expect(screen.getByRole('textbox', { name: 'Hi! My name is' })).toHaveValue('Alex Rivera');
      expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
    });

    test('shows an error when the network is down', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('offline'));
      await fill();
      fireEvent.click(screen.getByRole('button', { name: 'Send' }));

      expect(await screen.findByRole('alert')).toBeInTheDocument();
    });

    test('name and email are required', () => {
      open('(freelance/contract)', 'stacked');

      expect(screen.getByRole('textbox', { name: 'Hi! My name is' })).toBeRequired();
      expect(screen.getByRole('textbox', { name: 'and you can reach me at' })).toBeRequired();
      expect(screen.getByRole('textbox', { name: 'My current site is' })).not.toBeRequired();
    });
  });
});
