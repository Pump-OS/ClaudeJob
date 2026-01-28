"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Send, 
  CheckCircle, 
  XCircle, 
  Mail, 
  AlertCircle,
  Brain,
  Zap,
  ExternalLink
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityLog {
  id: string;
  type: "SEARCH_STARTED" | "JOB_FOUND" | "APPLICATION_SENT" | "APPLICATION_FAILED" | "EMAIL_RECEIVED" | "STATUS_UPDATED" | "AGENT_THINKING" | "ERROR";
  message: string;
  metadata?: {
    company?: string;
    jobTitle?: string;
    platform?: string;
    url?: string;
  };
  createdAt: string;
}

interface LiveActivityFeedProps {
  isLive: boolean;
}

const activityConfig = {
  SEARCH_STARTED: {
    icon: Search,
    color: "text-blue-400",
    borderColor: "border-l-blue-400",
    bgColor: "bg-blue-400/10",
  },
  JOB_FOUND: {
    icon: Zap,
    color: "text-terminal-accent",
    borderColor: "border-l-terminal-accent",
    bgColor: "bg-terminal-accent/10",
  },
  APPLICATION_SENT: {
    icon: Send,
    color: "text-terminal-warning",
    borderColor: "border-l-terminal-warning",
    bgColor: "bg-terminal-warning/10",
  },
  APPLICATION_FAILED: {
    icon: AlertCircle,
    color: "text-terminal-error",
    borderColor: "border-l-terminal-error",
    bgColor: "bg-terminal-error/10",
  },
  EMAIL_RECEIVED: {
    icon: Mail,
    color: "text-purple-400",
    borderColor: "border-l-purple-400",
    bgColor: "bg-purple-400/10",
  },
  STATUS_UPDATED: {
    icon: CheckCircle,
    color: "text-emerald-400",
    borderColor: "border-l-emerald-400",
    bgColor: "bg-emerald-400/10",
  },
  AGENT_THINKING: {
    icon: Brain,
    color: "text-pink-400",
    borderColor: "border-l-pink-400",
    bgColor: "bg-pink-400/10",
  },
  ERROR: {
    icon: XCircle,
    color: "text-terminal-error",
    borderColor: "border-l-terminal-error",
    bgColor: "bg-terminal-error/10",
  },
};

// Demo activities for initial display
const demoActivities: ActivityLog[] = [
  {
    id: "demo-1",
    type: "SEARCH_STARTED",
    message: "Searching for Technical Assistant positions on RemoteOK...",
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    id: "demo-2",
    type: "JOB_FOUND",
    message: "Found: Virtual Assistant at TechStartup Inc.",
    metadata: { company: "TechStartup Inc.", jobTitle: "Virtual Assistant", platform: "RemoteOK" },
    createdAt: new Date(Date.now() - 1000 * 60 * 1.5).toISOString(),
  },
  {
    id: "demo-3",
    type: "AGENT_THINKING",
    message: "Analyzing job requirements and preparing application...",
    createdAt: new Date(Date.now() - 1000 * 60).toISOString(),
  },
  {
    id: "demo-4",
    type: "APPLICATION_SENT",
    message: "Application submitted to TechStartup Inc.",
    metadata: { company: "TechStartup Inc.", jobTitle: "Virtual Assistant" },
    createdAt: new Date(Date.now() - 1000 * 30).toISOString(),
  },
];

export function LiveActivityFeed({ isLive }: LiveActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityLog[]>(demoActivities);
  const [isThinking, setIsThinking] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  // Fetch real activities
  useEffect(() => {
    if (!isLive) return;

    const fetchActivities = async () => {
      try {
        const res = await fetch("/api/activities?limit=50");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setActivities(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Auto-scroll to bottom on new activities
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [activities]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="terminal-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-terminal-border bg-terminal-surface/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-terminal-error" />
            <div className="w-3 h-3 rounded-full bg-terminal-warning" />
            <div className="w-3 h-3 rounded-full bg-terminal-accent" />
          </div>
          <h3 className="text-sm font-medium text-terminal-text">
            live_activity_feed.log
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-1.5 text-xs text-terminal-accent"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-terminal-accent" />
              Recording
            </motion.div>
          )}
        </div>
      </div>

      {/* Feed */}
      <div 
        ref={feedRef}
        className="h-[400px] overflow-y-auto p-4 space-y-2 font-mono text-sm"
      >
        <AnimatePresence mode="popLayout">
          {activities.map((activity, index) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`log-entry ${config.borderColor} ${config.bgColor} rounded-r-lg`}
              >
                <div className={`flex-shrink-0 ${config.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-terminal-text break-words">
                      {activity.message}
                      {activity.type === "AGENT_THINKING" && (
                        <span className="typing-cursor" />
                      )}
                    </p>
                    <span className="flex-shrink-0 text-xs text-terminal-muted">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  {activity.metadata && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-terminal-muted">
                      {activity.metadata.platform && (
                        <span className="px-1.5 py-0.5 rounded bg-terminal-border">
                          {activity.metadata.platform}
                        </span>
                      )}
                      {activity.metadata.company && (
                        <span>{activity.metadata.company}</span>
                      )}
                      {activity.metadata.url && (
                        <a 
                          href={activity.metadata.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-terminal-accent"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Thinking indicator */}
        {isLive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-terminal-muted text-xs pt-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-3 h-3" />
            </motion.div>
            Agent is active and monitoring job boards...
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-terminal-border bg-terminal-surface/30">
        <div className="flex items-center gap-2 text-xs text-terminal-muted">
          <span className="text-terminal-accent">$</span>
          <span>Watching: LinkedIn, Indeed, RemoteOK, Glassdoor, We Work Remotely</span>
        </div>
      </div>
    </motion.div>
  );
}

