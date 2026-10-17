import { useClerk } from "@clerk/clerk-react";

/**
 * Google + GitHub OAuth buttons.
 *
 */
export default function ClerkButtons({ isDark }) {
  const { authenticateWithRedirect, openSignIn } = useClerk();

  const handleOAuth = (provider) => {
    authenticateWithRedirect({
      strategy: `oauth_${provider}`,
      redirectUrl: window.location.href,
      redirectUrlComplete: window.location.href,
    });
  };

  const handleClerkSignIn = () => {
    openSignIn({
      redirectUrl: window.location.href,
      redirectUrlComplete: window.location.href,
    });
  };

  const base = `flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
    isDark
      ? "border-white/10 bg-white text-white hover:bg-gray-300"
      : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
  }`;

  return (
    <div className="mx-auto mt-6 w-[100%] space-y-3">
      <button
        type="button"
        onClick={handleClerkSignIn}
        className={`${base} w-full hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <img src="/clerk_logo.svg" alt="Clerk" className="h-6" />
      </button>

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
