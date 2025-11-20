import Notification from '@/models/Notification';

export async function createNotification({
  recipientId,
  senderId,
  type,
  postId = null,
  commentId = null,
  message
}) {
  try {
    // Jangan buat notif kalo user nge-action di post/profile sendiri
    if (recipientId.toString() === senderId.toString()) {
      return null;
    }

    // Check if notification already exists (prevent duplicates)
    const existingNotif = await Notification.findOne({
      recipient: recipientId,
      sender: senderId,
      type,
      post: postId,
      comment: commentId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    if (existingNotif) {
      // Update timestamp instead of creating new
      existingNotif.createdAt = new Date();
      existingNotif.isRead = false;
      await existingNotif.save();
      return existingNotif;
    }

    // Create new notification
    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      post: postId,
      comment: commentId,
      message,
      isRead: false
    });

    console.log('✅ Notification created:', type, 'from', senderId, 'to', recipientId);
    return notification;
  } catch (err) {
    console.error('❌ Error creating notification:', err);
    return null;
  }
}