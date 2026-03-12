import { useUser } from "@/modules/auth/useUser.ts";
import { Header } from "@/parts/header.tsx";
import { Content } from "@/parts/content.tsx";
import { Card } from "@/components/ui/card.tsx";

export const GatePage = () => {
  const user = useUser();

  return (
    <>
      <Header title={`Bienvenue, ${user.name}`} />
      <Content withHeader>
        <div className="flex h-24 justify-center items-center">
          <Card className="p-4">
            <h2 className="text-7xl font-bold text-primary">
              {user.balance}
              <span className="text-lg">pts</span>
            </h2>
          </Card>
        </div>
      </Content>
    </>
  );
};
