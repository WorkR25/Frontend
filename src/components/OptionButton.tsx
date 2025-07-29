export default function OptionButton({
  name,
  isActive,
}: {
  name: string;
  isActive: boolean;
}) {
  return (
    <button
      className={`w-fit whitespace-nowrap border rounded-lg px-3 py-1.5 border-[#868686] hover:cursor-pointer  hover:border-[#0471B6] ${
        isActive ? "text-[#D8FFFF] bg-[#0471B6] " : " text-[#868686] hover:text-[#0471B6]"
      } `}
    >
      {name}
    </button>
  );
}
