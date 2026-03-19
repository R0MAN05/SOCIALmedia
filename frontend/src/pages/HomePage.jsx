import { useState } from "react";

import Posts from "../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");
	const [showCreatePost, setShowCreatePost] = useState(false);

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r-2 border-base-content/20 min-h-screen'>
				{/* Header */}
				<div className='flex w-full border-b-2 border-base-content/20 items-center'>
					<div className='flex flex-1'>
						<div
							className='flex justify-center flex-1 p-3 hover:bg-base-200 transition duration-300 cursor-pointer relative'
							onClick={() => setFeedType("forYou")}
						>
							For you
							{feedType === "forYou" && (
								<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
							)}
						</div>
						<div
							className='flex justify-center flex-1 p-3 hover:bg-base-200 transition duration-300 cursor-pointer relative'
							onClick={() => setFeedType("following")}
						>
							Following
							{feedType === "following" && (
								<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
							)}
						</div>
					</div>
				</div>

				{/* CREATE POST TRIGGER */}
				<div className='p-4 border-b-2 border-base-content/20'>
					{!showCreatePost ? (
						<button
							type='button'
							className='btn btn-primary btn-sm rounded-full'
							onClick={() => setShowCreatePost(true)}
						>
							Create a new post.
						</button>
					) : (
						<div className='space-y-3'>
							<div className='flex justify-end'>
								<button
									type='button'
									className='btn btn-ghost btn-xs'
									onClick={() => setShowCreatePost(false)}
								>
									Hide form
								</button>
							</div>
							<CreatePost />
						</div>
					)}
				</div>

				{/* POSTS */}
				<Posts feedType={feedType} />
			</div>
		</>
	);
};
export default HomePage;