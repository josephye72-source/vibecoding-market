export type AppShellOptions = {
  content: string;
  currentPath: string;
};

export function renderAppShell({ content, currentPath }: AppShellOptions): string {
  const isHome = currentPath === "/";

  return `
    <a class="skip-link" href="#main-content">跳到主要内容</a>
    <header class="site-header">
      <a class="site-header__brand" href="#/" translate="no">Vibe Coding Market</a>
      <nav aria-label="Primary navigation">
        <a href="#/" aria-current="${isHome ? "page" : "false"}">首页</a>
        <a href="#projects">5 个项目</a>
        <a href="#path">新手路径</a>
        <a href="#feedback">反馈</a>
      </nav>
    </header>
    <main id="main-content" tabindex="-1">
      ${content}
    </main>
  `;
}
