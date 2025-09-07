"use client";

import { useActionState, useEffect,useState } from 'react'
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { appConfig } from "@/lib/config";
import { handleLogin } from "@/lib/auth-actions";
import { ClipLoader, BeatLoader } from "react-spinners";  // <-- added BeatLoader
import { Mail, Lock } from "lucide-react"; // icons
import { useFormStatus } from 'react-dom';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, action] = useActionState(
    async (
      prevState: { ok: boolean; error?: string } | undefined,
      formData: FormData
    ) => {
      // append domain automatically
      const username = formData.get("username") as string;
      formData.set("email", `${username}@smartbd.com`);
      formData.delete("username");
      return handleLogin(prevState, formData);
    },
    undefined
  );

  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.ok) {
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  }, [state, router]);

  if (showSuccess) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-green-100 dark:bg-green-900 z-50 space-y-4">
        <div className="text-green-700 dark:text-green-300 text-3xl font-bold">
          Login Successful!
        </div>
        <div className="text-green-600 dark:text-green-200">
          Redirecting to dashboard...
        </div>
        {/* Added BeatLoader */}
        <BeatLoader color="#15803d" size={14} />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form action={action} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your {appConfig.name} account
                </p>
              </div>

              <UsernameInput />
              <PasswordInput />

              <p
                className="text-sm text-red-600 mt-2 min-h-[1.25rem]"
                role="alert"
                aria-live="polite"
              >
                {state?.error ?? "\u00A0"}
              </p>

              <SubmitButton />
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="/office.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

function UsernameInput() {
  const { pending } = useFormStatus();
  return (
    <div className="grid gap-3">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="username"
          required
          autoFocus
          disabled={pending}
          className="pl-10"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          @smartbd.com
        </span>
      </div>
    </div>
  );
}

function PasswordInput() {
  const { pending } = useFormStatus();
  return (
    <div className="grid gap-3">
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="◆◆◆◆◆◆◆"
          required
          disabled={pending}
          className="pl-10"
        />
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full flex justify-center items-center gap-2"
      disabled={pending}
    >
      {pending ? (
        <>
          <ClipLoader color="#ffffff" size={20} />
          Logging in...
        </>
      ) : (
        "Login"
      )}
    </Button>
  );
}
