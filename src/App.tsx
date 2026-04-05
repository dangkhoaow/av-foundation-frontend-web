import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const routerBase = baseUrl.endsWith('/') && baseUrl !== '/' ? baseUrl.slice(0, -1) : baseUrl;

  console.info('[Router] Configured router base', {
    baseUrl,
    routerBase,
  });

  return (
    <BrowserRouter basename={routerBase}>
      <AppRoutes />
    </BrowserRouter>
  );
}
