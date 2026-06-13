import { dictionaries } from "../i18n/dictionaries";
import { nextLocale, type Locale } from "../i18n/state";

export type AppShellOptions = {
  content: string;
  currentPath: string;
  locale: Locale;
};

export function renderAppShell({ content, currentPath, locale }: AppShellOptions): string {
  const isHome = currentPath === "/";
  const copy = dictionaries[locale];
  const targetLocale = nextLocale(locale);

  return `
    <a class="skip-link" href="#main-content">${copy.shell.skip}</a>
    <header class="site-header">
      <a class="site-header__brand" href="#/" translate="no">Vibe Coding Market</a>
      <nav aria-label="${copy.shell.navLabel}">
        <a href="#/" aria-current="${isHome ? "page" : "false"}">${copy.shell.nav.home}</a>
        <a href="#projects">${copy.shell.nav.projects}</a>
        <a href="#path">${copy.shell.nav.path}</a>
        <a href="#feedback">${copy.shell.nav.feedback}</a>
      </nav>
      <button class="language-toggle" type="button" data-locale-toggle="${targetLocale}">
        ${copy.shell.languageToggle}
      </button>
    </header>
    <main id="main-content" tabindex="-1">
      ${content}
    </main>
  `;
}
