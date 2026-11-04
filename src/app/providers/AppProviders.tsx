import { CRMProvider } from '../../shared/services';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * AppProviders - Centralized application provider stack
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return <CRMProvider>{children}</CRMProvider>;
};
