import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { notificationService } from '../../services/dashboardService';
import { Link } from 'react-router-dom';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      if (res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.warn('[Notifications] Could not fetch notifications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2.5 rounded-xl border border-brand-border bg-white text-brand-muted hover:text-brand-forest hover:border-brand-sage transition-all focus:outline-none"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-peach text-[10px] font-bold text-brand-forest shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-84 sm:w-96 rounded-2xl bg-white border border-brand-border shadow-elevated z-50 overflow-hidden animate-slide-in">
          <div className="flex items-center justify-between border-b border-brand-border px-5 py-3.5 bg-brand-ivory/60">
            <div className="flex items-center space-x-2">
              <span className="font-serif font-semibold text-brand-forest text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-brand-sage text-brand-primary px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-brand-primary hover:text-brand-hoverGreen flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-brand-border/60">
            {loading ? (
              <div className="p-6 text-center text-xs text-brand-muted">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-brand-muted flex flex-col items-center">
                <Bell className="w-8 h-8 text-brand-sage mb-2 stroke-1" />
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-4 transition-colors flex items-start gap-3 hover:bg-brand-ivory/40 ${
                    !n.isRead ? 'bg-brand-sage/20' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-brand-forest truncate">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-brand-muted flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
                      {n.message}
                    </p>
                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={() => setIsOpen(false)}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-brand-primary hover:underline"
                      >
                        View Details <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={(e) => handleMarkAsRead(n._id, e)}
                      title="Mark as read"
                      className="p-1 text-brand-muted hover:text-brand-primary rounded"
                    >
                      <span className="w-2 h-2 rounded-full bg-brand-primary block" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
