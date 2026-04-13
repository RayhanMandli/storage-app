import { Card } from "../../components/ui/Card";

export function AboutPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-4xl">About NebulaStorage</h1>
      <p className="max-w-3xl text-zinc-300">
        We design storage workflows that feel calm under pressure. NebulaStorage combines strict backend
        data controls with a front-end experience that helps teams move files quickly and safely.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-2 text-2xl">What We Believe</h2>
          <p className="text-sm text-zinc-400">
            Storage software should be secure, beautiful, and predictable. Every action should provide clear
            feedback and confidence.
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="mb-2 text-2xl">What You Get</h2>
          <p className="text-sm text-zinc-400">
            Structured directories, real upload UX, role-ready controls, and interfaces that adapt naturally
            across mobile and desktop.
          </p>
        </Card>
      </div>
    </section>
  );
}
