export default function SkillItem({skillName}: {skillName: string}) {
    return (
        <div className="w-full h-[30%] border-t border-b">
            <div className="p-2">
                {skillName}
            </div>
        </div>
    )
}