import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to login");

      queryClient.setQueryData(["authUser"], data);
      toast.success("Logged in successfully");
      setFormData({ username: "", password: "" });
      navigate("/");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className='max-w-7xl mx-auto flex h-screen px-10'>
      <div className='flex-1 hidden lg:flex items-center justify-center'>
        <div className='text-6xl font-extrabold text-base-content'>socialMedia</div>
      </div>
      <div className='flex-1 flex flex-col justify-center items-center'>
        <form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
          <div className='lg:hidden text-4xl font-extrabold text-base-content text-center mb-4 -mt-6'>socialMedia</div>
          <h1 className='text-4xl font-extrabold text-base-content'>Welcome back.</h1>
          <label className='input input-bordered rounded flex items-center gap-2 py-3'>
            <FaUser className='text-xl' />
            <input
              type='text'
              className='grow text-base'
              placeholder='Username'
              name='username'
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label className='input input-bordered rounded flex items-center gap-2 py-3'>
            <MdPassword className='text-xl' />
            <input
              type='password'
              className='grow text-base'
              placeholder='Password'
              name='password'
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>

          <button className='btn rounded-full btn-primary' disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </button>
          {error && <p className='text-error'>{error}</p>}
        </form>

        <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
          <p className='text-base-content text-lg'>Don&apos;t have an account?</p>
          <Link to='/signup'>
            <button className='btn rounded-full btn-primary btn-outline w-full'>Sign up</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;