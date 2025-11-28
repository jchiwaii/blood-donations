import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";

const campaigns = [
    {
        id: 1,
        title: "City Center Drive",
        location: "Central Plaza, New York",
        date: "Oct 15, 2023",
        description: "Join us for our monthly blood drive at the city center. Walk-ins welcome!",
        status: "Active",
    },
    {
        id: 2,
        title: "University Campus Event",
        location: "State University, Student Hall",
        date: "Oct 22, 2023",
        description: "Students and faculty are invited to donate and learn more about blood health.",
        status: "Upcoming",
    },
    {
        id: 3,
        title: "Community Health Fair",
        location: "Westside Community Center",
        date: "Nov 05, 2023",
        description: "A day of health screenings and blood donations for the whole family.",
        status: "Upcoming",
    },
];

export default function CampaignsPage() {
    return (
        <div className="relative min-h-screen bg-background text-foreground">
            <section className="relative overflow-hidden px-6 py-16 sm:px-10">
                <div className="mx-auto max-w-5xl text-center mb-16">
                    <h1 className="text-4xl font-bold leading-tight sm:text-5xl font-heading tracking-tight mb-4">
                        Active Campaigns
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Find a blood drive near you and help us replenish the supply.
                    </p>
                </div>

                <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {campaigns.map((campaign) => (
                        <div
                            key={campaign.id}
                            className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:shadow-glow hover:-translate-y-1"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                    {campaign.status}
                                </span>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Calendar className="size-3" />
                                    {campaign.date}
                                </span>
                            </div>
                            <h3 className="mb-2 text-xl font-bold font-heading group-hover:text-primary transition-colors">
                                {campaign.title}
                            </h3>
                            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="size-4" />
                                {campaign.location}
                            </div>
                            <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
                                {campaign.description}
                            </p>
                            <Button className="w-full rounded-xl" variant="outline" asChild>
                                <Link href={`/campaigns/${campaign.id}`}>View Details</Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
