import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Calendar as CalendarIcon, TrendingUp, AlertCircle, BookOpen, Calculator } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, onValue, set, runTransaction } from "firebase/database";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface AccessLog {
  uid: string;
  status: string;
  timestamp: number;
  date: string;
}

interface Stats {
  totalScans: number;
  granted: number;
  denied: number;
}

interface Subject {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
}

const INITIAL_SUBJECTS: Subject[] = [
  { id: "sub1", name: "Data Structures", totalClasses: 40, attendedClasses: 35 },
  { id: "sub2", name: "Algorithms", totalClasses: 38, attendedClasses: 30 },
  { id: "sub3", name: "Database Systems", totalClasses: 42, attendedClasses: 28 },
  { id: "sub4", name: "Operating Systems", totalClasses: 35, attendedClasses: 32 },
  { id: "sub5", name: "Computer Networks", totalClasses: 45, attendedClasses: 40 },
];

const Attendance = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [stats, setStats] = useState<Stats>({ totalScans: 0, granted: 0, denied: 0 });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { toast } = useToast();

  // New State for Features
  const [predictionMode, setPredictionMode] = useState(false);
  const [selectedFutureDates, setSelectedFutureDates] = useState<Date[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDateForManual, setSelectedDateForManual] = useState<Date | null>(null);

  useEffect(() => {
    const logsRef = ref(db, 'accessLogs');
    const statsRef = ref(db, 'stats');
    const subjectsRef = ref(db, 'subjects');

    const unsubscribeLogs = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const logsArray = Object.values(data) as AccessLog[];
        logsArray.sort((a, b) => b.timestamp - a.timestamp);
        setLogs(logsArray);
      } else {
        setLogs([]);
      }
    });

    const unsubscribeStats = onValue(statsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStats(data as Stats);
      }
    });

    const unsubscribeSubjects = onValue(subjectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSubjects(Object.values(data));
      } else {
        // Initialize if empty
        set(ref(db, 'subjects'), INITIAL_SUBJECTS);
      }
    });

    return () => {
      unsubscribeLogs();
      unsubscribeStats();
      unsubscribeSubjects();
    };
  }, []);

  const simulateScan = async () => {
    try {
      const timestamp = Date.now();
      const randomUid = Math.random().toString(16).slice(2, 10).toUpperCase();
      const isGranted = Math.random() > 0.1;

      await recordAttendance(timestamp, isGranted, randomUid);

      toast({
        title: "Scan Simulated",
        description: `Successfully simulated a ${isGranted ? "GRANTED" : "DENIED"} scan.`,
        variant: "default",
        className: "bg-green-500 text-white border-none"
      });

    } catch (error: any) {
      console.error("Simulation failed:", error);
      toast({
        title: "Simulation Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const recordAttendance = async (timestamp: number, isGranted: boolean, uid: string = "MANUAL") => {
    // 1. Add to accessLogs
    const logRef = ref(db, `accessLogs/${timestamp}`);
    await set(logRef, {
      uid: uid,
      status: isGranted ? "GRANTED" : "DENIED",
      timestamp: Math.floor(timestamp / 1000),
      date: Math.floor(timestamp / 1000).toString()
    });

    // 2. Update stats
    const statsRef = ref(db, 'stats');
    await runTransaction(statsRef, (currentStats) => {
      if (!currentStats) {
        return { totalScans: 1, granted: isGranted ? 1 : 0, denied: isGranted ? 0 : 1 };
      }
      return {
        totalScans: (currentStats.totalScans || 0) + 1,
        granted: (currentStats.granted || 0) + (isGranted ? 1 : 0),
        denied: (currentStats.denied || 0) + (isGranted ? 0 : 1)
      };
    });

    // 3. Update Random Subject (Simulating subject mapping)
    if (subjects.length > 0) {
      const randomSubjectIndex = Math.floor(Math.random() * subjects.length);
      const subject = subjects[randomSubjectIndex];
      const subjectRef = ref(db, `subjects/${randomSubjectIndex}`);

      await runTransaction(subjectRef, (currentSubject) => {
        if (!currentSubject) return subject;
        return {
          ...currentSubject,
          totalClasses: currentSubject.totalClasses + 1,
          attendedClasses: currentSubject.attendedClasses + (isGranted ? 1 : 0)
        };
      });
    }
  };

  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) return;
    setDate(selected);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedTime = new Date(selected);
    selectedTime.setHours(0, 0, 0, 0);

    if (predictionMode) {
      if (selectedTime <= today) {
        toast({
          title: "Invalid Selection",
          description: "You can only predict attendance for future dates.",
          variant: "destructive",
        });
        return;
      }

      // Toggle selection
      const exists = selectedFutureDates.find(d => d.getTime() === selectedTime.getTime());
      if (exists) {
        setSelectedFutureDates(prev => prev.filter(d => d.getTime() !== selectedTime.getTime()));
      } else {
        setSelectedFutureDates(prev => [...prev, selectedTime]);
      }
    } else {
      // Manual Entry Mode
      if (selectedTime > today) {
        toast({
          title: "Invalid Selection",
          description: "You cannot mark attendance for future dates manually.",
          variant: "destructive",
        });
        return;
      }
      setSelectedDateForManual(selected);
      setIsDialogOpen(true);
    }
  };

  const handleManualEntry = async (status: "GRANTED" | "DENIED") => {
    if (!selectedDateForManual) return;

    try {
      // Use the selected date's timestamp, but add current time to make it unique/ordered if needed
      // Or just use the date start
      const timestamp = selectedDateForManual.getTime();
      await recordAttendance(timestamp, status === "GRANTED", "MANUAL_ENTRY");

      setIsDialogOpen(false);
      toast({
        title: "Attendance Marked",
        description: `Successfully marked as ${status}.`,
        className: "bg-green-500 text-white border-none"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "GRANTED": return "text-success bg-success/20";
      case "DENIED": return "text-destructive bg-destructive/20";
      default: return "text-muted-foreground bg-muted/20";
    }
  };

  // Calculation Logic
  const projectedStats = {
    totalScans: stats.totalScans + selectedFutureDates.length,
    granted: stats.granted + selectedFutureDates.length, // Assuming user attends all selected future dates
    denied: stats.denied
  };

  const currentPercentage = stats.totalScans > 0
    ? Math.round((stats.granted / stats.totalScans) * 100)
    : 0;

  const projectedPercentage = projectedStats.totalScans > 0
    ? Math.round((projectedStats.granted / projectedStats.totalScans) * 100)
    : 0;

  const displayPercentage = predictionMode ? projectedPercentage : currentPercentage;
  const displayTotal = predictionMode ? projectedStats.totalScans : stats.totalScans;
  const displayGranted = predictionMode ? projectedStats.granted : stats.granted;

  const pieData = [
    { name: 'Present', value: displayGranted, color: '#22c55e' },
    { name: 'Absent', value: stats.denied, color: '#ef4444' },
  ];

  const calculateRequiredClasses = (attended: number, total: number) => {
    const currentPercentage = (attended / total);
    if (currentPercentage >= 0.75) return 0;
    return Math.ceil((0.75 * total - attended) / 0.25);
  };

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/student")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2 bg-muted/30 p-2 rounded-lg border border-white/10 relative z-10">
              <Switch
                id="prediction-mode"
                checked={predictionMode}
                onCheckedChange={(checked) => {
                  setPredictionMode(checked);
                  if (!checked) setSelectedFutureDates([]);
                }}
              />
              <Label
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => {
                  setPredictionMode(!predictionMode);
                  if (predictionMode) setSelectedFutureDates([]);
                }}
              >
                <Calculator className="w-4 h-4" />
                Prediction Mode
              </Label>
            </div>
            <Button onClick={simulateScan} variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Simulate Scan
            </Button>
          </div>
        </div>

        <h1 className="text-4xl font-bold gradient-text mb-8 animate-fade-in-up">Attendance Management System</h1>

        {/* Top Section: Pie Chart & Overall Stats */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Pie Chart */}
          <Card className={`glass-card p-6 flex flex-col items-center justify-center min-h-[300px] transition-all duration-300 ${predictionMode ? 'border-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.2)]' : ''}`}>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              {predictionMode ? (
                <>
                  <Calculator className="w-5 h-5 text-primary" />
                  Projected Attendance
                </>
              ) : (
                "Overall Attendance"
              )}
            </h3>
            <div className="w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
              <p className={`text-3xl font-bold ${predictionMode ? 'text-primary' : ''}`}>{displayPercentage}%</p>
              <p className="text-sm text-muted-foreground">
                {predictionMode ? "Projected Total" : "Total Attendance"}
              </p>
              {predictionMode && (
                <p className="text-xs text-muted-foreground mt-1">
                  (Assuming {selectedFutureDates.length} future classes attended)
                </p>
              )}
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            <Card className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Total Scans</p>
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <p className="text-4xl font-bold text-primary">{displayTotal}</p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Total classes recorded</p>
              </div>
            </Card>
            <Card className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Access Denied / Absent</p>
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <p className="text-4xl font-bold text-destructive">{stats.denied}</p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Classes missed or entry denied</p>
              </div>
            </Card>

            {/* 75% Rule Warning */}
            <Card className="glass-card p-6 md:col-span-2 border-l-4 border-l-warning">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-warning" />
                Attendance Requirement
              </h3>
              <p className="text-muted-foreground">
                Minimum 75% attendance is required to sit for exams.
                {displayPercentage < 75 ? (
                  <span className="text-destructive font-bold ml-1">
                    You are currently below the threshold!
                  </span>
                ) : (
                  <span className="text-success font-bold ml-1">
                    You are doing great!
                  </span>
                )}
              </p>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Subject-wise Attendance */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Subject Breakdown</h2>
            <div className="space-y-4">
              {subjects.map((subject, index) => {
                const percentage = Math.round((subject.attendedClasses / subject.totalClasses) * 100);
                const required = calculateRequiredClasses(subject.attendedClasses, subject.totalClasses);

                return (
                  <Card
                    key={subject.id}
                    className="glass-card p-6 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold text-lg">{subject.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {subject.attendedClasses} / {subject.totalClasses} classes
                        </p>
                      </div>
                      <div className={`text-2xl font-bold ${percentage >= 75 ? "text-success" : "text-destructive"
                        }`}>
                        {percentage}%
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2 mb-3" />

                    {required > 0 ? (
                      <p className="text-xs text-destructive font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Attend {required} more classes to reach 75%
                      </p>
                    ) : (
                      <p className="text-xs text-success font-medium">
                        Target met! Keep it up.
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Logs & Calendar */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Calendar</h2>
              <Card className="glass-card p-6">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  className="rounded-md"
                  modifiers={{
                    predicted: selectedFutureDates
                  }}
                  modifiersStyles={{
                    predicted: { color: 'var(--primary)', fontWeight: 'bold', border: '2px solid var(--primary)' }
                  }}
                />
                <div className="mt-4 text-sm text-muted-foreground">
                  {predictionMode ? (
                    <p>Select future dates to see how they impact your attendance.</p>
                  ) : (
                    <p>Click on past dates to manually mark attendance.</p>
                  )}
                </div>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
              <Card className="glass-card p-6">
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {logs.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No logs found</p>
                  ) : (
                    logs.map((log, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
                        style={{ animationDelay: `${Math.min(index * 0.05, 1)}s` }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{log.uid === "MANUAL_ENTRY" ? "Manual Entry" : "Gate Entry"}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {new Date(log.timestamp * 1000).toLocaleString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Attendance Entry</DialogTitle>
            <DialogDescription>
              Mark attendance for {selectedDateForManual?.toLocaleDateString()}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 py-4">
            <Button
              onClick={() => handleManualEntry("GRANTED")}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Mark Present
            </Button>
            <Button
              onClick={() => handleManualEntry("DENIED")}
              variant="destructive"
            >
              Mark Absent
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attendance;
