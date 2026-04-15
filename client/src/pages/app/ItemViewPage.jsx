import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/common/EmptyState";
import { storageApi } from "../../services/api/storageApi";
import { bytesToHuman, formatDate } from "../../utils/format";

export function ItemViewPage() {
    const navigate = useNavigate();
    const { type, id } = useParams();
    const location = useLocation();
    const [item, setItem] = useState(location.state?.item || null);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);
    const [activeTag, setActiveTag] = useState("");
    const summaryText = item?.summary || "";

    const summaryPoints = useMemo(() => {
        if (!summaryText) return [];

        return String(summaryText)
            .split("\n")
            .map((line) => line.replace(/^[-*•]\s*/, "").trim())
            .filter(Boolean);
    }, [summaryText]);

    useEffect(() => {
        const hydrateDirectory = async () => {
            if (item || type !== "directory") return;
            try {
                const { data } = await storageApi.getDirectory(id);
                setItem(data.directoryData);
            } catch {
                setItem(null);
            }
        };

        hydrateDirectory();
    }, [id, item, type]);

    if (!item) {
        return (
            <EmptyState
                title="Item details unavailable"
                description="Open this page from the directory to include item context."
                action={
                    <Button onClick={() => navigate("/app/directory/root")}>
                        Back To Directory
                    </Button>
                }
            />
        );
    }

    const isFile = type === "file";
    const isSharedWithMe = isFile && item?.sharedBy && item.sharedBy !== "self";
    const sharedRecipients = Array.isArray(item?.sharedWith)
        ? item.sharedWith
        : [];
    const aiStatus =
        item?.aiStatus || (item?.summary ? "completed" : "pending");
    const tags = Array.isArray(item?.tags) ? item.tags : [];

    return (
        <section className="mx-auto max-w-2xl space-y-4">
            <h1 className="text-3xl">
                {isFile ? "File Details" : "Directory Details"}
            </h1>
            <Card className="space-y-4 p-6">
                <Info
                    label={isFile ? "Filename" : "Folder Name"}
                    value={item.filename || item.name}
                />
                <Info label="ID" value={item._id} />
                {isFile ? (
                    <Info label="Size" value={bytesToHuman(item.filesize)} />
                ) : null}
                <Info label="Created" value={formatDate(item.createdAt)} />
                {isFile ? (
                    <Info label="Type" value={item.extension || "Unknown"} />
                ) : null}
                {isFile ? (
                    <Info
                        label="Ownership"
                        value={
                            isSharedWithMe ? "Shared with you" : "Owned by you"
                        }
                    />
                ) : null}
            </Card>

            {isFile && !isSharedWithMe ? (
                <Card className="space-y-3 p-6">
                    <h2 className="text-lg">Shared Access</h2>
                    {sharedRecipients.length ? (
                        <ul className="space-y-2">
                            {sharedRecipients.map((entry, idx) => {
                                const user = entry?.userId;
                                const userId =
                                    typeof user === "object" ? user?._id : user;
                                const email =
                                    typeof user === "object"
                                        ? user?.email
                                        : null;
                                const name =
                                    typeof user === "object"
                                        ? user?.name
                                        : null;
                                const permission =
                                    entry?.permission ||
                                    entry?.permissions ||
                                    "viewer";

                                return (
                                    <li
                                        key={`${String(userId || "unknown")}-${idx}`}
                                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                                    >
                                        <p className="text-sm font-medium text-zinc-100">
                                            {name || email || String(userId)}
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                            Permission: {permission}
                                        </p>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-sm text-zinc-400">
                            This file is not shared with anyone yet.
                        </p>
                    )}
                </Card>
            ) : null}

            {isFile ? (
                <Card className="space-y-4 p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    x="4"
                                    y="6"
                                    width="16"
                                    height="12"
                                    rx="4"
                                    fill="#18181B"
                                    stroke="#22D3EE"
                                    stroke-width="1.5"
                                />

                                <circle cx="9" cy="12" r="1.2" fill="#22D3EE" />
                                <circle
                                    cx="15"
                                    cy="12"
                                    r="1.2"
                                    fill="#22D3EE"
                                />

                                <path
                                    d="M9 15H15"
                                    stroke="#22D3EE"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                />

                                <line
                                    x1="12"
                                    y1="3"
                                    x2="12"
                                    y2="6"
                                    stroke="#22D3EE"
                                    stroke-width="1.5"
                                />
                                <circle cx="12" cy="2" r="1" fill="#22D3EE" />

                                <path
                                    d="M20 16V20L17 18H14C12.9 18 12 17.1 12 16V14C12 12.9 12.9 12 14 12H20C21.1 12 22 12.9 22 14V16Z"
                                    fill="#27272A"
                                    stroke="#22D3EE"
                                    stroke-width="1.2"
                                />
                            </svg>
                            <h2 className="text-lg">AI Summary</h2>
                        </div>
                        {aiStatus === "completed" && summaryPoints.length ? (
                            <button
                                type="button"
                                onClick={() =>
                                    setIsSummaryExpanded((prev) => !prev)
                                }
                                className="rounded-md border border-white/15 px-2 py-1 text-xs text-zinc-300 transition hover:bg-white/10"
                            >
                                {isSummaryExpanded ? "Collapse" : "Expand"}
                            </button>
                        ) : null}
                    </div>

                    {aiStatus === "pending" ? (
                        <div className="space-y-3">
                            <p className="text-sm text-zinc-300">
                                Generating summary...
                            </p>
                            <div className="space-y-2">
                                <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                                <div className="h-3 w-11/12 animate-pulse rounded bg-white/10" />
                                <div className="h-3 w-4/5 animate-pulse rounded bg-white/10" />
                            </div>
                        </div>
                    ) : aiStatus === "completed" && summaryPoints.length ? (
                        <ul
                            className={`${isSummaryExpanded ? "block" : "hidden"} list-disc space-y-2 pl-5 text-sm text-zinc-200`}
                        >
                            {summaryPoints.map((point, idx) => (
                                <li key={`${point}-${idx}`}>{point}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-zinc-400">
                            Summary not available
                        </p>
                    )}

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-zinc-200">
                            Tags
                        </h3>
                        {aiStatus === "pending" ? (
                            <div className="flex flex-wrap gap-2">
                                <div className="h-7 w-20 animate-pulse rounded-full bg-white/10" />
                                <div className="h-7 w-24 animate-pulse rounded-full bg-white/10" />
                                <div className="h-7 w-16 animate-pulse rounded-full bg-white/10" />
                            </div>
                        ) : tags.length ? (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => {
                                    const isActive = activeTag === tag;
                                    return (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() =>
                                                setActiveTag((prev) =>
                                                    prev === tag ? "" : tag,
                                                )
                                            }
                                            className={`rounded-full border px-2.5 py-1 text-xs transition ${
                                                isActive
                                                    ? "border-sky-300/50 bg-sky-400/20 text-sky-100"
                                                    : "border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10"
                                            }`}
                                        >
                                            #{tag}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-400">
                                No tags available
                            </p>
                        )}
                    </div>
                </Card>
            ) : null}

            <div className="flex flex-wrap gap-3">
                {!isSharedWithMe ? (
                    <Link
                        to={`/app/item/${type}/${id}/edit`}
                        state={{ item, type }}
                    >
                        <Button>Edit</Button>
                    </Link>
                ) : null}

                {isFile ? (
                    <>
                        <Button
                            variant="ghost"
                            onClick={() =>
                                window.open(
                                    storageApi.getViewUrl(id, "view"),
                                    "_blank",
                                )
                            }
                        >
                            View File
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() =>
                                window.open(
                                    storageApi.getViewUrl(id, "download"),
                                    "_blank",
                                )
                            }
                        >
                            Download
                        </Button>
                    </>
                ) : null}

                <Button variant="ghost" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </div>
        </section>
    );
}

function Info({ label, value }) {
    return (
        <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
                {label}
            </p>
            <p className="mt-1 break-all text-sm text-zinc-200">
                {value || "-"}
            </p>
        </div>
    );
}
