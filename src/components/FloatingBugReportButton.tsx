"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug } from "lucide-react";
import TicketForm from "./TicketForm";
import { usePathname } from "next/navigation";

const FloatingBugReportButton = () => {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated and is a regular user (not admin)
    const token = localStorage.getItem("token");
    if (!token) {
      setShowButton(false);
      return;
    }

    try {
      // Decode JWT token to get user role
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload.role || 'user';
      
      // Only show for regular users, not for admin or superadmin
      setShowButton(userRole === 'user');
    } catch (error) {
      setShowButton(false);
    }
  }, [pathname]);

  // Don't show on landing page or auth pages
  const hideOnPages = ["/", "/login", "/register", "/verify-email"];
  if (hideOnPages.includes(pathname) || !showButton) {
    return null;
  }

  return (
    <>
      {/* Minimal Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        whileHover={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-4 right-4 z-40"
      >
        <motion.button
          onClick={() => setShowTicketForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative p-2 bg-gray-700/80 hover:bg-gray-600 text-gray-300 hover:text-white rounded-full shadow-lg backdrop-blur-sm transition-all duration-200"
          aria-label="Report a bug"
          title="Report a bug"
        >
          <Bug className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* Ticket Form Modal */}
      <AnimatePresence>
        {showTicketForm && (
          <TicketForm
            onClose={() => setShowTicketForm(false)}
            onSuccess={() => {
              setShowTicketForm(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingBugReportButton;
