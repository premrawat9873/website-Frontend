export default function InputField({placeholder, heading,onChange,type}){
    return(
        <>
            <label  className="block pl-1 mb-2 text-sm font-medium text-white dark:text-white">{heading}</label>
            <input onChange={onChange} type={type}  aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder}/>
        </>
    )
}