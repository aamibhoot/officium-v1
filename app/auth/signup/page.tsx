import { SignupForm } from "@/components/signup-form";
import { Toaster } from "sonner";

export default function Signup() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <Toaster />
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm />
      </div>
    </div>
  );
}
