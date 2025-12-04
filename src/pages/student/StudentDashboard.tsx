// src/pages/student/StudentDashboard.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  Calendar,
  DoorOpen,
  Bell,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth"; // <--- NEW IMPORT

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // <--- USE AUTH HOOK

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Redirect to landing page after logout
  };
  
  const stats = [
    { label: "Attendance", value: "87%", icon: Calendar, color: "text-accent" },
  ];

  const recentTransactions: any[] = []; // Cleared for now as we removed fees/canteen

  const quickActions = [
    { title: "Attendance", icon: Calendar, path: "/dashboard/student/attendance", gradient: "from-accent to-primary" },
    { title: "Gate Entry", icon: DoorOpen, path: "/dashboard/student/gate-entry", gradient: "from-warning to-accent" },
  ];

  return (
    <div className="min-h-screen cosmic-bg">
      {/* Header */}
      <header className="glass-card sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Student Portal</h1>
              <p className="text-sm text-muted-foreground">Welcome back, John!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}> {/* UPDATED LOGOUT */}
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Credit Card Display */}
        <Card className="glass-card p-8 mb-8 animate-fade-in-up relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">RFID SMART CARD</p>
                <p className="text-3xl font-bold gradient-text">COSMIC CARD</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-2">Card Number</p>
              <p className="text-2xl font-mono tracking-wider">1234 5678 9012 3456</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Card Holder</p>
                <p className="font-semibold">John Doe</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Valid Thru</p>
                <p className="font-semibold">12/27</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="glass-card p-6 animate-fade-in-up hover:scale-105 transition-transform"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                {/* @ts-ignore */}
                {typeof stat.value === 'number' && stat.max && (
                  <span className="text-2xl font-bold">{stat.value}</span>
                )}
                {typeof stat.value === 'string' && (
                  <span className="text-2xl font-bold">{stat.value}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              {/* @ts-ignore */}
              {typeof stat.value === 'number' && stat.max && (
                // @ts-ignore
                <Progress value={(stat.value / stat.max) * 100} className="h-2" />
              )}
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Card
                  key={action.title}
                  className="glass-card p-6 cursor-pointer hover:scale-105 transition-transform animate-fade-in-up group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(action.path)}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold group-hover:text-primary transition-colors">{action.title}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            <Card className="glass-card p-6">
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div>
                      <p className="font-medium">{transaction.type}</p>
                      <p className="text-xs text-muted-foreground">{transaction.location}</p>
                      <p className="text-xs text-muted-foreground">{transaction.time}</p>
                    </div>
                    <p className={`font-bold ${transaction.amount > 0 ? 'text-success' : 'text-destructive'}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </p>
                  </div>
                ))}
                {recentTransactions.length === 0 && (
                   <p className="text-muted-foreground text-center py-4">No recent activity.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;