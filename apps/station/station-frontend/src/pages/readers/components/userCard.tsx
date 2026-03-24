import type { SimpleUser } from "@marginal-card/platform-sdk";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item.tsx";

interface UserCardProps {
  user: SimpleUser;
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <Item variant="outline" className="w-sm">
      <ItemContent>
        <ItemTitle>{user.name}</ItemTitle>
        <ItemDescription>{user.email}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <span className="text-lg">{user.balance}</span>
      </ItemActions>
    </Item>
  );
};
