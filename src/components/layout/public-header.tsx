"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Droplet, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const PublicHeader = () => {
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 font-heading font-bold text-xl tracking-tight hover:opacity-90 transition-opacity text-foreground"
                >
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary shadow-glow">
                        <Droplet className="size-4 fill-current" />
                    </span>
                    Bloodline
                </button>

                <nav className="hidden md:flex items-center gap-6">
                    <Button variant="ghost" onClick={() => router.push("/about")} className="text-muted-foreground hover:text-foreground">
                        About
                    </Button>
                    <Button variant="ghost" onClick={() => router.push("/campaigns")} className="text-muted-foreground hover:text-foreground">
                        Campaigns
                    </Button>
                    <div className="flex items-center gap-2 ml-2">
                        <Button variant="ghost" onClick={() => router.push("/auth")} className="text-muted-foreground hover:text-foreground">
                            Login
                        </Button>
                        <Button onClick={() => router.push("/auth")} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow">
                            Get Started
                        </Button>
                    </div>
                </nav>

                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-foreground relative z-50">
                                <Menu className="size-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="top" showClose={false} className="w-screen h-screen border-none bg-background/95 backdrop-blur-2xl p-0">
                            <div className="absolute top-6 right-6 z-50">
                                <SheetClose asChild>
                                    <Button variant="ghost" size="icon" className="text-foreground hover:bg-transparent">
                                        <X className="size-8" />
                                        <span className="sr-only">Close</span>
                                    </Button>
                                </SheetClose>
                            </div>

                            <div
                                className="pointer-events-none absolute inset-0 opacity-20"
                                style={{
                                    background:
                                        "radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.3) 0%, rgba(15, 23, 42, 0) 70%)",
                                }}
                            />
                            <div className="flex flex-col items-center justify-center h-full gap-8 relative z-10 animate-in fade-in zoom-in-95 duration-300">
                                <SheetClose asChild>
                                    <Button
                                        variant="link"
                                        onClick={() => router.push("/")}
                                        className="text-4xl font-heading font-bold text-foreground hover:text-primary transition-colors p-0"
                                    >
                                        Home
                                    </Button>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Button
                                        variant="link"
                                        onClick={() => router.push("/about")}
                                        className="text-4xl font-heading font-bold text-foreground hover:text-primary transition-colors p-0"
                                    >
                                        About
                                    </Button>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Button
                                        variant="link"
                                        onClick={() => router.push("/campaigns")}
                                        className="text-4xl font-heading font-bold text-foreground hover:text-primary transition-colors p-0"
                                    >
                                        Campaigns
                                    </Button>
                                </SheetClose>
                                <div className="w-16 h-1 bg-border rounded-full my-4" />
                                <SheetClose asChild>
                                    <Button
                                        variant="link"
                                        onClick={() => router.push("/auth")}
                                        className="text-3xl font-heading font-bold text-muted-foreground hover:text-foreground transition-colors p-0"
                                    >
                                        Login
                                    </Button>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Button
                                        onClick={() => router.push("/auth")}
                                        size="lg"
                                        className="text-xl font-bold px-12 py-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow mt-4"
                                    >
                                        Get Started
                                    </Button>
                                </SheetClose>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};

export default PublicHeader;
