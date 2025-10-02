import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Home, 
  BarChart3, 
  History, 
  User, 
  Menu, 
  Sparkles,
  Settings,
  Camera
} from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/history", label: "History", icon: History },
    { path: "/analytics", label: "Analytics", icon: Settings },
    { path: "/profile", label: "Profile", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ item, isMobile = false }: { item: typeof navItems[0], isMobile?: boolean }) => {
    const Icon = item.icon;
    return (
      <Link
        to={item.path}
        onClick={() => setIsOpen(false)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
          "hover:bg-primary/10 hover:scale-105",
          isActive(item.path)
            ? "bg-primary/20 text-primary shadow-lg"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Icon className={cn(
          "w-5 h-5 transition-all duration-300",
          isActive(item.path) ? "scale-110" : "group-hover:scale-110"
        )} />
        <span className="font-medium">{item.label}</span>
        {isActive(item.path) && (
          <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
        )}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                 style={{ background: 'var(--gradient-primary)' }}>
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">SkinAI</h1>
              <p className="text-xs text-muted-foreground">Acne Detection</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-primary/10"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                         style={{ background: 'var(--gradient-primary)' }}>
                      <Sparkles className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-foreground">SkinAI</h1>
                      <p className="text-xs text-muted-foreground">Acne Detection</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 space-y-2">
                  {navItems.map((item) => (
                    <NavItem key={item.path} item={item} isMobile />
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
