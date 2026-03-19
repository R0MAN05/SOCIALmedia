import { MdHomeFilled } from "react-icons/md";
import { MdPalette, MdCheck } from "react-icons/md";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { fetchAuthUser } from "../../utils/fetchAuthUser";
import { useTheme } from "../../utils/themeContext";

const SideBar = () => {
	const { theme, setTheme, themes } = useTheme();
	const [isThemeOpen, setIsThemeOpen] = useState(false);
	const themeMenuRef = useRef(null);
	const queryClient = useQueryClient();

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
				setIsThemeOpen(false);
			}
		};

		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});
	const { data: authUser } = useQuery({
		queryKey: ["authUser"],
		queryFn: fetchAuthUser,
		retry: false,
	});

	return (
		<div className='md:flex-[2_2_0] w-18 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r-2 border-base-content/20 w-20 md:w-full'>
				<Link to='/' className='flex justify-center md:justify-start w-full'>
					<span className='w-full px-1 md:px-2 py-2 text-[10px] sm:text-xs md:text-xl leading-tight text-center font-extrabold rounded-full hover:bg-base-200 wrap-break-word'>
						socialMedia
					</span>
				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-3 items-center hover:bg-base-200 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-8 h-8' />
							<span className='text-lg hidden md:block'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center hover:bg-base-200 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authUser?.username}`}
							className='flex gap-3 items-center hover:bg-base-200 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Profile</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<div className='relative' ref={themeMenuRef}>
							<button
								tabIndex={0}
								type='button'
								onClick={() => setIsThemeOpen((prev) => !prev)}
								className='flex gap-3 items-center hover:bg-base-200 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
							>
								<MdPalette className='w-6 h-6' />
								<span className='text-lg hidden md:block'>Theme</span>
								{isThemeOpen ? <MdKeyboardArrowUp className='w-5 h-5' /> : <MdKeyboardArrowDown className='w-5 h-5' />}
							</button>
							{isThemeOpen && (
								<div className='absolute left-0 md:left-4 top-full z-50 mt-2 p-2 shadow bg-base-100 rounded-box border border-base-300 w-52 h-60'>
									<div className='flex items-center gap-2 text-sm font-semibold mb-2'>
										<MdPalette className='w-4 h-4' />
										<span>Choose Theme</span>
									</div>
									<div className='flex flex-col gap-1 overflow-y-auto h-[calc(100%-2rem)] pr-1'>
										{themes.map((themeName) => (
											<button
												key={themeName}
												type='button'
												onClick={() => {
													setTheme(themeName);
													setIsThemeOpen(false);
												}}
												className={`btn btn-xs justify-between w-full ${theme === themeName ? "btn-primary" : "btn-outline"}`}
											>
												<span className='flex items-center gap-2'>
													<MdPalette className='w-3 h-3' />
													<span className='capitalize text-xs'>{themeName}</span>
												</span>
												{theme === themeName ? <MdCheck className='w-3 h-3' /> : <span className='w-3 h-3' />}
											</button>
										))}
									</div>
								</div>
							)}
						</div>
					</li>
				</ul>

				{authUser && (
					<Link
						to={`/profile/${authUser.username}`}
						className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-base-200 py-2 px-4 rounded-full'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-8 rounded-full'>
								<img src={authUser?.profileImg || "/avatar-placeholder.png"} />
							</div>
						</div>
						<div className='flex justify-between flex-1'>
							<div className='hidden md:block'>
								<p className='text-base-content font-bold text-sm w-20 truncate'>{authUser?.fullName}</p>
								<p className='text-base-content/60 text-sm'>@{authUser?.username}</p>
							</div>
							<BiLogOut
								className='w-5 h-5 cursor-pointer'
								onClick={(e) => {
									e.preventDefault();
									logout();
								}}
							/>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};
export default SideBar;