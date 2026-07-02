"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

interface Props {
  onCredential: (credential: string) => void;
}

export default function GoogleSignInButton({ onCredential }: Props) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onCredential);
  callbackRef.current = onCredential;

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
      return;
    }

    function initialize() {
      if (!window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: any) => callbackRef.current(response.credential),
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 360,
        text: "continue_with",
      });
    }

    if (window.google) {
      initialize();
    } else {
      const existingScript = document.getElementById("google-identity-script");
      if (existingScript) {
        existingScript.addEventListener("load", initialize);
        return;
      }
      const script = document.createElement("script");
      script.id = "google-identity-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initialize;
      document.body.appendChild(script);
    }
  }, []);

  return <div ref={buttonRef} className="flex justify-center" />;
}