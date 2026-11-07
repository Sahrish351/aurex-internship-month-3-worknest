import React, { useState } from 'react';
import { Send, Trash2, Clock, Edit2, Check, X } from 'lucide-react';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const TaskComments = ({ taskId, initialComments = [], onCommentsUpdated }) => {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
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

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const handleSaveEdit = async (commentId) => {
    if (!editingText.trim()) return;
    try {
      const res = await taskService.updateComment(commentId, editingText.trim());
      const updated = comments.map((c) => (c._id === commentId ? res.data.comment : c));
      setComments(updated);
      setEditingCommentId(null);
      setEditingText('');
      if (onCommentsUpdated) onCommentsUpdated(updated);
      success('Comment updated successfully');
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to update comment');
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
            const canModify = isAuthor || isAdmin;
            const isEditing = editingCommentId === c._id;

            return (
              <div
                key={c._id}
                className="p-3 rounded-xl bg-brand-ivory/60 border border-brand-border/60 text-xs text-brand-forest flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-brand-forest text-brand-ivory flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {c.author?.name ? c.author.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-brand-forest truncate">{c.author?.name || 'User'}</span>
                      <span className="text-[10px] text-brand-muted flex items-center gap-0.5 flex-shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(c.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="mt-2 space-y-2">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-brand-primary bg-white text-xs text-brand-forest focus:outline-none"
                          autoFocus
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(c._id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-primary text-white text-[11px] font-semibold hover:bg-brand-hoverGreen"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-200 text-brand-forest text-[11px] hover:bg-gray-300"
                          >
                            <X className="w-3 h-3" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-brand-forest/90 leading-relaxed font-sans break-words">{c.text}</p>
                    )}
                  </div>
                </div>

                {canModify && !isEditing && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleStartEdit(c)}
                      className="p-1 text-brand-muted hover:text-brand-primary transition-colors"
                      title="Edit comment"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      className="p-1 text-brand-muted hover:text-red-600 transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
