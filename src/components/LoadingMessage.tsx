export const LoadingSpinner = () => {
	return <div className="
		animate-spin
		border-4 border-transparent
		border-t-black dark:border-t-white
		w-4 h-4
		rounded-full
		m-2"></div>
}

export const LoadingMessage = (props: {message: string}) => <div className="text-center flex flex-col items-center">
	{props.message}
	<div className="animate-spin border-4 border-transparent border-t-white w-10 h-10 rounded-full m-4"></div>
</div>