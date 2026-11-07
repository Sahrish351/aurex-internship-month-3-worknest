import React, { useState } from 'react';
import { Send, Trash2, Clock, User } from 'lucide-react';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const TaskComments = ({ taskId, initialComments = [], onCommentsUpdated }) => {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const res = await taskService.addComment(taskId, text);
      const newComment = res.data.comment;
      const updated = [...comments, newComment];
      setComments(updated);
      setText('');
      if (onCommentsUpdated) onCommentsUpdated(updated);
      success('Comment posted');
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await taskService.deleteComment(commentId);
      const updated = comments.filter((c) => c._id !== commentId);
      setComments(updated);
      if (onCommentsUpdated) onCommentsUpdated(updated);
      success('Comment removed');
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
        Discussion & Comments ({comments.length})
      </h4>

      {/* Comment Input */}
      <form onSubmit={handleAddComment} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment or status update..."
          className="flex-1 px-3.5 py-2 rounded-xl border border-brand-border text-xs text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-brand-ivory/30"
        />
        <button
          type="submit"
          disabled={submitting || !text.trim()}
          className="px-3.5 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-hoverGreen transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Post</span>
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-xs text-brand-muted italic py-2">No comments yet. Start the conversation!</p>
        ) : (
          comments.map((c) => {
            const isAuthor = c.author?._id === user?._id || c.author === user?._id;
            const isAdmin = user?.role === 'admin';

            return (
              <div
                key={c._id}
                className="p-3 rounded-xl bg-brand-ivory/60 border border-brand-border/60 text-xs text-brand-forest flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-brand-forest text-brand-ivory flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {c.author?.name ? c.author.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-brand-forest">{c.author?.name || 'User'}</span>
                      <span className="text-[10px] text-brand-muted flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(c.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-brand-forest/90 leading-relaxed font-sans">{c.text}</p>
                  </div>
                </div>

                {(isAuthor || isAdmin) && (
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-brand-muted hover:text-red-600 transition-all"
                    title="Delete comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
