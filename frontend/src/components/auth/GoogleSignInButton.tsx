import { useGoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import { GoogleIcon } from "./GoogleIcon";
import { isGoogleOAuthConfigured } from "../../lib/googleAuth";

type GoogleSignInButtonProps = {
  onToken: (token: string) => void;
  isPending?: boolean;
  idleLabel?: string;
  pendingLabel?: string;
  errorMessage?: string;
  unavailableLabel?: string;
  unavailableMessage?: string;
  className?: string;
};

export function GoogleSignInButton({
  onToken,
  isPending = false,
  idleLabel = "Continue with Google",
  pendingLabel = "Connecting...",
  errorMessage,
  unavailableLabel = "Google sign-in unavailable",
  unavailableMessage = "Set VITE_GOOGLE_CLIENT_ID to enable Google login.",
  className = "flex w-full items-center justify-center gap-3 rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50",
}: GoogleSignInButtonProps): React.ReactElement {
  if (!isGoogleOAuthConfigured) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          disabled
          className={className}
          aria-disabled="true"
        >
          <GoogleIcon />
          {unavailableLabel}
        </button>
        <p className="text-center text-xs text-neutral-500">
          {unavailableMessage}
        </p>
      </div>
    );
  }

  return (
    <GoogleSignInButtonEnabled
      onToken={onToken}
      isPending={isPending}
      idleLabel={idleLabel}
      pendingLabel={pendingLabel}
      errorMessage={errorMessage}
      className={className}
    />
  );
}

function GoogleSignInButtonEnabled({
  onToken,
  isPending,
  idleLabel,
  pendingLabel,
  errorMessage,
  className,
}: Pick<
  GoogleSignInButtonProps,
  "onToken" | "isPending" | "idleLabel" | "pendingLabel" | "errorMessage" | "className"
>): React.ReactElement {
  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      onToken(response.access_token);
    },
  });

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => googleLogin()}
        disabled={isPending}
        className={className}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
        {isPending ? pendingLabel : idleLabel}
      </button>
      {errorMessage && <p className="text-center text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
}
