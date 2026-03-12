import { Content } from "@/parts/content.tsx";
import key from "@/assets/key.png";

export const LandingPage = () => {
  return (
    <Content className="flex justify-center items-center h-svh pb-0">
      <img className="max-w-80" src={key} alt="key" />
    </Content>
  );
};
