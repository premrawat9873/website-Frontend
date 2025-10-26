export default function Bottom({text,link,url}){
    return(
        <>
        <h1 className="text-white text-xl mb-4 text-center pr-1">{text}</h1>
        <a href={url} className="text-blue-500 text-xl mb-4 text-center underline decoration-blue-500  underline-offset-2">{link}</a>
        </>
        //umm
    )
}