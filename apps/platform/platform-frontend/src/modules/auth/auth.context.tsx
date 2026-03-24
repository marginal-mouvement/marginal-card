import type { SimpleUser } from "@marginal-card/platform-sdk";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { KeyStore } from "@/modules/key/key.store.ts";
import { platformSDK } from "@/modules/platform/platformSDK.ts";

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: SimpleUser;
  setKeyId: (keyId: string | undefined) => void;
  eraseKeyId: () => void;
  refreshAuth: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue>(null!);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<SimpleUser | undefined>(undefined);
  const [keyId, setKeyId] = useState<string | undefined>(KeyStore.load());
  const [refreshCount, setRefreshCount] = useState(0);

  const eraseKeyId = useCallback(() => {
    setKeyId(undefined);
    KeyStore.erase();
  }, []);

  const _setKeyId = useCallback((keyId: string | undefined) => {
    setKeyId(keyId);
    if (keyId) {
      KeyStore.save(keyId);
      platformSDK.setKeyId(keyId);
    }
  }, []);

  const refreshAuth = useCallback(() => {
    setRefreshCount((count) => count + 1);
  }, []);

  useEffect(() => {
    if (!keyId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
      setUser(undefined);
      setIsAuthenticated(false);
      return;
    }

    setIsLoading(true);
    setUser(undefined);
    setIsAuthenticated(false);

    async function authenticate() {
      if (!keyId) return;
      const user = await platformSDK.user.me();
      setUser(user);
      setIsAuthenticated(true);
      setIsLoading(false);
    }

    authenticate().catch(() => {
      setIsLoading(false);
      eraseKeyId();
    });
  }, [eraseKeyId, keyId, refreshCount]);

  const value = useMemo(
    () => ({
      isLoading,
      isAuthenticated,
      user,
      setKeyId: _setKeyId,
      eraseKeyId,
      refreshAuth,
    }),
    [isLoading, isAuthenticated, user, _setKeyId, eraseKeyId, refreshAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
