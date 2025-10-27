export default function Bottom({ text, link, url }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-6 px-4">
      <h1 className="text-white text-2xl font-semibold mb-3 tracking-wide drop-shadow-md">
        {text}
      </h1>
      <a
        href={url}

        className="
          relative text-blue-400 text-lg font-medium 
          transition-all duration-300 
          hover:text-blue-500 hover:scale-105 
          hover:drop-shadow-lg
          after:content-[''] after:absolute after:left-0 after:-bottom-1 
          after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
          hover:after:w-full
        "
      >
        {link}
      </a>
    </div>
  );
}
