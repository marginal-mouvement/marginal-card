import type { SessionId } from "../domain/sessionId";

export interface TokenParser {
  parse(token: string): Promise<SessionId>;
  sign(sessionId: SessionId): Promise<string>;
}
