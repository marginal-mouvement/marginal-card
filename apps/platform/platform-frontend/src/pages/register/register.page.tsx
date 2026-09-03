import { useNavigate, useParams } from "react-router";
import { use, useEffect, useState } from "react";

import { AuthContext } from "../../modules/auth/auth.context.tsx";
import { platformSDK } from "../../modules/platform/platformSDK.ts";
import { FullPageSpinner } from "../fullPageSpinner.tsx";
import { Content } from "../../parts/content.tsx";

export const RegisterPage = () => {
  const { login } = use(AuthContext);
  const { keyId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchKeyStatus() {
      if (!keyId) {
        navigate("/");
        return;
      }

      const isAvailable = await platformSDK.key.isAvailable(keyId);

      if (!isAvailable) {
        login(keyId).catch(console.error);
        return;
      }

      setIsLoading(false);
    }

    fetchKeyStatus().catch(() => {
      navigate("/");
    });
  }, [keyId, login, navigate]);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <Content>
      <div className="flex flex-col justify-center h-svh">
        {/*<RegisterForm keyId={keyId} />*/}
      </div>
    </Content>
  );
};
