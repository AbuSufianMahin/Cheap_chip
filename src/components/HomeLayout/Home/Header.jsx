import ResponsiveWidth from "@/components/shared/ResponsiveWidth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Recycle, Wrench, Leaf } from "lucide-react";
import Link from "next/link";

function Header() {
    return (
        <section className="relative overflow-hidden px-2 py-10 md:px-16 md:py-28">
            <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(74,180,80,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(74,180,80,0.06) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />
            <div className="relative z-10">
                <ResponsiveWidth>
                    <div className="grid items-center gap-16 md:grid-cols-2">
                        {/* Left — copy */}
                        <div className="flex flex-col gap-6">
                            <Badge
                                variant="outline"
                                className="w-fit gap-2 rounded-full border-green-500/40 bg-green-500/10 px-4 py-1.5 text-green-700 dark:text-green-400"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                                </span>
                                Eco-first electronics care
                            </Badge>

                            <h1
                                className="text-5xl font-extrabold leading-[1.04] tracking-tight text-foreground md:text-6xl"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                            >
                                Fix first.{" "}
                                <span className="text-green-500">Recycle</span>
                                <br />
                                <span className="text-muted-foreground/90">the rest.</span>
                            </h1>

                            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                                Affordable repair &amp; responsible recycling for all your
                                electronics. Less waste, more savings — starting at just a chip off
                                the price.
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <Link href={"/our-services"}>
                                    <Button
                                        size="lg"
                                        className="gap-2 rounded-lg bg-green-600 px-6 font-semibold text-white hover:bg-green-700"
                                    >
                                        Our services <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-8 border-t border-green-200 pt-6">
                                {[
                                    { value: "12k+", label: "Devices repaired" },
                                    { value: "98%", label: "Satisfaction rate" },
                                    { value: "5t", label: "E-waste diverted" },
                                ].map(({ value, label }) => (
                                    <div key={label}>
                                        <p
                                            className="text-3xl font-extrabold tracking-tight text-green-500"
                                            style={{ fontFamily: "'Syne', sans-serif" }}
                                        >
                                            {value}
                                        </p>
                                        <p className="mt-0.5 text-xs uppercase tracking-widest text-muted-foreground">
                                            {label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — visual cards */}
                        <div className="flex flex-col gap-4">
                            {/* Main feature card */}
                            <div className="rounded-2xl border border-green-500/25 bg-white/80 p-6 backdrop-blur-sm dark:bg-white/5">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/15">
                                    <Wrench className="h-6 w-6 text-green-500" />
                                </div>
                                <h3 className="mb-1 text-lg font-semibold text-foreground">
                                    Fast, affordable repair
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Screens, batteries, ports — we fix it all. Most repairs done same
                                    day with a price-match guarantee.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {["Phones", "Laptops", "Tablets", "Consoles"].map((d) => (
                                        <span
                                            key={d}
                                            className="rounded-full border border-green-500/25 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400"
                                        >
                                            {d}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Two smaller cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-border bg-white/70 p-5 backdrop-blur-sm dark:bg-white/5">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                                        <Recycle className="h-5 w-5 text-green-500" />
                                    </div>
                                    <h4 className="mb-1 text-sm font-semibold text-foreground">
                                        Responsible recycling
                                    </h4>
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        Zero landfill. Every component is recovered or safely disposed.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-border bg-white/70 p-5 backdrop-blur-sm dark:bg-white/5">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                                        <Leaf className="h-5 w-5 text-green-500" />
                                    </div>
                                    <h4 className="mb-1 text-sm font-semibold text-foreground">
                                        Carbon offset
                                    </h4>
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        Every job contributes to verified tree-planting programs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ResponsiveWidth>
            </div>
        </section>
    )
}

export default Header