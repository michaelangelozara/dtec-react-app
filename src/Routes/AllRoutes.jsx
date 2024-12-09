import { adminRoutes } from './AdminRoute';
import { userRoutes } from './UserRoute';
import { oicRoutes } from './OICRoute';
import { authRoutes } from './AuthRoute';

export const routes = [...adminRoutes, ...userRoutes, ...oicRoutes, ...authRoutes];