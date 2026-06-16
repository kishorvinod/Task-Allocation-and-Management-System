import bcrypt from "bcrypt";
import { connectDB } from "../database/mongodb";
import { User } from "../modules/users/user.model";

async function run() {

    await connectDB();

    const exists =
        await User.findOne({
            email:
                "admin@test.com"
        });

    if (exists) {
        process.exit();
    }

    const password =
        await bcrypt.hash(
            "admin123",
            10
        );

    await User.create({
        name: "Admin",

        email:
            "admin@test.com",

        password,

        role: "admin"
    });

    console.log(
        "Admin Created"
    );

    process.exit();
}

run();