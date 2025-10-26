export default function Button({ text, onClick }) {
    return (
        <>
            <button
                onClick={onClick}
                type="button"
                className="text-white bg-[#24292F] hover:bg-[#24292F]/90 
                           focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 
                           font-medium rounded-lg text-md px-7 py-2 text-center inline-flex 
                           items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 
                           me-2 mb-2 border border-zinc-700"
            >
                {text}
            </button>
        </>
    );
}
