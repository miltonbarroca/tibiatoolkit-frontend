(() => {
  'use strict';

  // ── On-this-page TOC (direita) ─────────────────────────────────────────────
  function buildToc() {
    const tocList = document.querySelector('#docs-toc ul');
    const content = document.querySelector('.docs-content');
    if (!tocList || !content) return [];

    const items = [];
    const sections = content.querySelectorAll('.section');
    sections.forEach((sec) => {
      const id = sec.id;
      const h2 = sec.querySelector('.section-header h2');
      if (!id || !h2) return;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${id}`;
      a.textContent = h2.textContent.trim();
      a.dataset.target = id;
      li.appendChild(a);
      tocList.appendChild(li);
      items.push({ id, el: a });

      // sub-headings (h3 dentro de .subsection)
      sec.querySelectorAll('.subsection').forEach((sub, idx) => {
        const h3 = sub.querySelector('h3');
        if (!h3) return;
        let subId = sub.id;
        if (!subId) {
          subId = `${id}-sub-${idx}`;
          sub.id = subId;
        }
        const subLi = document.createElement('li');
        const subA = document.createElement('a');
        subA.href = `#${subId}`;
        subA.textContent = h3.textContent.trim();
        subA.dataset.target = subId;
        subA.classList.add('toc-sub');
        subLi.appendChild(subA);
        tocList.appendChild(subLi);
        items.push({ id: subId, el: subA });
      });
    });
    return items;
  }

  // ── Scroll-spy: destaca seção atual na sidebar + TOC ──────────────────────
  function setupScrollSpy(tocItems) {
    const sidebarLinks = Array.from(document.querySelectorAll('.sidebar-nav a[data-target]'));
    const sectionEls = Array.from(document.querySelectorAll('.section[id], .subsection[id]'));
    if (!sectionEls.length) return;

    const idToLinks = new Map(); // id -> [link, link...]
    sectionEls.forEach((el) => {
      const links = [];
      const sidebar = sidebarLinks.find((a) => a.dataset.target === el.id);
      if (sidebar) links.push(sidebar);
      const tocItem = tocItems.find((i) => i.id === el.id);
      if (tocItem) links.push(tocItem.el);
      idToLinks.set(el.id, links);
    });

    const visible = new Map(); // id -> intersectionRatio

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        });

        // pega o ID com maior ratio visível
        let active = null;
        let best = 0;
        visible.forEach((ratio, id) => {
          if (ratio > best) { best = ratio; active = id; }
        });

        // se nenhum visível, mantém o mais próximo ao topo
        idToLinks.forEach((links) => {
          links.forEach((l) => l.classList.remove('active'));
        });
        if (active && idToLinks.has(active)) {
          // marca a seção pai (sec-xxx) também
          const links = idToLinks.get(active);
          links.forEach((l) => l.classList.add('active'));

          // se for um subsection, marca também a sidebar da seção pai
          const parentSec = document.getElementById(active)?.closest('.section');
          if (parentSec && parentSec.id !== active) {
            const parentLinks = idToLinks.get(parentSec.id) || [];
            parentLinks.forEach((l) => {
              if (l.closest('.sidebar-nav')) l.classList.add('active');
            });
          }
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: [0, 0.1, 0.5, 1.0],
      }
    );

    sectionEls.forEach((el) => observer.observe(el));
  }

  // ── Tabs ──────────────────────────────────────────────────────────────────
  function setupTabs() {
    document.querySelectorAll('[data-tabs]').forEach((container) => {
      const buttons = container.querySelectorAll('.tab-button');
      const panels = container.querySelectorAll('.tab-panel');

      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const name = btn.dataset.tab;
          buttons.forEach((b) => b.classList.toggle('active', b === btn));
          panels.forEach((p) => p.classList.toggle('active', p.dataset.panel === name));
        });
      });
    });
  }

  // ── Copy button em <pre><code> dentro de .code-block ──────────────────────
  function setupCopyButtons() {
    document.querySelectorAll('.code-block').forEach((block) => {
      if (block.querySelector('.code-block-copy')) return; // já tem
      const code = block.querySelector('pre code');
      if (!code) return;

      // garante um header
      let header = block.querySelector('.code-block-header');
      if (!header) {
        header = document.createElement('div');
        header.className = 'code-block-header';
        const lang = document.createElement('span');
        lang.className = 'code-block-lang';
        lang.textContent = block.dataset.lang || code.className.replace('language-', '') || 'shell';
        header.appendChild(lang);
        block.insertBefore(header, block.firstChild);
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-block-copy';
      btn.textContent = 'Copiar';
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.textContent);
          btn.textContent = 'Copiado!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Copiar';
            btn.classList.remove('copied');
          }, 1600);
        } catch {
          btn.textContent = 'Erro';
          setTimeout(() => { btn.textContent = 'Copiar'; }, 1600);
        }
      });
      header.appendChild(btn);
    });
  }

  // ── Busca client-side: filtra sidebar nav ─────────────────────────────────
  function setupSearch() {
    const input = document.getElementById('docs-search');
    const nav = document.getElementById('docs-sidebar-nav');
    if (!input || !nav) return;

    // index { linkEl: textNormalizado } — texto = título da seção + todo conteúdo dela
    const index = new Map();
    nav.querySelectorAll('a[data-target]').forEach((link) => {
      const id = link.dataset.target;
      const sec = document.getElementById(id);
      const haystack = [
        link.textContent,
        sec ? sec.textContent : '',
      ].join(' ').toLowerCase();
      index.set(link, haystack);
    });

    function normalize(s) {
      return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    }

    let emptyMsg = null;

    input.addEventListener('input', () => {
      const raw = input.value.trim();
      const query = normalize(raw);
      if (!query) {
        index.forEach((_, link) => link.classList.remove('search-hidden'));
        if (emptyMsg) { emptyMsg.remove(); emptyMsg = null; }
        return;
      }

      let visibleCount = 0;
      index.forEach((haystack, link) => {
        const hit = normalize(haystack).includes(query);
        link.classList.toggle('search-hidden', !hit);
        if (hit) visibleCount++;
      });

      if (visibleCount === 0) {
        if (!emptyMsg) {
          emptyMsg = document.createElement('div');
          emptyMsg.className = 'search-empty';
          emptyMsg.textContent = 'Nenhum resultado encontrado';
          nav.appendChild(emptyMsg);
        }
      } else if (emptyMsg) {
        emptyMsg.remove();
        emptyMsg = null;
      }
    });

    // Esc limpa
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        input.blur();
      }
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const tocItems = buildToc();
    setupScrollSpy(tocItems);
    setupTabs();
    setupCopyButtons();
    setupSearch();
  });
})();
