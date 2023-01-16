import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children }: { children: ReactNode }) {
  const portalRef = useRef<HTMLElement>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    portalRef.current = document.body;
    setMounted(true);
  }, []);

  return mounted && portalRef.current
    ? createPortal(children, portalRef.current)
    : null;
}
