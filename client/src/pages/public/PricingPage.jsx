import { Check } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

const plans = [
  {
    name: "Starter",
    price: "$0",
    subtitle: "For personal use",
    features: ["5GB storage", "Basic uploads", "Single-device session"],
  },
  {
    name: "Pro",
    price: "$12",
    subtitle: "For builders and teams",
    features: ["200GB storage", "Priority upload lane", "Share controls", "Activity visibility"],
    highlight: true,
  },
  {
    name: "Scale",
    price: "$39",
    subtitle: "For growing companies",
    features: ["2TB storage", "Admin controls", "Session policies", "Team-level governance"],
  },
];

export function PricingPage() {
  return (
    <section>
      <h1 className="mb-2 text-4xl">Simple Pricing</h1>
      <p className="mb-8 text-zinc-400">Choose a plan that matches your storage velocity.</p>

      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={`p-6 ${plan.highlight ? "ring-1 ring-sky-300/60" : ""}`}>
            <h2 className="text-2xl">{plan.name}</h2>
            <p className="mt-2 text-4xl font-semibold">{plan.price}</p>
            <p className="mb-6 mt-1 text-sm text-zinc-400">{plan.subtitle}</p>

            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li className="flex items-center gap-2 text-sm text-zinc-300" key={feature}>
                  <Check size={14} className="text-emerald-300" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link to="/signup" className="mt-7 block">
              <Button className="w-full">Get Started</Button>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
