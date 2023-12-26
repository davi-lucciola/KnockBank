import { useEffect } from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";


export default function Home() {
  // Tab Title
  useEffect(() => {
    document.title = "Home";
  }, []);

  return (
    <div className="bg-white h-screen">
      <Header />
      <Hero />
    </div>
  );
}
