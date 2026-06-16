import {
    useEffect,
    useState
} from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getUsers,
    updateSkills,
    updateAvailability
} from "../../services/user.service";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    skills: string[];
    availableHoursPerDay: number;
    workingDays: string[];
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

export default function UsersPage() {

    const [users, setUsers] =
        useState<User[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [skillsUser, setSkillsUser] =
        useState<User | null>(null);

    const [
        availabilityUser,
        setAvailabilityUser
    ] = useState<User | null>(null);

    useEffect(() => {

        loadUsers();

    }, []);

    const loadUsers =
        async () => {

            try {

                const response =
                    await getUsers();

                setUsers(
                    response.data
                );

            } finally {

                setLoading(false);

            }
        };

    return (
        <DashboardLayout>

            <div className="page-header">
                <h1 className="page-title">
                    Users
                </h1>
            </div>

            <div className="panel">
                {loading ? (
                    <h3>
                        Loading...
                    </h3>
                ) : (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Skills</th>
                                    <th>Availability</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map(
                                    (
                                        user
                                    ) => (
                                        <tr
                                            key={
                                                user._id
                                            }
                                        >
                                            <td>
                                                {
                                                    user.name
                                                }
                                            </td>

                                            <td>
                                                {
                                                    user.email
                                                }
                                            </td>

                                            <td>
                                                {
                                                    user.role
                                                }
                                            </td>

                                            <td>
                                                {user.skills
                                                    .length > 0 ? (
                                                    <div className="tag-list">
                                                        {user.skills.map(
                                                            (
                                                                skill
                                                            ) => (
                                                                <span
                                                                    className="tag"
                                                                    key={
                                                                        skill
                                                                    }
                                                                >
                                                                    {skill}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="muted">
                                                        No skills
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                <strong>
                                                    {
                                                        user.availableHoursPerDay
                                                    }{" "}
                                                    hrs/day
                                                </strong>
                                                <div className="muted">
                                                    {user.workingDays
                                                        .length >
                                                    0
                                                        ? user.workingDays.join(
                                                              ", "
                                                          )
                                                        : "No working days"}
                                                </div>
                                            </td>

                                            <td>
                                                <div className="action-row">
                                                    <button
                                                        onClick={() =>
                                                            setSkillsUser(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        Skills
                                                    </button>

                                                    <button
                                                        className="secondary-button"
                                                        onClick={() =>
                                                            setAvailabilityUser(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        Availability
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <SkillsModal
                user={skillsUser}
                onClose={() =>
                    setSkillsUser(null)
                }
                onSave={async (
                    skills
                ) => {
                    if (!skillsUser) {
                        return;
                    }

                    await updateSkills(
                        skillsUser._id,
                        skills
                    );

                    setSkillsUser(null);
                    loadUsers();
                }}
            />

            <AvailabilityModal
                user={availabilityUser}
                onClose={() =>
                    setAvailabilityUser(null)
                }
                onSave={async (
                    availableHoursPerDay,
                    workingDays
                ) => {
                    if (!availabilityUser) {
                        return;
                    }

                    await updateAvailability(
                        availabilityUser._id,
                        availableHoursPerDay,
                        workingDays
                    );

                    setAvailabilityUser(null);
                    loadUsers();
                }}
            />

        </DashboardLayout>
    );
}

function SkillsModal({
    user,
    onClose,
    onSave
}: {
    user: User | null;
    onClose: () => void;
    onSave: (skills: string[]) => Promise<void>;
}) {

    const [skills, setSkills] =
        useState<string[]>([]);

    const [newSkill, setNewSkill] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    useEffect(() => {

        setSkills(user?.skills || []);
        setNewSkill("");

    }, [user]);

    if (!user) {
        return null;
    }

    const addSkill =
        () => {

            const trimmed =
                newSkill.trim();

            if (
                !trimmed ||
                skills.includes(trimmed)
            ) {
                return;
            }

            setSkills([
                ...skills,
                trimmed
            ]);
            setNewSkill("");

        };

    const removeSkill =
        (skill: string) => {

            setSkills(
                skills.filter(
                    item =>
                        item !== skill
                )
            );

        };

    const save =
        async () => {

            try {
                setSubmitting(true);
                await onSave(skills);
            } finally {
                setSubmitting(false);
            }

        };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>
                    Skills for {user.name}
                </h2>

                <div className="tag-list">
                    {skills.map(
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
    user,
    onClose,
    onSave
}: {
    user: User | null;
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

        setHours(
            user?.availableHoursPerDay || 0
        );
        setDays(
            user?.workingDays || []
        );

    }, [user]);

    if (!user) {
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
            } finally {
                setSubmitting(false);
            }

        };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>
                    Availability for {user.name}
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
                                            toggleDay(
                                                day
                                            )
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
