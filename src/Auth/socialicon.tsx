import { useGoogleLogin } from "@react-oauth/google";
import { useFacebookAuth } from "../Component/useFacebookAuth";

declare global {
  interface Window {
    FB: any;
  }
}

interface SocialIconProps {
  role: string;
}

export function SocialIcon({ role }: SocialIconProps) {
  const { fbReady, loginWithFacebook } = useFacebookAuth();
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: tokenResponse.access_token,
            role,
          }),
        });

        const data = await res.json();
        localStorage.setItem("token", data.token);
        alert(`Google login successful as ${role}`);
      } catch (err) {
        console.error(err);
        alert("Google login failed");
      }
    },
    onError: () => alert("Google login failed"),
  });

const handleFacebookLogin = async () => {
  if (!role) {
    alert("Please select a role first!");
    return;
  }

  if (!fbReady) {
    alert("Facebook is still loading...");
    return;
  }

  try {
    const authResponse: any = await loginWithFacebook();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/facebook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: authResponse.accessToken,
        userID: authResponse.userID,
        role,
      }),
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);

    alert(`Facebook login successful as ${role}`);
  } catch (err) {
    console.error(err);
    alert("Facebook login failed");
  }
};

  return (
    <div className="mb-6 text-black">
      <div className="flex items-center rounded-sm overflow-hidden">
        <button
          onClick={() => {
            if (!role) {
              alert("Please select a role first!");
              return;
            }
            googleLogin();
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium hover:bg-gray-50"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" />
          Google
        </button>

        <span className="text-gray-400 px-2">|</span>

        <button
          onClick={handleFacebookLogin}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium hover:bg-gray-50"
        >
          <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-4 h-4" />
          Facebook
        </button>
      </div>
    </div>
  );
}
