
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import GlassCard from "@/components/ui/GlassCard";
import { Shield, AlertTriangle, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ActivityLog {
  id: string;
  action: string;
  entity_type?: string;
  details?: any;
  ip_address?: string;
  created_at: string;
  success: boolean;
}

const AccountActivityLogs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [suspicious, setSuspicious] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchActivityLogs();
    }
  }, [user]);

  const fetchActivityLogs = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("user_activity_logs")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      setLogs(data || []);
      
      // Basic suspicious activity detection
      // In a real implementation, this would be much more sophisticated
      const suspiciousActivities = [];
      const ipMap = new Map();
      const uniqueIPs = new Set();
      
      data?.forEach(log => {
        if (log.ip_address) {
          uniqueIPs.add(log.ip_address);
          
          if (!ipMap.has(log.ip_address)) {
            ipMap.set(log.ip_address, []);
          }
          
          ipMap.get(log.ip_address).push(log);
        }
        
        // Flag failed login attempts
        if (log.action === "user.login" && !log.success) {
          suspiciousActivities.push(log.id);
        }
      });
      
      // Flag logins from multiple IPs in a short time period
      if (uniqueIPs.size > 2) {
        const recentLoginIPs = data
          ?.filter(log => 
            log.action === "user.login" && 
            new Date(log.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
          )
          .map(log => log.ip_address);
          
        const uniqueRecentIPs = new Set(recentLoginIPs);
        
        if (uniqueRecentIPs.size > 2) {
          suspiciousActivities.push(...data
            ?.filter(log => 
              log.action === "user.login" && 
              uniqueRecentIPs.has(log.ip_address)
            )
            .map(log => log.id)
          );
        }
      }
      
      setSuspicious(suspiciousActivities);
      
    } catch (error: any) {
      console.error("Error fetching activity logs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch activity logs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActionLabel = (action: string): string => {
    switch (action) {
      case "user.login":
        return "Login";
      case "user.logout":
        return "Logout";
      case "user.password_change":
        return "Password Changed";
      case "user.update":
        return "Account Updated";
      case "user.recovery":
        return "Password Recovery";
      default:
        return action.replace("user.", "").split("_").map(
          word => word.charAt(0).toUpperCase() + word.slice(1)
        ).join(" ");
    }
  };

  const isSuspicious = (logId: string): boolean => {
    return suspicious.includes(logId);
  };

  return (
    <GlassCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Account Activity</h3>
              <p className="text-sm text-muted-foreground">
                Recent account activity and login history
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchActivityLogs} disabled={isLoading}>
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading activity logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No activity logs found</p>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className={isSuspicious(log.id) ? "bg-red-50" : ""}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {isSuspicious(log.id) && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span>{getActionLabel(log.action)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{format(new Date(log.created_at), "MMM d, yyyy h:mm a")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{log.ip_address || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        log.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {log.success ? "Success" : "Failed"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {suspicious.length > 0 && (
          <div className="mt-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h4 className="font-medium text-yellow-800">Suspicious Activity Detected</h4>
              </div>
              <p className="mt-2 text-sm text-yellow-700">
                We've detected some unusual account activity. If you don't recognize these actions, 
                please change your password immediately and enable two-factor authentication.
              </p>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default AccountActivityLogs;
