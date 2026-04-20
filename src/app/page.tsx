import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Stack from "@/components/sections/Stack";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

export default function Home() {
    return (
        <main className="bg-bg">
            <Navbar />
            <Hero />
            <About />
            <Projects />
            <Stack />
            <Contact />
        </main>
    );
}