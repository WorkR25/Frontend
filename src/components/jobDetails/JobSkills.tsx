export default function JobSkills({skills}: {skills: {id: number, name: string}[]}){
    return (
        <div className="w-full p-4 flex flex-wrap items-center justify-center gap-2 border border-gray-200 rounded-xl bg-[#FFFF]">
            {skills.map((skill) => (
                <div key={skill.id} className=" p-2 rounded-2xl border bg-gray-100 border-gray-300 "> {skill.name}</div>
            ))}
        </div>
    )
}