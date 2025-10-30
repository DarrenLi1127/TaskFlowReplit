import { Button } from "@/components/ui/button";
import { CheckCircle2, ListTodo, Sparkles, Rocket, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
        <div className="container flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-primary to-accent p-2">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TaskFlow</span>
          </div>
          <Button 
            onClick={() => window.location.href = '/auth'}
            data-testid="button-login"
            variant="outline"
            className="rounded-full"
          >
            Sign In
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container px-8 py-24 md:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-5 py-2.5 border border-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Make Productivity Fun!</span>
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Get Things Done
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">With Joy & Style!</span>
            </h1>
            
            <p className="mb-10 text-xl text-muted-foreground md:text-2xl max-w-3xl mx-auto font-medium">
              Task management doesn't have to be boring! Create, crush, and celebrate your todos with our fun and colorful productivity app.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/auth'}
                className="w-full sm:w-auto rounded-full px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
                data-testid="button-get-started"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Let's Go!
              </Button>
            </div>
          </div>
        </section>

        <section className="container px-8 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Everything You Need to Win the Day
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-3xl hover:shadow-xl transition-all hover:scale-105">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Quick Create</h3>
                <p className="text-base text-muted-foreground">
                  Add tasks in seconds with our super-fast interface. No friction, just action!
                </p>
              </div>

              <div className="text-center p-6 rounded-3xl hover:shadow-xl transition-all hover:scale-105">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5">
                  <CheckCircle2 className="h-8 w-8 text-accent" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Celebrate Progress</h3>
                <p className="text-base text-muted-foreground">
                  Check off tasks and watch your productivity soar with delightful animations
                </p>
              </div>

              <div className="text-center p-6 rounded-3xl hover:shadow-xl transition-all hover:scale-105">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5">
                  <Sparkles className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Colorful & Fun</h3>
                <p className="text-base text-muted-foreground">
                  Vibrant design makes task management actually enjoyable. Yes, really!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-10 bg-muted/30">
        <div className="container px-8 text-center">
          <p className="text-base font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TaskFlow - Making productivity joyful, one task at a time
          </p>
        </div>
      </footer>
    </div>
  );
}
