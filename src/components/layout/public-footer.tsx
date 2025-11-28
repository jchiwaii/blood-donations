import React from "react";
import { Droplet, Github, Twitter, Linkedin } from "lucide-react";

const PublicFooter = () => {
    return (
        <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-12 md:px-6">
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 font-heading font-bold text-xl tracking-tight">
                            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
                                <Droplet className="size-4 fill-current" />
                            </span>
                            Bloodline
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Connecting donors with those in need. Join our community and save lives today.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-heading font-semibold mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-foreground transition-colors">How it Works</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Campaigns</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Hospitals</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Donors</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-heading font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-heading font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Bloodline. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <a href="#" className="hover:text-primary transition-colors"><Github className="size-5" /></a>
                        <a href="#" className="hover:text-primary transition-colors"><Twitter className="size-5" /></a>
                        <a href="#" className="hover:text-primary transition-colors"><Linkedin className="size-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
