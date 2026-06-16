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

export default function UsersPage() {

    const [users, setUsers] =
        useState<User[]>([]);

    const [loading, setLoading] =
        useState(true);

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

    const handleEditSkills =
        async (
            user: User
        ) => {

            const value =
                prompt(
                    "Enter skills separated by comma",
                    user.skills.join(", ")
                );

            if (!value) {
                return;
            }

            await updateSkills(
                user._id,
                value
                    .split(",")
                    .map(
                        skill =>
                            skill.trim()
                    )
            );

            loadUsers();
        };

    const handleEditAvailability =
        async (
            user: User
        ) => {

            const hours =
                prompt(
                    "Available Hours Per Day",
                    String(
                        user.availableHoursPerDay
                    )
                );

            if (!hours) {
                return;
            }

            const days =
                prompt(
                    "Working Days (comma separated)",
                    user.workingDays.join(
                        ", "
                    )
                );

            if (!days) {
                return;
            }

            await updateAvailability(
                user._id,
                Number(hours),
                days
                    .split(",")
                    .map(
                        day =>
                            day.trim()
                    )
            );

            loadUsers();
        };

    return (
        <DashboardLayout>

            <h1>
                Users
            </h1>

            {loading ? (
                <h3>
                    Loading...
                </h3>
            ) : (

                <table
                    style={{
                        width: "100%",
                        marginTop: "20px",
                        borderCollapse:
                            "collapse"
                    }}
                >

                    <thead>

                        <tr>

                            <th style={header}>
                                Name
                            </th>

                            <th style={header}>
                                Email
                            </th>

                            <th style={header}>
                                Role
                            </th>

                            <th style={header}>
                                Skills
                            </th>

                            <th style={header}>
                                Hours
                            </th>

                            <th style={header}>
                                Actions
                            </th>

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

                                    <td style={cell}>
                                        {
                                            user.name
                                        }
                                    </td>

                                    <td style={cell}>
                                        {
                                            user.email
                                        }
                                    </td>

                                    <td style={cell}>
                                        {
                                            user.role
                                        }
                                    </td>

                                    <td style={cell}>
                                        {user.skills.join(
                                            ", "
                                        )}
                                    </td>

                                    <td style={cell}>
                                        {
                                            user.availableHoursPerDay
                                        }
                                    </td>

                                    <td style={cell}>

                                        <button
                                            onClick={() =>
                                                handleEditSkills(
                                                    user
                                                )
                                            }
                                        >
                                            Skills
                                        </button>

                                        <button
                                            style={{
                                                marginLeft:
                                                    "10px"
                                            }}
                                            onClick={() =>
                                                handleEditAvailability(
                                                    user
                                                )
                                            }
                                        >
                                            Availability
                                        </button>

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            )}

        </DashboardLayout>
    );
}

const header = {
    border: "1px solid #ddd",
    padding: "10px",
    background: "#f5f5f5"
};

const cell = {
    border: "1px solid #ddd",
    padding: "10px"
};