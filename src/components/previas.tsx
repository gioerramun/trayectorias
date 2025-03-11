import React, { useState } from "react";
import computacion from "../data/computacion.json";

//------------INTERFACE PARA MATERIAS
interface Subject {
	name: string;
	previasExam: string[];
	previasApproved: string[];
}

//------------BUTTON COMPONENT
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
			className={`border p-2 text-black transition-all ${
				disabled
					? "bg-gray-300"
					: status === "nothing" ? "bg-red-200" : status === "course" ? "bg-yellow-200" : "bg-green-200"}`}>
			{subject.name}
		</button>
	);
};

//------------PREVIAS COMPONENT
const Previas: React.FC = () => {
	const [subjects] = useState<Subject[]>(computacion);
	const [statuses, setStatuses] = useState<{ [key: string]: string }>({});
  
	const handleToggle = (subjectName: string, newStatus: string) => {
		let updatedStatuses = { ...statuses, [subjectName]: newStatus };
		if (newStatus === "nothing") {
		  subjects.forEach((subject) => {
			if (subject.previasExam.includes(subjectName) || subject.previasApproved.includes(subjectName)) {
			  updatedStatuses[subject.name] = "nothing";
			}
		  });
		}
		setStatuses(updatedStatuses);
	};

	const isEnabled = (subject: Subject) => {
		return (
		  subject.previasExam.every((prev) => statuses[prev] === "exam") &&
		  subject.previasApproved.every((prev) => ["course", "exam"].includes(statuses[prev]))
		);
	  };
	

	return (
		<div>
			<h1>Lista de Materias</h1>
			<div className="flex flex-col gap-2">
				{subjects.map((subject) => (
					<Button
						key={subject.name}
						subject={subject}
						status={statuses[subject.name] || "nothing"}
						handleToggle={handleToggle}
						disabled={!isEnabled(subject)}
					/>
				))}
			</div>
		</div>
	);
};

export default Previas;
