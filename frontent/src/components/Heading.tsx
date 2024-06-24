export default function Heading({text, subHeading}:{text:string, subHeading:string}){
    return <div className="flex flex-col justify-between items-between">
        <div className="text-4xl font-bold text-black w-full text-center">{text}</div>
        <div className="text-md text-gray-400 pt-3 text-center">{subHeading}</div>
    </div>

}