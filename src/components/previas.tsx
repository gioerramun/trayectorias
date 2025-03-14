import React, { useState } from "react";
import computacion from "../data/computacion.json";

//------------INTERFACE PARA MATERIAS
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
			className={`border rounded-lg p-2 text-black font-[700] transition-all ${
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
		  subject.previasApproved.every((prev) => ["course", "exam"].includes(statuses[prev])) &&
		  (!subject.options || subject.options.some(
			(option) =>
			  option.previasExam.every((prev) => statuses[prev] === "exam") &&
			  option.previasApproved.every((prev) => ["course", "exam"].includes(statuses[prev]))
		  ))
		);
	  };

	return (
		<div>
			<div className="border flex flex-col gap-2">
			{[...Array(8).keys()].map((i) => (
        		<div key={i + 1} id={(i + 1).toString()} className="border rounded-2xl p-5 w-full flex flex-wrap gap-5 items-center justify-center">
          		{subjects
            		.filter((subject) => subject.semester === i + 1)
            		.map((subject) => (
              			<Button
                			key={subject.name}
               				subject={subject}
                			status={statuses[subject.name] || "nothing"}
                			handleToggle={handleToggle}
                			disabled={!isEnabled(subject)}
              			/>))}
        		</div>
      		))}
			</div>
		</div>
	);
};

export default Previas;

