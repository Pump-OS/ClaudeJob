"use client";

import { motion } from "framer-motion";
import { Bot, MapPin, Mail, Phone, FileText, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface AgentData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export function AgentProfile() {
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await fetch("/api/agent");
        if (res.ok) {
          const data = await res.json();
          setAgent(data);
        }
      } catch (error) {
        console.error("Failed to fetch agent:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgent();
  }, []);

  // Demo data while loading or no real data
  const displayAgent = agent || {
    name: "Alex Morgan",
    email: "alex.morgan@clawdjob.ai",
    phone: "+1 (555) 123-4567",
    location: "Remote, USA",
    avatarUrl: null,
    createdAt: new Date().toISOString(),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="terminal-card-glow p-6"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-terminal-accent/30 to-terminal-accent/10 flex items-center justify-center border border-terminal-accent/50 overflow-hidden">
            {displayAgent.avatarUrl ? (
              <img 
                src={displayAgent.avatarUrl} 
                alt={displayAgent.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Bot className="w-8 h-8 text-terminal-accent" />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-terminal-accent flex items-center justify-center animate-pulse-glow">
            <Sparkles className="w-3 h-3 text-terminal-bg" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-display font-bold text-terminal-text truncate">
            {displayAgent.name}
          </h2>
          <p className="text-sm text-terminal-accent">
            AI Job Seeker Agent
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Mail className="w-4 h-4 text-terminal-muted flex-shrink-0" />
          <span className="text-terminal-text truncate">{displayAgent.email}</span>
        </div>
        {displayAgent.phone && (
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-terminal-muted flex-shrink-0" />
            <span className="text-terminal-text">{displayAgent.phone}</span>
          </div>
        )}
        {displayAgent.location && (
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-terminal-muted flex-shrink-0" />
            <span className="text-terminal-text">{displayAgent.location}</span>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="mt-6">
        <p className="text-xs text-terminal-muted uppercase tracking-wider mb-3">
          Target Positions
        </p>
        <div className="flex flex-wrap gap-2">
          {["Technical Assistant", "Virtual Assistant", "AI Assistant", "Remote Support"].map((skill) => (
            <span 
              key={skill}
              className="px-2 py-1 text-xs rounded-md bg-terminal-border text-terminal-text"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Resume Link */}
      <div className="mt-6 pt-4 border-t border-terminal-border">
        <button className="btn-primary w-full flex items-center justify-center gap-2">
          <FileText className="w-4 h-4" />
          View Resume
        </button>
      </div>
    </motion.div>
  );
}

