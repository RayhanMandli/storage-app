import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeletePopup from "./components/DeletePopup";
import ChangeRoleModal from "./components/ChangeRoleModal";

export default function AllUsers() {
    const BASE_URL = "http://localhost:4000";
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [roleChangeError, setRoleChangeError] = useState("");
    const [userToDelete, setUserToDelete] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showDeletedUsers, setShowDeletedUsers] = useState(false);
    const [deletedUsers, setDeletedUsers] = useState([]);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [userToChangeRole, setUserToChangeRole] = useState(null);
    const [currentUser, setCurrentUser] = useState({});
    const navigate = useNavigate();
    const canViewData = currentUser.role === "admin" || currentUser.role === "owner";

    const handleLogout = async (userId) => {
        try {
            const res = await fetch(`${BASE_URL}/user/logout/${userId}`, {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                setUsers((prevUsers) => {
                    return prevUsers.map((user) => {
                        if (user._id === userId) {
                            return { ...user, isLoggedIn: false };
                        }
                        return user;
                    });
                });
            }
        } catch (error) {
            console.error("Failed to log out user:", error);
        }
        // Example: fetch(`${BASE_URL}/user/logout/${userId}`, { method: 'POST', credentials: 'include' })
    };
    const handleDelete = async (userId, userName) => {
        if (
            window.confirm(
                `Are you sure you want to delete user "${userName}"?`
            )
        ) {
            try {
                const res = await fetch(`${BASE_URL}/user/delete/${userId}`, {
                    method: "PATCH",
                    credentials: "include",
                });
                if (res.ok) {
                    setUsers((prevUsers) => {
                        return prevUsers.filter((user) => user._id !== userId);
                    });
                }
            } catch (error) {
                console.error("Failed to log out user:", error);
            }
        }
    };
    const handleHardDelete = async (userId) => {
        try {
            const res = await fetch(`${BASE_URL}/user/delete/${userId}/hard`, {
                method: "DELETE",
                credentials: "include",
            });
            if (res.ok) {
                setUsers((prevUsers) => {
                    return prevUsers.filter((user) => user._id !== userId);
                });
            }
        } catch (error) {
            console.error("Failed to log out user:", error);
        }
    };

    const handleRecover = async (userId, userName) => {
        if (
            window.confirm(
                `Are you sure you want to recover user "${userName}"?`
            )
        ) {
            try {
                const res = await fetch(`${BASE_URL}/user/recover/${userId}`, {
                    method: "PATCH",
                    credentials: "include",
                });
                if (res.ok) {
                    setDeletedUsers((prevUsers) => {
                        return prevUsers.filter((user) => user._id !== userId);
                    });
                    // Refresh active users list
                    const response = await fetch(`${BASE_URL}/user/all`, {
                        credentials: "include",
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUsers(data.users);
                    }
                }
            } catch (error) {
                console.error("Failed to recover user:", error);
            }
        }
    };

    const fetchDeletedUsers = async () => {
        try {
            const response = await fetch(`${BASE_URL}/user/deleted`, {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setDeletedUsers(data.users);
            } else if (response.status === 403) {
                setError("Access denied. Owners only.");
            }
        } catch (err) {
            console.error("Failed to fetch deleted users:", err);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const res = await fetch(`${BASE_URL}/user/change-role/${userId}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newRole }),
            });
            const data = await res.json();
            if (res.ok) {
                refreshUsersList();
            } else {
                setRoleChangeError(data.error || "Failed to change user role.");
                console.log("Failed to change user role:", data.error);
            }
        } catch (err) {
            console.error("Failed to change user role 2:", err);
        }
    };

    const refreshUsersList = async () => {
        try {
            const response = await fetch(`${BASE_URL}/user/all`, {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
            }
        } catch (err) {
            console.error("Failed to refresh users list:", err);
        }
        setShowRoleModal(false);
        setUserToChangeRole(null);
    };

    useEffect(() => {
        async function fetchAllUsers() {
            try {
                const response = await fetch(`${BASE_URL}/user/all`, {
                    credentials: "include",
                });
                if (response.status === 401) {
                    setUsers([]);
                    navigate("/login");
                    return;
                }
                if (response.status === 403) {
                    setUsers([]);
                    setError("Access denied. Admins only.");
                    return;
                }
                const data = await response.json();
                console.log(data.users)
                setCurrentUser(data.currentUser);
                setUsers(data.users);
            } catch (err) {
                console.log(err);
            }
        }
        fetchAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const chip = (online) => (
        <span className="inline-flex items-center gap-2 text-sm font-medium">
            <span
                className={`h-2 w-2 rounded-full ${online ? "bg-green-500" : "bg-zinc-600"}`}
            />
            <span className={online ? "text-green-400" : "text-zinc-500"}>
                {online ? "Online" : "Offline"}
            </span>
        </span>
    );

    const primaryBtn = "inline-flex items-center justify-center px-3 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    const dangerBtn = "inline-flex items-center justify-center px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-500 transition-colors";
    const ghostBtn = "inline-flex items-center justify-center px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-6 space-y-6">
            {showDeletePopup && (
                <DeletePopup
                    open={showDeletePopup}
                    onCancel={() => {
                        setShowDeletePopup(false);
                    }}
                    onConfirm={() => {
                        handleHardDelete(userToDelete.id);
                        setShowDeletePopup(false);
                    }}
                    title="Confirm Hard Delete"
                    username={userToDelete.name}
                />
            )}
            {showRoleModal && userToChangeRole && (
                <ChangeRoleModal
                    open={showRoleModal}
                    userName={userToChangeRole.name}
                    currentRole={userToChangeRole.role}
                    onConfirm={(newRole) => {
                        handleRoleChange(userToChangeRole.id, newRole);
                    }}
                    onCancel={() => {
                        setShowRoleModal(false);
                        setUserToChangeRole(null);
                    }}
                    roleChangeError={roleChangeError}
                />
            )}

            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Link className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors" to={'/directory'}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                    <h2 className="text-2xl font-bold text-zinc-100">All Users</h2>
                    <p className="text-sm text-zinc-400">{currentUser.name} <span className="text-zinc-600">·</span> <span className="text-cyan-400">{currentUser.role}</span></p>
                </div>
                {currentUser.role === "owner" && (
                    <button
                        className={primaryBtn}
                        onClick={() => {
                            setShowDeletedUsers(!showDeletedUsers);
                            if (!showDeletedUsers && deletedUsers.length === 0) {
                                fetchDeletedUsers();
                            }
                        }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {showDeletedUsers ? "Show Active Users" : "Show Deleted Users"}
                    </button>
                )}
            </div>

            {error ? (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            ) : showDeletedUsers ? (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-zinc-100">Deleted Users</h3>
                    {deletedUsers.length === 0 ? (
                        <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-lg text-center">
                            <p className="text-sm text-zinc-500">No deleted users.</p>
                        </div>
                    ) : (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-zinc-800">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {deletedUsers.map(({ _id: id, name }) => (
                                        <tr key={id} className="hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-4 py-3 text-zinc-500">***{id.substring(16)}</td>
                                            <td className="px-4 py-3 text-zinc-100">{name}</td>
                                            <td className="px-4 py-3">
                                                <button className={primaryBtn} onClick={() => handleRecover(id, name)}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    Recover
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Action</th>
                                {canViewData && <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Data</th>}
                                {(currentUser.role === "admin" || currentUser.role === "owner") && (
                                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Admin</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {users.map(({ _id: id, name, isLoggedIn, email, role: userRole }) => (
                                <tr key={id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-4 py-3 text-zinc-500">***{id.substring(16)}</td>
                                    <td className="px-4 py-3 text-zinc-100 font-medium">{name}</td>
                                    <td className="px-4 py-3">{chip(isLoggedIn)}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            className={ghostBtn}
                                            disabled={!isLoggedIn}
                                            onClick={() => handleLogout(id, name)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </td>
                                    {canViewData && (
                                        <td className="px-4 py-3">
                                            <button
                                                className={primaryBtn}
                                                onClick={() =>
                                                    navigate(`/admin/users/${id}/data`, {
                                                        state: { userEmail: email, userName: name, userRole },
                                                    })
                                                }
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                View Data
                                            </button>
                                        </td>
                                    )}
                                    <td className="px-4 py-3 space-x-2">
                                        <button
                                            className={primaryBtn}
                                            onClick={() => {
                                                setUserToChangeRole({ id, name, role: userRole });
                                                setShowRoleModal(true);
                                            }}
                                            disabled={id === currentUser.id}
                                            title={id === currentUser.id ? "Cannot change your own role" : "Change user role"}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                            Change Role
                                        </button>
                                        {(currentUser.role === "admin" || currentUser.role === "owner") && (
                                            <>
                                                <button className={dangerBtn} onClick={() => handleDelete(id, name)}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                                <button
                                                    className={`${dangerBtn} bg-red-700 hover:bg-red-600`}
                                                    onClick={() => {
                                                        setUserToDelete({ id, name });
                                                        setShowDeletePopup(true);
                                                    }}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    Hard Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
