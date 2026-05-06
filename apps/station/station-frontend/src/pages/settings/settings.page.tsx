import { Save, SquarePen } from "lucide-react";
import { useCallback, useState } from "react";

import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ButtonGroup } from "@/components/ui/button-group.tsx";
import { Page } from "@/parts/page.tsx";
import { PlatformApiKeyStore } from "@/core/platform/platformApiKey.store.ts";
import { platformSDK } from "@/core/platform/platformSDK.ts";

export const SettingsPage = () => {
  const [apiKey, setApiKey] = useState(PlatformApiKeyStore.load() ?? "");
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(() => {
    PlatformApiKeyStore.save(apiKey);
    platformSDK.loginByApiKey(apiKey);
    setIsEditing(false);
  }, [apiKey]);

  return (
    <Page title="Platform" muted="Settings">
      <Field className="max-w-80">
        <FieldLabel htmlFor="input-button-group">Platform API key</FieldLabel>
        <ButtonGroup>
          <Input
            id="input-button-group"
            placeholder="ey..."
            value={apiKey}
            disabled={!isEditing}
            onChangeText={setApiKey}
            type={isEditing ? "text" : "password"}
          />
          <Button
            variant="outline"
            onClick={isEditing ? handleSave : handleEdit}
          >
            {isEditing ? (
              <>
                <Save /> Save
              </>
            ) : (
              <>
                <SquarePen /> Edit
              </>
            )}
          </Button>
        </ButtonGroup>
      </Field>
    </Page>
  );
};
