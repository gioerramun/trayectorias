import React, { useState } from "react";
import computacion from "../data/computacion.json";
import Button from "./button.tsx";

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
		<div className="flex flex-col gap-4">
			{[...Array(8).keys()].map((i) => (
        		<article key={i + 1} id={(i + 1).toString()} className="border rounded-2xl p-3 w-full flex lg:flex-row md:flex-row flex-col gap-1 items-center">
					<h6 className="font-bold">{i + 1}º Semestre</h6>
					<div className="flex-1 flex flex-wrap justify-center gap-5">
					{subjects
            		.filter((subject) => subject.semester === i + 1)
            		.map((subject) => (
              			<Button
                			key={subject.name}
               				subject={subject}
                			status={statuses[subject.name] || "nothing"}
                			handleToggle={handleToggle}
                			disabled={!isEnabled(subject)}
              			/>
						))}
					</div>
        		</article>
      		))}
		</div>
	);
};

export default Previas;

