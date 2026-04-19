import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Stack from "@/components/sections/Stack";
import About from "@/components/sections/About";

export default function Home() {
    return (
        <main className="bg-bg">
            <Navbar />
            <Hero />
            <About />
            <Stack />
        </main>
    );
}