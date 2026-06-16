import {
    useEffect,
    useState
} from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

import {
    getDashboardStats
} from "../../services/dashboard.service";

import {
    updateAvailability,
    updateSkills
} from "../../services/user.service";

interface DashboardStats {
    totalTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    totalUsers: number;
}

const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

export default function DashboardPage() {

    const { user, setUser } = useAuth();

    const [stats, setStats] =
        useState<DashboardStats | null>(
            null
        );

    const [loading, setLoading] =
        useState(true);

    const [showSkillsModal, setShowSkillsModal] =
        useState(false);

    const [
        showAvailabilityModal,
        setShowAvailabilityModal
    ] = useState(false);

    useEffect(() => {

        fetchDashboardData();

    }, []);

    const fetchDashboardData =
        async () => {

            try {

                const statsResponse =
                    await getDashboardStats();

                setStats(
                    statsResponse.data
                );

            } catch (error) {

                console.error(
                    "Dashboard Error",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

    if (loading) {

        return (
            <DashboardLayout>
                <h2>
                    Loading Dashboard...
                </h2>
            </DashboardLayout>
        );
    }

    const skills =
        user?.skills || [];

    const workingDays =
        user?.workingDays || [];

    const weeklyCapacity =
        (user?.availableHoursPerDay || 0) *
        workingDays.length;

    return (
        <DashboardLayout>

            <div className="page-header">
                <h1 className="page-title">
                    Dashboard
                </h1>
            </div>

            {user?.role === "admin" ? (
                <div className="panel">
                    <h2>
                        Admin Overview
                    </h2>

                    <div className="metric-grid">
                        <StatCard
                            title="Users"
                            value={
                                stats?.totalUsers || 0
                            }
                        />

                        <StatCard
                            title="Total Tasks"
                            value={
                                stats?.totalTasks || 0
                            }
                        />

                        <StatCard
                            title="Pending Tasks"
                            value={
                                stats?.pendingTasks ||
                                0
                            }
                        />

                        <StatCard
                            title="In Progress"
                            value={
                                stats
                                    ?.inProgressTasks ||
                                0
                            }
                        />

                        <StatCard
                            title="Completed"
                            value={
                                stats?.completedTasks ||
                                0
                            }
                        />
                    </div>
                </div>
            ) : (
                <>
                    <div className="panel">
                        <h2>
                            My Details
                        </h2>

                        <div className="metric-grid">
                            <ProfileItem
                                label="Name"
                                value={
                                    user?.name || "-"
                                }
                            />

                            <ProfileItem
                                label="Email"
                                value={
                                    user?.email || "-"
                                }
                            />

                            <ProfileItem
                                label="Daily Hours"
                                value={
                                    user
                                        ?.availableHoursPerDay ||
                                    0
                                }
                            />

                            <ProfileItem
                                label="Weekly Capacity"
                                value={weeklyCapacity}
                            />
                        </div>

                        <div
                            style={{
                                marginTop: "20px"
                            }}
                        >
                            <div className="section-heading">
                                <h3>
                                    Skills
                                </h3>

                                <button
                                    type="button"
                                    className="ghost-button"
                                    onClick={() =>
                                        setShowSkillsModal(
                                            true
                                        )
                                    }
                                >
                                    Edit Skills
                                </button>
                            </div>

                            {skills.length > 0 ? (
                                <div className="tag-list">
                                    {skills.map(
                                        (
                                            skill: string
                                        ) => (
                                            <span
                                                className="tag"
                                                key={skill}
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="muted">
                                    No skills added yet.
                                </p>
                            )}
                        </div>

                        <div
                            style={{
                                marginTop: "20px"
                            }}
                        >
                            <div className="section-heading">
                                <h3>
                                    Working Days
                                </h3>

                                <button
                                    type="button"
                                    className="ghost-button"
                                    onClick={() =>
                                        setShowAvailabilityModal(
                                            true
                                        )
                                    }
                                >
                                    Edit Availability
                                </button>
                            </div>

                            {workingDays.length > 0 ? (
                                <div className="tag-list">
                                    {workingDays.map(
                                        (
                                            day: string
                                        ) => (
                                            <span
                                                className="tag"
                                                key={day}
                                            >
                                                {day}
                                            </span>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="muted">
                                    Availability is not configured.
                                </p>
                            )}
                        </div>
                    </div>

                    <div
                        className="metric-grid"
                        style={{
                            marginTop: "22px"
                        }}
                    >
                        <StatCard
                            title="Total Tasks"
                            value={
                                stats?.totalTasks || 0
                            }
                        />

                        <StatCard
                            title="Pending Tasks"
                            value={
                                stats?.pendingTasks || 0
                            }
                        />

                        <StatCard
                            title="In Progress"
                            value={
                                stats
                                    ?.inProgressTasks ||
                                0
                            }
                        />

                        <StatCard
                            title="Completed"
                            value={
                                stats?.completedTasks ||
                                0
                            }
                        />
                    </div>

                    <SkillsModal
                        isOpen={showSkillsModal}
                        skills={skills}
                        onClose={() =>
                            setShowSkillsModal(false)
                        }
                        onSave={async (
                            nextSkills
                        ) => {
                            if (!user?._id) {
                                return;
                            }

                            const response =
                                await updateSkills(
                                    user._id,
                                    nextSkills
                                );

                            setUser(response.data);
                            setShowSkillsModal(false);
                        }}
                    />

                    <AvailabilityModal
                        isOpen={
                            showAvailabilityModal
                        }
                        availableHoursPerDay={
                            user?.availableHoursPerDay ||
                            0
                        }
                        workingDays={workingDays}
                        onClose={() =>
                            setShowAvailabilityModal(
                                false
                            )
                        }
                        onSave={async (
                            availableHoursPerDay,
                            nextWorkingDays
                        ) => {
                            if (!user?._id) {
                                return;
                            }

                            const response =
                                await updateAvailability(
                                    user._id,
                                    availableHoursPerDay,
                                    nextWorkingDays
                                );

                            setUser(response.data);
                            setShowAvailabilityModal(
                                false
                            );
                        }}
                    />
                </>
            )}

        </DashboardLayout>
    );
}

function SkillsModal({
    isOpen,
    skills,
    onClose,
    onSave
}: {
    isOpen: boolean;
    skills: string[];
    onClose: () => void;
    onSave: (skills: string[]) => Promise<void>;
}) {

    const [draftSkills, setDraftSkills] =
        useState<string[]>([]);

    const [newSkill, setNewSkill] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    useEffect(() => {

        if (isOpen) {
            setDraftSkills(skills);
            setNewSkill("");
        }

    }, [
        isOpen,
        skills
    ]);

    if (!isOpen) {
        return null;
    }

    const addSkill =
        () => {

            const trimmed =
                newSkill.trim();

            if (
                !trimmed ||
                draftSkills.includes(trimmed)
            ) {
                return;
            }

            setDraftSkills([
                ...draftSkills,
                trimmed
            ]);
            setNewSkill("");

        };

    const removeSkill =
        (skill: string) => {

            setDraftSkills(
                draftSkills.filter(
                    item =>
                        item !== skill
                )
            );

        };

    const save =
        async () => {

            try {
                setSubmitting(true);
                await onSave(draftSkills);
            } catch (error) {
                console.error(error);
                alert("Failed to update skills");
            } finally {
                setSubmitting(false);
            }

        };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>
                    Edit My Skills
                </h2>

                <div className="tag-list">
                    {draftSkills.map(
                        skill => (
                            <button
                                type="button"
                                className="ghost-button"
                                key={skill}
                                onClick={() =>
                                    removeSkill(skill)
                                }
                            >
                                {skill} remove
                            </button>
                        )
                    )}
                </div>

                <div
                    className="form-field"
                    style={{
                        marginTop: "16px"
                    }}
                >
                    <label>Add Skill</label>
                    <input
                        value={newSkill}
                        onChange={(event) =>
                            setNewSkill(
                                event.target.value
                            )
                        }
                        onKeyDown={(event) => {
                            if (
                                event.key ===
                                "Enter"
                            ) {
                                event.preventDefault();
                                addSkill();
                            }
                        }}
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={addSkill}
                    >
                        Add
                    </button>

                    <button
                        type="button"
                        onClick={save}
                        disabled={submitting}
                    >
                        Save
                    </button>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

function AvailabilityModal({
    isOpen,
    availableHoursPerDay,
    workingDays,
    onClose,
    onSave
}: {
    isOpen: boolean;
    availableHoursPerDay: number;
    workingDays: string[];
    onClose: () => void;
    onSave: (
        availableHoursPerDay: number,
        workingDays: string[]
    ) => Promise<void>;
}) {

    const [hours, setHours] =
        useState(0);

    const [days, setDays] =
        useState<string[]>([]);

    const [submitting, setSubmitting] =
        useState(false);

    useEffect(() => {

        if (isOpen) {
            setHours(availableHoursPerDay);
            setDays(workingDays);
        }

    }, [
        availableHoursPerDay,
        isOpen,
        workingDays
    ]);

    if (!isOpen) {
        return null;
    }

    const toggleDay =
        (day: string) => {

            setDays(
                days.includes(day)
                    ? days.filter(
                          item =>
                              item !== day
                      )
                    : [
                          ...days,
                          day
                      ]
            );

        };

    const save =
        async () => {

            try {
                setSubmitting(true);
                await onSave(
                    hours,
                    days
                );
            } catch (error) {
                console.error(error);
                alert("Failed to update availability");
            } finally {
                setSubmitting(false);
            }

        };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>
                    Edit My Availability
                </h2>

                <div className="form-field">
                    <label>
                        Available Hours Per Day
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={hours}
                        onChange={(event) =>
                            setHours(
                                Number(
                                    event.target
                                        .value
                                )
                            )
                        }
                    />
                </div>

                <div className="form-field">
                    <label>
                        Working Days
                    </label>

                    <div className="tag-list">
                        {weekDays.map(
                            day => (
                                <label
                                    key={day}
                                    className="tag"
                                    style={{
                                        cursor: "pointer"
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={days.includes(
                                            day
                                        )}
                                        onChange={() =>
                                            toggleDay(day)
                                        }
                                        style={{
                                            width: "auto",
                                            marginRight:
                                                "6px"
                                        }}
                                    />
                                    {day}
                                </label>
                            )
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={save}
                        disabled={submitting}
                    >
                        Save
                    </button>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

function ProfileItem({
    label,
    value
}: {
    label: string;
    value: string | number;
}) {

    return (
        <div className="metric-card">
            <h3>
                {label}
            </h3>

            <p
                style={{
                    margin: 0,
                    fontWeight: 700
                }}
            >
                {value}
            </p>
        </div>
    );
}

function StatCard({
    title,
    value
}: {
    title: string;
    value: number;
}) {

    return (
        <div className="metric-card">
            <h3>
                {title}
            </h3>

            <strong>
                {value}
            </strong>
        </div>
    );
}
