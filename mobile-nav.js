const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

function setMenuOpen(isOpen) {
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    sidebar.classList.toggle('is-open', isOpen);
    sidebarOverlay.classList.toggle('is-visible', isOpen);
    document.body.classList.toggle('menu-is-open', isOpen);
}

menuToggle.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

sidebarOverlay.addEventListener('click', () => setMenuOpen(false));
sidebarLinks.forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
});
