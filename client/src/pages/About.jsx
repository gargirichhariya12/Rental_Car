import React from "react";
import HighlightCard from "../components/HighlightCard";
import Heading from "../components/Heading";
import { Gauge, BatteryCharging, Cpu, ShieldCheck } from "lucide-react";

export default function KeyHighlights() {
  return (
    <section className="w-full bg-black py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Heading */}
        <Heading heading="Key Highlights" />

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
          
          <HighlightCard
            icon={<Gauge size={22}  />}
            title="Performance"
            points={[
              "0–100 km/h in 3s",
              "Dual Motor AWD",
              "Instant Torque",
            ]}
          />

          <HighlightCard
            icon={<BatteryCharging size={22} />}
            title="Range"
            points={[
              "600+ km Range",
              "Fast Charging",
              "Smart Energy Management",
            ]}
          />

          <HighlightCard
            icon={<Cpu size={22} />}
            title="Technology"
            points={[
              "AI-Assisted Drive",
              "Smart Infotainment",
              "OTA Updates",
            ]}
          />

          <HighlightCard
            icon={<ShieldCheck size={22} />}
            title="Safety"
            points={[
              "360° Camera",
              "Lane Assist",
              "Emergency Braking",
            ]}
          />

        </div>
      </div>
    </section>
  );
}
