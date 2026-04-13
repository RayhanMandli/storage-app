import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import { getGithubAuthUrl } from "../../utils/socialAuth";

export function SignupPage() {
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const githubAuthUrl = getGithubAuthUrl();
  const googleEnabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await signup(form);
      toast.success("Account created. You can now login.");
      setTimeout(() => navigate("/login"), 700);
    } catch (err) {
      toast.error(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Card className="p-6 sm:p-8">
        <h1 className="mb-1 text-3xl">Create Your Workspace</h1>
        <p className="mb-6 text-sm text-zinc-400">Provision your storage dashboard in under a minute.</p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          <Button className="w-full py-3" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        {googleEnabled ? (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-2">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const credential = credentialResponse.credential;
                  if (!credential) throw new Error("Google credential not received");
                  await loginWithGoogle(credential);
                  toast.success("Signed in with Google.");
                  navigate("/app", { replace: true });
                } catch (err) {
                  toast.error(err.message || "Google signup failed.");
                }
              }}
              onError={() => toast.error("Google signup failed.")}
              theme="filled_black"
              text="continue_with"
              shape="pill"
              width="360"
            />
          </div>
        ) : null}

        {githubAuthUrl ? (
          <a href={githubAuthUrl} className="mt-3 block">
            <Button variant="ghost" className="w-full py-3">
              Continue with GitHub
            </Button>
          </a>
        ) : null}

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account? <Link to="/login" className="text-sky-300">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
