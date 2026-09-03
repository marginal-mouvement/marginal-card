import { useCallback, useState } from "react";

import { platformSDK } from "../../modules/platform/platformSDK.ts";
import { useStateRef } from "../../hooks/useStateRef.ts";

type RegisterStep = "landing" | "username" | "email" | "referer";

interface RegisterFormProps {
  keyId: string;
}

export const RegisterForm = ({ keyId }: RegisterFormProps) => {
  const [currentStep, setCurrentStep] = useState<RegisterStep>("landing");

  const {
    ref: emailRef,
    state: [email, setEmail],
  } = useStateRef<string | undefined>(undefined);
  const {
    ref: nameRef,
    state: [name, setName],
  } = useStateRef<string | undefined>(undefined);
  const {
    ref: refererRef,
    state: [referer, setReferer],
  } = useStateRef<string | undefined>(undefined);

  const commit = useCallback(async () => {
    if (!nameRef.current || !emailRef.current) {
      setCurrentStep("landing");
      return;
    }

    try {
      await platformSDK.user.claimKey({
        keyId,
        name: nameRef.current,
        email: emailRef.current,
        refererName: refererRef.current,
      });
    } catch (error) {
      console.error(error);
    }
  }, [emailRef, keyId, nameRef, refererRef]);
};
