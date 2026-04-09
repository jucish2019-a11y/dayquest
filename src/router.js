// DayQuest - Hash-based router
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = 'home';
    this.onNavigate = null;

    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('DOMContentLoaded', () => this.handleRoute());
  }

  register(route, handler) {
    this.routes[route] = handler;
  }

  navigate(route) {
    window.location.hash = route;
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    this.currentRoute = hash;

    if (this.routes[hash]) {
      this.routes[hash]();
    } else if (this.routes['home']) {
      this.routes['home']();
    }

    if (this.onNavigate) {
      this.onNavigate(hash);
    }
  }

  // Update active nav link
  updateActiveNav() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-route') === this.currentRoute);
    });
  }
}

export const router = new Router();
export default router;
