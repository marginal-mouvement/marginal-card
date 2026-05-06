import {
  ArrowUpRightIcon,
  Github,
  LogOut,
  Mail,
  PenSquare,
  User,
} from "lucide-react";
import { useCallback, useContext } from "react";

import { Header } from "@/parts/header.tsx";
import { Content } from "@/parts/content.tsx";
import { useUser } from "@/modules/auth/useUser.ts";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";
import { ButtonGroup } from "@/components/ui/button-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { AuthContext } from "@/modules/auth/auth.context.tsx";

export const ProfilePage = () => {
  const { logout } = useContext(AuthContext);
  const user = useUser();

  const handleLogout = useCallback(() => {
    if (confirm("Se déconnecter ?")) {
      logout();
    }
  }, [logout]);

  return (
    <>
      <Header title="Profil" />
      <Content withHeader className="flex flex-col gap-7">
        <div className="flex flex-col gap-4 items-center">
          <Avatar className="w-40 h-40">
            <AvatarFallback className="text-2xl">
              {user.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
        <Card className="p-4">
          <FieldSet>
            <Field>
              <FieldLabel>Nom</FieldLabel>
              <FieldContent>
                <InputGroup>
                  <InputGroupInput readOnly value={user.name} />
                  <InputGroupAddon>
                    <User />
                  </InputGroupAddon>
                </InputGroup>
              </FieldContent>
            </Field>
            <Field>
              <FieldContent>
                <FieldLabel>E-mail</FieldLabel>
                <ButtonGroup className="w-full">
                  <InputGroup>
                    <InputGroupInput readOnly value={user.email} />
                    <InputGroupAddon>
                      <Mail />
                    </InputGroupAddon>
                  </InputGroup>
                  <Button variant="outline">
                    <PenSquare /> Modifier
                  </Button>
                </ButtonGroup>
              </FieldContent>
            </Field>
          </FieldSet>
        </Card>
        <Button
          className="w-fit"
          variant="destructive"
          size="lg"
          onClick={handleLogout}
        >
          <LogOut /> Se déconnecter
        </Button>
        <Badge variant="outline" asChild>
          <a
            href="https://github.com/marginal-mouvement/marginal-card"
            target="_blank"
          >
            <Github /> marginal-card <ArrowUpRightIcon />
          </a>
        </Badge>
      </Content>
    </>
  );
};
