import { Button } from "@/components/ui/button";
import { Heart, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="relative min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-6 py-24 sm:px-10">
                <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                        background:
                            "radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.15) 0%, rgba(15, 23, 42, 0) 50%)",
                    }}
                />
                <div className="relative mx-auto max-w-5xl text-center">
                    <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl font-heading tracking-tight mb-6">
                        We are <span className="text-primary">Bloodline</span>.
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed mb-8">
                        Our mission is to bridge the gap between donors and recipients, ensuring that no life is lost due to a shortage of blood. We believe in the power of community and technology to save lives.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="px-6 py-16 sm:px-10 bg-secondary/30">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-12 md:grid-cols-3">
                        <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
                            <div className="p-3 rounded-full bg-primary/10 text-primary">
                                <Heart className="size-8" />
                            </div>
                            <h3 className="text-xl font-bold font-heading">Save Lives</h3>
                            <p className="text-muted-foreground">
                                Every donation counts. We facilitate the process to make it easy, safe, and impactful.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
                            <div className="p-3 rounded-full bg-primary/10 text-primary">
                                <Shield className="size-8" />
                            </div>
                            <h3 className="text-xl font-bold font-heading">Trusted Network</h3>
                            <p className="text-muted-foreground">
                                We verify every request and donor to ensure a secure and reliable network for everyone.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
                            <div className="p-3 rounded-full bg-primary/10 text-primary">
                                <Users className="size-8" />
                            </div>
                            <h3 className="text-xl font-bold font-heading">Community Driven</h3>
                            <p className="text-muted-foreground">
                                Built by the community, for the community. Together we can make a difference.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 py-24 sm:px-10 text-center">
                <div className="mx-auto max-w-3xl space-y-8">
                    <h2 className="text-3xl font-bold font-heading sm:text-4xl">
                        Ready to make a difference?
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Join thousands of donors who are already saving lives in your area.
                    </p>
                    <Button size="lg" className="rounded-full px-8 shadow-glow" asChild>
                        <Link href="/auth/register">Join the Movement</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
