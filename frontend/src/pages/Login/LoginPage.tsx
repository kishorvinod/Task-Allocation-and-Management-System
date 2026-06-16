import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, LoginFormData } from "./login.schema";
import { loginUser } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await loginUser(data.email, data.password);
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch {
            alert("Invalid credentials");
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input placeholder="Email" {...register("email")} />
                <p>{errors.email?.message}</p>

                <input
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                />
                <p>{errors.password?.message}</p>

                <button type="submit">Login</button>
            </form>
        </div>
    );
}