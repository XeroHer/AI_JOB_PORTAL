import { useEffect, useState } from "react";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export function useFacebookAuth() {
  const [fbReady, setFbReady] = useState(false);

  useEffect(() => {
    // If already loaded
    if (window.FB) {
      setFbReady(true);
      return;
    }

    // Init function
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1383773020207796",
        cookie: true,
        xfbml: false,
        version: "v18.0",
      });

      setFbReady(true);
      console.log("✅ Facebook SDK ready");
    };

    // Load SDK script
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const loginWithFacebook = () => {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        reject("Facebook SDK not loaded");
        return;
      }

      window.FB.login(
        (response: any) => {
          if (response.authResponse) {
            resolve(response.authResponse);
          } else {
            reject("User cancelled login");
          }
        },
        { scope: "public_profile,email" }
      );
    });
  };

  return { fbReady, loginWithFacebook };
}