import { UserRegex } from "@marginal-card/platform-sdk";
import { Key } from "lucide-react";
import { use, useState } from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { FormValidator } from "@/hooks/formValidator/formValidator.ts";
import { FormField } from "@/hooks/formValidator/formField.ts";
import { useStateRef } from "@/hooks/useStateRef.ts";
import { Kbd } from "@/components/ui/kbd.tsx";
import { Button } from "@/components/ui/button.tsx";
import { platformSDK } from "@/modules/platform/platformSDK.ts";
import { AuthContext } from "@/modules/auth/auth.context.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";

const registerValidator = new FormValidator({
  name: FormField.text("Nom", true)
    .toBeTrimmed()
    .toBeLowercased()
    .withValidationRegex(UserRegex.USERNAME),
  email: FormField.text("E-mail", true)
    .toBeTrimmed()
    .toBeLowercased()
    .withValidationRegex(UserRegex.EMAIL),
  refererName: FormField.text("Parrain", false)
    .toBeTrimmed()
    .toBeLowercased()
    .withValidationRegex(UserRegex.USERNAME),
});

interface RegisterFormProps {
  keyId?: string;
}

export const RegisterForm = ({ keyId }: RegisterFormProps) => {
  const {
    ref: nameRef,
    state: [name, setName],
  } = useStateRef("");
  const {
    ref: emailRef,
    state: [email, setEmail],
  } = useStateRef("");
  const {
    ref: refererNameRef,
    state: [refererName, setRefererName],
  } = useStateRef("");

  const { setKeyId, refreshAuth } = use(AuthContext);

  const { errors, setErrors, hasErrors } = registerValidator.useErrors();

  const validateName = registerValidator.useValidate(
    "name",
    nameRef,
    setErrors,
  );

  const validateEmail = registerValidator.useValidate(
    "email",
    emailRef,
    setErrors,
  );

  const validateRefererName = registerValidator.useValidate(
    "refererName",
    refererNameRef,
    setErrors,
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (hasErrors || !keyId) {
      return;
    }

    const [err, sanitized] = registerValidator.validateAll({
      name,
      email,
      refererName,
    });

    if (err) {
      setErrors(err);
      return;
    }

    setIsLoading(true);

    try {
      await platformSDK.user.claimKey({
        keyId,
        name: sanitized.name,
        email: sanitized.email,
        refererName: sanitized.refererName,
      });
      setKeyId(keyId);
      refreshAuth();
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-2xl">Bienvenue</h1>
      <Field>
        <FieldLabel>Nom</FieldLabel>
        <Input
          placeholder="marginal92"
          value={name}
          onChangeText={setName}
          onChange={errors.name ? validateName : undefined}
          disabled={isLoading}
        />
        {errors.name && <FieldError>{errors.name.message}</FieldError>}
      </Field>
      <Field>
        <FieldLabel>E-mail</FieldLabel>
        <Input
          placeholder="marginal92@example.com"
          value={email}
          onChangeText={setEmail}
          onChange={errors.email ? validateEmail : undefined}
          disabled={isLoading}
        />
        {errors.email && <FieldError>{errors.email.message}</FieldError>}
      </Field>
      <Field>
        <FieldLabel>
          Parrain{" "}
          <span className="text-muted-foreground font-light">(optionnel)</span>
        </FieldLabel>
        <Input
          placeholder="marginal91"
          value={refererName}
          onChangeText={setRefererName}
          onChange={errors.refererName ? validateRefererName : undefined}
          disabled={isLoading}
        />
        {errors.refererName ? (
          <FieldError>{errors.refererName.message}</FieldError>
        ) : (
          <FieldDescription>
            Toi et ton parrain gagnerez chacun <Kbd>50F</Kbd>
          </FieldDescription>
        )}
      </Field>
      <Button size="lg" disabled={isLoading} onClick={handleSubmit}>
        {isLoading ? <Spinner /> : <Key />} Entrer
      </Button>
    </div>
  );
};
