
export default function InputBox({type, name, setFunction}:{label:string, type:string, name:string, setFunction:any}){
    return <div className="w-full mt-2">
        <div className="text-md font-medium">{name.charAt(0).toUpperCase() + name.slice(1)}</div>
        <input className="border-2 border-gray-300 pl-2 p-1 w-full rounded-md" placeholder={`Enter your ${name}`} type={type} onChange={e=>{setFunction(e.target.value)}}/>
    </div>
}