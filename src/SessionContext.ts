import * as React from "react";
import type { Session } from "@toolpad/core/AppProvider";

interface SessionContextType {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

const SessionContext = React.createContext<SessionContextType>({
  session: null,
  setSession: () => {},
});

export default SessionContext;

export const useSession = () => React.useContext(SessionContext);
