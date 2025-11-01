import React from "react";
import { Button } from "@/components/ui/button";
import SignInButton from "./_components/signin-button";
import { Heart, Droplet, Users, Shield } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-2">
            <Droplet className="h-6 w-6 text-destructive fill-destructive" />
            <span className="text-xl font-bold tracking-tight">
              BloodConnect
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <SignInButton />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 xl:gap-24 items-center">
          {/* Hero Content */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-muted">
                <Heart className="mr-2 h-4 w-4 text-destructive" />
                Save Lives Today
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Donate Blood,
                <span className="block text-destructive">Save Lives</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-[600px]">
                Join our community of heroes. Every donation can save up to
                three lives. Make a difference today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base h-12 px-8">
                <Droplet className="mr-2 h-5 w-5" />
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base h-12 px-8"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t">
              <div>
                <div className="text-2xl font-bold text-destructive">10K+</div>
                <div className="text-sm text-muted-foreground">Donors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">50K+</div>
                <div className="text-sm text-muted-foreground">Lives Saved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-destructive/20 to-primary/20 rounded-3xl blur-3xl opacity-30" />
            <div className="relative bg-card border rounded-3xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Droplet className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <div className="font-semibold">Quick & Easy</div>
                    <div className="text-sm text-muted-foreground">
                      Register in minutes
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Join Community</div>
                    <div className="text-sm text-muted-foreground">
                      Connect with donors
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">Safe & Secure</div>
                    <div className="text-sm text-muted-foreground">
                      Your data is protected
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
