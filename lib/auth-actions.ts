import { z } from "zod";
import { signUp, signOut, signIn } from "@/lib/auth-client";
import { APIError } from "better-auth/api";

// --- Zod Schema for Signup ---
const signupSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export type SignupData = z.infer<typeof signupSchema>;

/**
 * Handles user signup with validation and feedback.
 * @param data - The user's signup information (name, email, password).
 * @returns An object indicating success or failure with error messages.
 */
export async function handleSignup(prevState: any, formData: FormData) {
  const name = String(formData.get("name"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const parsed = signupSchema.safeParse({ name, email, password });
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const res = await signUp.email({ email, password, name });

    if (res.error) {
      return { ok: false, errors: [res.error.message] };
    }

    return { ok: true };
  } catch (err) {
    if (err instanceof APIError) {
      console.error("API_x0A2_ERROR Error:", err.message);
      return { ok: false, errors: [err.message] };
    }
    console.error("API_x0A2_ERROR_UNEXPECTED_ERROR error:", err);
    return { ok: false, errors: ["Unexpected error."] };
  }
}

/**
 * Handles user login with email and password.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns An object indicating success or failure with an error message.
 */
export async function handleLogin(
  prevState: any,
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  if (
    formData instanceof Event &&
    typeof formData.preventDefault === "function"
  ) {
    formData.preventDefault();
  }
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  try {
    const res = await signIn.email({ email, password });

    if (res.error) {
      // Return the error message instead of showing a toast
      return { ok: false, error: res.error.message };
    }

    // Return success state
    return { ok: true };
  } catch (err) {
    if (err instanceof APIError) {
      console.error("API_x0A1_ERROR Error:", err.message);
      return { ok: false, error: err.message };
    }
    console.error("API_x0A1_ERROR_UNEXPECTED_ERROR error:", err);
    return { ok: false, error: "Unexpected error." };
  }
}

/**
 * Handles user logout.
 * This function now only handles the sign-out logic.
 * Navigation should be handled in the component that calls this function.
 * @returns A promise that resolves when the sign-out is complete.
 */
export async function handleLogout(onSuccess?: () => void) {
  try {
    await signOut();
    // call callback if provided
    if (onSuccess) onSuccess();
  } catch (err) {
    console.error("Logout failed:", err);
    if (err instanceof APIError) {
      console.error("API_x0A0_ERROR Error:", err.message);
      throw err;
    } else {
      console.error("API_x0A0_ERROR_UNEXPECTED_ERROR error:", err);
      throw new Error("Unexpected error.");
    }
  }
}
