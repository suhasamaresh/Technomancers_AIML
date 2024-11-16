import Image from "next/image";
import Faq from "./components/faq";
import Workflow from "./components/workflow";
import { LampDemo } from "./components/lampdemo";
import Hero from "./components/hero";

export default function Home() {
  return (
    <div>
      <Hero />
      <LampDemo />
      <Workflow />
      <Faq />
    </div>
  );
}
