import { useContext } from 'react';
import { UserContext } from './contexts/UserContext';

export default function useFetchWithAuthorization() {
  const context = useContext(UserContext);
  return async (uri, options = {}) => {
    let { headers } = options;

    if (context.tokenInContext) {
      headers = {
        ...headers,
        Authorization: `Bearer ${context.tokenInContext}`,
      };
    }

    return fetch(uri, {
      ...options,
      headers,
    });
  };
}
