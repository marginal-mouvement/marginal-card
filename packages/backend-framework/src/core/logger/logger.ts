import type { Constructor } from "@ddd-ts/types";

import type { Severity} from "./severitySymbol";
import { SeveritySymbol } from "./severitySymbol";


export class Logger {
  constructor(readonly context: string) {}

  static for(context: string | Constructor) {
    return new Logger(typeof context === "string" ? context : context.name);
  }

  private print(severity: Severity, ...args: any[]) {
    if (typeof args[0] !== "string") {
      console[severity](
        `[${SeveritySymbol[severity]}] [${new Date().toISOString()}] (${this.context})`,
        args[0],
      );
      return;
    }

    if (args[1] === undefined) {
      console[severity](
        `[${SeveritySymbol[severity]}] [${new Date().toISOString()}] (${this.context}) ${args[0]}`,
      );
    } else {
      console[severity](
        `[${SeveritySymbol.log}] [${new Date().toISOString()}] (${this.context}) ${args[0]}`,
        args[1],
      );
    }
  }

  public info = (message: string, more?: any) => {
    this.print("info", message, more);
  };

  public log = (message: string, more?: any) => {
    this.print("log", message, more);
  };

  public warn = (message: string, more?: any) => {
    this.print("warn", message, more);
  };

  public error = (err: any) => {
    this.print("error", err);
  };
}
