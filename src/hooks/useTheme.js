import { useEffect, useState } from "react";

export default function useTheme() {
    const [theme, setTheme] = useState("dark"); // default

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "light" || saved === "dark") {
            setTheme(saved);
            document.documentElement.classList.toggle("dark", saved === "dark");
            return;
        }

        const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
        const initial = prefersDark ? "dark" : "light";
        setTheme(initial);
        document.documentElement.classList.toggle("dark", initial === "dark");
    }, []);

    const toggle = () => {
        setTheme((t) => {
            const next = t === "dark" ? "light" : "dark";
            localStorage.setItem("theme", next);
            document.documentElement.classList.toggle("dark", next === "dark");
            return next;
        });
    };

    return { theme, toggle };
}
    