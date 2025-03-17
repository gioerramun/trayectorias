
interface Options {
	previasExam: string[];
	previasApproved: string[];
}

interface Subject {
	name: string;
	semester: number;
	previasExam: string[];
	previasApproved: string[];
	options?: Options[];
}

interface ButtonProps {
	subject: Subject;
	status: string;
	handleToggle: (subjectName: string, newStatus: string) => void;
	disabled: boolean;
}

const Button: React.FC<ButtonProps> = ({ subject, status, handleToggle, disabled }) => {
	const handleClick = () => {
		if (!disabled) {
			const newStatus = status === "nothing" ? "course" : status === "course" ? "exam" : "nothing";
			handleToggle(subject.name, newStatus);
		}
	};

	return (
		<button
			onClick={handleClick}
			disabled={disabled}
			className={`rounded-lg p-2 font-[700] backdrop-blur shadow-xl transition-all ${
				disabled
					? "bg-gray-500/50"
					: status === "nothing" ? "bg-red-500/40" : status === "course" ? "bg-yellow-400/40" : "bg-green-400/40"} `}>
			{subject.name}
		</button>
	);
};

export default Button;