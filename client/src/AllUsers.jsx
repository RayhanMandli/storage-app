import { useState, useEffect } from "react";
import "./Users.css";
import { useNavigate } from "react-router-dom";
import DeletePopup from "./components/DeletePopUp";
import ChangeRoleModal from "./components/ChangeRoleModal";

export default function AllUsers() {
    const BASE_URL = "http://localhost:4000";
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [userToDelete, setUserToDelete] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showDeletedUsers, setShowDeletedUsers] = useState(false);
    const [deletedUsers, setDeletedUsers] = useState([]);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [userToChangeRole, setUserToChangeRole] = useState(null);
    const [currentUser, setCurrentUser] = useState({});
    const navigate = useNavigate();

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
                setCurrentUser(data.currentUser);
                setUsers(data.users);
            } catch (err) {
                console.log(err);
            }
        }
        fetchAllUsers();
    }, []);
    return (
        <div>
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
                />
            )}
            {error ? (
                <p className="error">{error}</p>
            ) : (
                <div>
                    <h2>All Users</h2>
                    <div>
                        <p>{currentUser.name + " (" + currentUser.role + ")"}</p>
                        
                    </div>
                    {currentUser.role === "owner" && (
                        <button
                            className="filter-btn"
                            onClick={() => {
                                setShowDeletedUsers(!showDeletedUsers);
                                if (
                                    !showDeletedUsers &&
                                    deletedUsers.length === 0
                                ) {
                                    fetchDeletedUsers();
                                }
                            }}
                        >
                            {showDeletedUsers
                                ? "Show Active Users"
                                : "Show Deleted Users"}
                        </button>
                    )}
                    {showDeletedUsers ? (
                        <div>
                            <h3>Deleted Users</h3>
                            {deletedUsers.length === 0 ? (
                                <p>No deleted users.</p>
                            ) : (
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deletedUsers.map(
                                            ({ _id: id, name }) => (
                                                <tr key={id}>
                                                    <td
                                                        className="id"
                                                        data-label="ID"
                                                    >
                                                        {"***" +
                                                            id.substring(16)}
                                                    </td>
                                                    <td
                                                        className="name"
                                                        data-label="Name"
                                                    >
                                                        {name}
                                                    </td>
                                                    <td
                                                        className="action"
                                                        data-label="Action"
                                                    >
                                                        <button
                                                            className="recover-btn"
                                                            onClick={() =>
                                                                handleRecover(
                                                                    id,
                                                                    name
                                                                )
                                                            }
                                                        >
                                                            Recover
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ) : (
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                    {(currentUser.role === "admin" ||
                                        currentUser.role === "owner") && (
                                        <th>Admin</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(
                                    ({
                                        _id: id,
                                        name,
                                        isLoggedIn,
                                        role: userRole,
                                    }) => (
                                        <tr key={id}>
                                            <td className="id" data-label="ID">
                                                {"***" + id.substring(16)}
                                            </td>
                                            <td
                                                className="name"
                                                data-label="Name"
                                            >
                                                {name}
                                            </td>
                                            <td
                                                className="status"
                                                data-label="Status"
                                            >
                                                <span
                                                    className={`status ${
                                                        isLoggedIn
                                                            ? "status--online"
                                                            : "status--offline"
                                                    }`}
                                                >
                                                    <span className="status__dot"></span>
                                                    {isLoggedIn
                                                        ? "Online"
                                                        : "Offline"}
                                                </span>
                                            </td>
                                            <td
                                                className="action"
                                                data-label="Action"
                                            >
                                                <button
                                                    disabled={!isLoggedIn}
                                                    onClick={() =>
                                                        handleLogout(id, name)
                                                    }
                                                >
                                                    Logout
                                                </button>
                                            </td>
                                            <td
                                                className="action"
                                                data-label="Admin"
                                            >
                                                <button
                                                    className="role-btn"
                                                    onClick={() => {
                                                        setUserToChangeRole({
                                                            id,
                                                            name,
                                                            role: userRole,
                                                        });
                                                        setShowRoleModal(true);
                                                    }}
                                                    disabled={
                                                        id === currentUser.id   
                                                    }
                                                    title={
                                                        id === currentUser.id
                                                            ? "Cannot change your own role"
                                                            : "Change user role"
                                                    }
                                                >
                                                    Change Role
                                                </button>
                                            </td>
                                            {(currentUser.role === "admin" ||
                                                currentUser.role ===
                                                    "owner") && (
                                                <>
                                                    <td
                                                        className="action"
                                                        data-label="Admin"
                                                    >
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    id,
                                                                    name
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                    <td
                                                        className="action"
                                                        data-label="Admin"
                                                    >
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => {
                                                                setUserToDelete(
                                                                    {
                                                                        id,
                                                                        name,
                                                                    }
                                                                );
                                                                setShowDeletePopup(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            Hard Delete
                                                        </button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
