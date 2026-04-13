import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function RouteErrorPage() {
  const error = useRouteError();

  let title = "Unexpected error";
  let message = "Something went wrong while loading this page.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = typeof error.data === "string" ? error.data : message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-xl place-items-center p-6">
      <Card className="w-full space-y-4 p-7 text-center">
        <div className="mx-auto w-fit rounded-full bg-rose-400/15 p-3 text-rose-300">
          <AlertTriangle size={20} />
        </div>
        <h1 className="text-2xl">{title}</h1>
        <p className="text-sm text-zinc-400">{message}</p>
        <div className="flex justify-center gap-3">
          <Link to="/">
            <Button>Back Home</Button>
          </Link>
          <Button variant="ghost" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </Card>
    </div>
  );
}
