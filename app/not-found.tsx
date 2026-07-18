import Link from "next/link";
import { RadioTower, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-background px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/12 text-primary">
          <RadioTower className="h-6 w-6" />
        </div>
        <p className="mt-6 font-mono text-sm text-muted-foreground">Error 404</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
          Signal lost
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This route isn&rsquo;t on the map. It may have been moved, renamed, or
          never existed on the deck.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to command deck
          </Link>
        </Button>
      </div>
    </div>
  );
}
