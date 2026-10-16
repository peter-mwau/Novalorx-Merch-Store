// import { useEffect, useRef } from "react";

/**
 * Google + GitHub OAuth buttons.
 *
 * When you wire Clerk, replace the handleOAuth body with:
 *
 *   import { useClerk } from "@clerk/clerk-react";
 *   const clerk = useClerk();
 *   clerk.openSignIn({}); // or clerk.authenticateWithRedirect({ strategy: "oauth_google", ... })
 */
export default function ClerkButtons({ isDark }) {
  const handleOAuth = (provider) => {
    // TODO: integrate Clerk here.
    // Example once Clerk is installed:
    //   import { useClerk } from "@clerk/clerk-react";
    //   const { openSignIn } = useClerk();
    //   openSignIn({});
    console.log(`Clerk OAuth: ${provider}`);
  };

  const base = `flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
    isDark
      ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
      : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
  }`;

  return (
    <div className="mt-6 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          className={base}
        >
          <img src="/google.png" alt="Google" className="h-4 w-4" />
          Google
        </button>
        <button
          type="button"
          onClick={() => handleOAuth("github")}
          className={base}
        >
          <img src="/clerk_logo.svg" alt="GitHub" className="h-4 w-4" />
          GitHub
        </button>
      </div>

      <div className="relative py-1">
        <div className={`absolute inset-0 flex items-center`}>
          <div
            className={`w-full border-t ${
              isDark ? "border-white/10" : "border-slate-200"
            }`}
          />
        </div>
        <div className="relative flex justify-center">
          <span
            className={`px-2 text-[10px] uppercase tracking-wider ${
              isDark ? "bg-slate-950 text-slate-500" : "bg-white text-slate-400"
            }`}
          >
            or continue with email
          </span>
        </div>
      </div>
    </div>
  );
}
