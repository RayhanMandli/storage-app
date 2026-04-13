import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="mx-auto grid min-h-screen max-w-xl place-items-center p-8 text-center">
      <div>
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">404</p>
        <h1 className="mb-3 text-5xl">Page not found</h1>
        <p className="mb-7 text-zinc-400">The page you are looking for does not exist.</p>
        <Link to="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
