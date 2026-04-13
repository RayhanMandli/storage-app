import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Lock, Sparkles, UploadCloud } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const features = [
  {
    icon: UploadCloud,
    title: "Smart Upload Pipeline",
    description: "Drag, drop, and ship large files with smooth progress and resilient delivery.",
  },
  {
    icon: Lock,
    title: "Session-Secure Access",
    description: "Cookie-backed auth and protected actions keep your workspace consistently safe.",
  },
  {
    icon: Sparkles,
    title: "Calm Productivity",
    description: "Designed for deep focus with high contrast, zero clutter, and quick actions.",
  },
];

export function HomePage() {
  return (
    <section className="space-y-12">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass soft-shadow relative overflow-hidden rounded-3xl px-6 py-10 sm:px-12 sm:py-16"
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        <p className="mb-3 inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-300">
          Built for modern teams
        </p>
        <h1 className="max-w-3xl text-4xl leading-tight sm:text-6xl">
          Your storage control panel, crafted like premium SaaS.
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-300 sm:text-lg">
          NebulaStorage gives your files a clean command center: structured directories, lightning uploads,
          and role-ready collaboration.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/signup">
            <Button className="px-6 py-3">Create Account</Button>
          </Link>
          <Link to="/pricing">
            <Button variant="ghost" className="px-6 py-3">
              See Pricing <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </Motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 * index }}
            >
              <Card className="h-full p-5">
                <div className="mb-3 inline-flex rounded-xl bg-sky-400/15 p-2 text-sky-200">
                  <Icon size={18} />
                </div>
                <h3 className="mb-2 text-lg">{feature.title}</h3>
                <p className="text-sm text-zinc-400">{feature.description}</p>
              </Card>
            </Motion.div>
          );
        })}
      </div>
    </section>
  );
}
