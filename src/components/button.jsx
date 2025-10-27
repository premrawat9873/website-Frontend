export default function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="
        text-white bg-[#24292F]
        hover:bg-[#1a1d21] 
        cursor-pointer
        font-medium rounded-lg text-md px-7 py-2 text-center inline-flex items-center
        border border-zinc-700
        shadow-md
        transition-all duration-300 ease-in-out
        hover:shadow-lg hover:scale-[1.02]
        focus:outline-none focus:ring-4 focus:ring-gray-600/40
      "
    >
      {text}
    </button>
  );
}
