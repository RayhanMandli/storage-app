const SESSION_TTL_SECONDS = 24 * 60 * 60;
const MAX_SESSIONS_PER_USER = 2;

const sessionKey = (sessionId) => `sess:${sessionId}`;
const userSessionsKey = (userId) => `user_sessions:${userId}`;

const parseSessionPayload = (rawSession) => {
    if (!rawSession) {
        return null;
    }

    try {
        return JSON.parse(rawSession);
    } catch {
        return null;
    }
};

const cleanupStaleSessions = async (redisClient, userId, sessionIds) => {
    const activeSessionIds = [];

    for (const sessionId of sessionIds) {
        const rawSession = await redisClient.get(sessionKey(sessionId));
        if (rawSession) {
            activeSessionIds.push(sessionId);
        } else {
            await redisClient.sRem(userSessionsKey(userId), sessionId);
        }
    }

    return activeSessionIds;
};

export const createSession = async (
    redisClient,
    userId,
    sessionData = {},
    ttlSeconds = SESSION_TTL_SECONDS,
) => {
    const sessionId = crypto.randomUUID();
    const payload = {
        userId: userId.toString(),
        createdAt: Date.now(),
        ...sessionData,
    };

    await redisClient.setEx(sessionKey(sessionId), ttlSeconds, JSON.stringify(payload));
    await redisClient.sAdd(userSessionsKey(userId), sessionId);
    await redisClient.expire(userSessionsKey(userId), ttlSeconds);

    return { sessionId, session: payload };
};

export const getSession = async (redisClient, sessionId) => {
    const rawSession = await redisClient.get(sessionKey(sessionId));
    return parseSessionPayload(rawSession);
};

export const getSessionCount = async (redisClient, userId) => {
    const sessionIds = await redisClient.sMembers(userSessionsKey(userId));
    const activeSessionIds = await cleanupStaleSessions(redisClient, userId, sessionIds);

    return activeSessionIds.length;
};

export const enforceSessionLimit = async (
    redisClient,
    userId,
    maxSessions = MAX_SESSIONS_PER_USER,
) => {
    const sessionIds = await redisClient.sMembers(userSessionsKey(userId));
    const activeSessionIds = await cleanupStaleSessions(redisClient, userId, sessionIds);

    if (activeSessionIds.length <= maxSessions) {
        return { evictedSessionIds: [] };
    }

    const sessions = await Promise.all(
        activeSessionIds.map(async (sessionId) => ({
            sessionId,
            session: await getSession(redisClient, sessionId),
        })),
    );

    sessions.sort((left, right) => {
        const leftCreatedAt = left.session?.createdAt ?? 0;
        const rightCreatedAt = right.session?.createdAt ?? 0;
        return leftCreatedAt - rightCreatedAt;
    });

    const sessionsToRemove = sessions.slice(0, sessions.length - maxSessions);
    const evictedSessionIds = [];

    for (const { sessionId } of sessionsToRemove) {
        evictedSessionIds.push(sessionId);
        await redisClient.del(sessionKey(sessionId));
        await redisClient.sRem(userSessionsKey(userId), sessionId);
    }

    return { evictedSessionIds };
};

export const deleteSession = async (redisClient, sessionId) => {
    const session = await getSession(redisClient, sessionId);

    if (session?.userId) {
        await redisClient.sRem(userSessionsKey(session.userId), sessionId);
    }

    await redisClient.del(sessionKey(sessionId));
    return session;
};

export const deleteAllSessionsForUser = async (redisClient, userId) => {
    const sessionIds = await redisClient.sMembers(userSessionsKey(userId));

    if (sessionIds.length > 0) {
        await Promise.all(sessionIds.map((sessionId) => redisClient.del(sessionKey(sessionId))));
    }

    await redisClient.del(userSessionsKey(userId));

    return sessionIds.length;
};
