"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Trophy,
  Eye,
  Building2,
  MapPin,
  Calendar
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface Application {
  id: string;
  status: "PENDING" | "VIEWED" | "RESPONDED" | "INTERVIEW" | "REJECTED" | "OFFER";
  appliedAt: string;
  respondedAt: string | null;
  jobPosting: {
    title: string;
    company: string;
    location: string;
    platform: string;
    url: string;
  };
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    className: "status-pending",
  },
  VIEWED: {
    label: "Viewed",
    icon: Eye,
    className: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  },
  RESPONDED: {
    label: "Responded",
    icon: MessageSquare,
    className: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  },
  INTERVIEW: {
    label: "Interview",
    icon: CheckCircle,
    className: "status-success",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    className: "status-error",
  },
  OFFER: {
    label: "Offer!",
    icon: Trophy,
    className: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  },
};

// Demo data
const demoApplications: Application[] = [
  {
    id: "app-1",
    status: "PENDING",
    appliedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    respondedAt: null,
    jobPosting: {
      title: "Virtual Assistant",
      company: "TechStartup Inc.",
      location: "Remote",
      platform: "RemoteOK",
      url: "https://remoteok.com/job/123",
    },
  },
  {
    id: "app-2",
    status: "INTERVIEW",
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    jobPosting: {
      title: "Technical Assistant",
      company: "GlobalCorp",
      location: "Remote, USA",
      platform: "LinkedIn",
      url: "https://linkedin.com/jobs/view/123",
    },
  },
  {
    id: "app-3",
    status: "REJECTED",
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    jobPosting: {
      title: "AI Assistant Coordinator",
      company: "FutureTech Labs",
      location: "Remote",
      platform: "Indeed",
      url: "https://indeed.com/job/456",
    },
  },
  {
    id: "app-4",
    status: "PENDING",
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    respondedAt: null,
    jobPosting: {
      title: "Remote Support Specialist",
      company: "CloudServices Pro",
      location: "Worldwide",
      platform: "We Work Remotely",
      url: "https://weworkremotely.com/job/789",
    },
  },
];

export function ApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>(demoApplications);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setApplications(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };

    fetchApplications();
    const interval = setInterval(fetchApplications, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredApplications = filter === "all" 
    ? applications 
    : applications.filter(app => app.status === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="terminal-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-terminal-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-display font-semibold text-terminal-text">
            Job Applications
          </h3>
          
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {["all", "PENDING", "INTERVIEW", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                  filter === status
                    ? "bg-terminal-accent/20 text-terminal-accent border border-terminal-accent/50"
                    : "bg-terminal-surface text-terminal-muted border border-terminal-border hover:border-terminal-muted"
                }`}
              >
                {status === "all" ? "All" : statusConfig[status as keyof typeof statusConfig].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-terminal-border bg-terminal-surface/30">
              <th className="text-left p-4 text-xs font-medium text-terminal-muted uppercase tracking-wider">
                Position
              </th>
              <th className="text-left p-4 text-xs font-medium text-terminal-muted uppercase tracking-wider hidden md:table-cell">
                Company
              </th>
              <th className="text-left p-4 text-xs font-medium text-terminal-muted uppercase tracking-wider hidden lg:table-cell">
                Platform
              </th>
              <th className="text-left p-4 text-xs font-medium text-terminal-muted uppercase tracking-wider">
                Status
              </th>
              <th className="text-left p-4 text-xs font-medium text-terminal-muted uppercase tracking-wider hidden sm:table-cell">
                Applied
              </th>
              <th className="text-right p-4 text-xs font-medium text-terminal-muted uppercase tracking-wider">
                Link
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredApplications.map((app, index) => {
                const status = statusConfig[app.status];
                const StatusIcon = status.icon;
                
                return (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-terminal-border/50 hover:bg-terminal-surface/50 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-terminal-text">
                          {app.jobPosting.title}
                        </p>
                        <p className="text-xs text-terminal-muted mt-0.5 md:hidden">
                          {app.jobPosting.company}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-terminal-muted" />
                        <span className="text-terminal-text">{app.jobPosting.company}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="px-2 py-1 text-xs rounded bg-terminal-border text-terminal-muted">
                        {app.jobPosting.platform}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`status-badge ${status.className}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-terminal-muted">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={app.jobPosting.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-terminal-surface border border-terminal-border hover:border-terminal-accent hover:text-terminal-accent transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filteredApplications.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-terminal-muted">No applications found</p>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-terminal-border bg-terminal-surface/30">
        <div className="flex items-center justify-between text-xs text-terminal-muted">
          <span>Showing {filteredApplications.length} of {applications.length} applications</span>
          <button className="hover:text-terminal-accent transition-colors">
            View all →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

