export const adminFileAccess = (req, res) => {
    const requester = req.user;
    const targetUserId = req.params.userId;
    const isSelf = requester._id.toString() === targetUserId.toString();
    
    res.send(`Get all files for user ${req.params.userId}`);
}
