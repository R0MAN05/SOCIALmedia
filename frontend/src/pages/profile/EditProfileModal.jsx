import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useUpdateUserProfile from "../../components/hooks/useUpdateUserProfile";

const EditProfileModal = ({ authUser }) => {
	const getInitialFormData = () => ({
		fullName: authUser?.fullName || "",
		username: authUser?.username || "",
		email: authUser?.email || "",
		bio: authUser?.bio || "",
		links: authUser?.links || authUser?.link || "",
		newPassword: "",
		currentPassword: "",
	});

	const [formData, setFormData] = useState({
		...getInitialFormData(),
	});

	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { mutate: deleteAccount, isPending: isDeletingAccount } = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/users/delete", { method: "DELETE" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to delete account");
			return data;
		},
		onSuccess: (data) => {
			toast.success(data?.message || "Account deleted successfully");
			queryClient.setQueryData(["authUser"], null);
			navigate("/login");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleDeleteAccount = () => {
		const confirmed = window.confirm("Are you sure you want to permanently delete your account?");
		if (!confirmed) return;
		deleteAccount();
	};

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => {
					setFormData(getInitialFormData());
					document.getElementById("edit_profile_modal").showModal();
				}}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-base-300 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-base-300 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-base-300 rounded p-2 input-md'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-base-300 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-base-300 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-base-300 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-base-300 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-base-300 rounded p-2 input-md'
							value={formData.links}
							name='links'
							onChange={handleInputChange}
						/>
						<button className='btn btn-primary rounded-full btn-sm'>
							{isUpdatingProfile ? "Updating..." : "Update"}
						</button>
						<button
							type='button'
							className='btn btn-error btn-outline rounded-full btn-sm'
							disabled={isDeletingAccount}
							onClick={handleDeleteAccount}
						>
							{isDeletingAccount ? "Deleting..." : "Delete Account"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;