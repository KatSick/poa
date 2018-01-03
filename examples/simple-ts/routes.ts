// pages
import { RootPage } from './pages/root.page';
import { UsersPage } from './pages/users.page';
import { AboutPage } from './pages/about.page';

export const routes = [
  { path: '', component: RootPage },
  { path: '/users', component: UsersPage },
  { path: '/about', component: AboutPage }
];