import { Button } from "@/components/ui/button";
import { CheckCircle2, ListTodo } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <ListTodo className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">TaskFlow</span>
          </div>
          <Button 
            onClick={() => window.location.href = '/auth'}
            data-testid="button-login"
          >
            Sign In
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container px-6 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
              <span className="text-sm font-medium text-accent-foreground">Simple & Effective</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Manage Your Tasks
              <br />
              <span className="text-primary">Simply & Efficiently</span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              A minimal task management application that helps you stay organized. 
              Create, track, and complete tasks with ease.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/auth'}
                className="w-full sm:w-auto"
                data-testid="button-get-started"
              >
                Get Started
              </Button>
            </div>
          </div>
        </section>

        <section className="container px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold text-center mb-12">Everything you need</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <ListTodo className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Create Tasks</h3>
                <p className="text-sm text-muted-foreground">
                  Quickly add tasks with titles and descriptions
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Mark tasks as complete and stay on top of your work
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium">Secure Storage</h3>
                <p className="text-sm text-muted-foreground">
                  Your tasks are safely stored with user authentication
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container px-6 text-center text-sm text-muted-foreground">
          <p>TaskFlow - Simple task management for everyone</p>
        </div>
      </footer>
    </div>
  );
}
