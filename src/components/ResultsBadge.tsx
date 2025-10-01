import { Badge } from "@/components/ui/badge";

interface ResultsBadgeProps {
  conditions: string[];
}

export const ResultsBadge = ({ conditions }: ResultsBadgeProps) => {
  if (conditions.length === 0) {
    return (
      <div className="text-center py-12 animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-[1.5rem] mx-auto mb-6 flex items-center justify-center
                      shadow-[var(--shadow-card)] transition-all duration-500"
             style={{
               background: 'var(--gradient-primary)'
             }}>
          <span className="text-4xl">✓</span>
        </div>
        <p className="text-foreground font-medium text-lg">No skin conditions detected</p>
        <p className="text-muted-foreground text-sm mt-2">Your skin looks clear!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-xl font-semibold text-foreground">
        Detected Conditions
      </h3>
      <div className="flex flex-wrap gap-3">
        {conditions.map((condition, index) => (
          <div
            key={index}
            className="px-6 py-3 text-sm font-semibold rounded-[1.25rem]
                     shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)]
                     border border-primary/20 hover:border-primary/40
                     transition-all duration-500 hover:scale-105 cursor-default"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--accent) / 0.15))',
              backdropFilter: 'blur(8px)'
            }}
          >
            {condition}
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 rounded-[1.25rem] border border-muted"
           style={{
             background: 'hsl(var(--muted) / 0.3)',
             backdropFilter: 'blur(8px)'
           }}>
        <p className="text-xs text-muted-foreground leading-relaxed">
          * This is an automated detection. Please consult a healthcare professional for accurate diagnosis.
        </p>
      </div>
    </div>
  );
};
