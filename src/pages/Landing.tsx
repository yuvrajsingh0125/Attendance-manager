import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Shield, Sparkles } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Student Portal",
      description: "Manage your credit card, fees, attendance, and library access",
      icon: GraduationCap,
      path: "/login?role=student",
      gradient: "from-primary to-accent"
    },
    {
      title: "Teacher Portal",
      description: "Mark attendance, manage classes, and monitor student progress",
      icon: BookOpen,
      path: "/login?role=teacher",
      gradient: "from-accent to-primary"
    },
    {
      title: "Admin Portal",
      description: "Complete system management and analytics dashboard",
      icon: Shield,
      path: "/login?role=admin",
      gradient: "from-primary via-accent to-primary"
    }
  ];

  return (
    <div className="min-h-screen cosmic-bg relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-foreground rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block mb-6">
            <Sparkles className="w-16 h-16 text-primary animate-pulse-glow mx-auto mb-4" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
            RFID Smart Card
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Management System
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your unified campus solution for attendance, payments, library, and access control
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role, index) => (
            <Card
              key={role.title}
              className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in-up overflow-hidden relative"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(role.path)}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="p-8 relative z-10">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {role.title}
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  {role.description}
                </p>
                
                <Button 
                  className="w-full group-hover:shadow-lg group-hover:shadow-primary/50 transition-all"
                  variant="default"
                >
                  Access Portal
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-24 text-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <h3 className="text-3xl font-bold mb-12">Powered by Cosmic Technology</h3>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: "RFID Enabled", value: "99.9%" },
              { label: "Active Users", value: "10K+" },
              { label: "Transactions", value: "1M+" },
              { label: "Uptime", value: "24/7" }
            ].map((stat, index) => (
              <div key={stat.label} className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
    </div>
  );
};

export default Landing;
