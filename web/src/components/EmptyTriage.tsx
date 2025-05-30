import "../index.css"

type Props = {
    onClick: () => void
}

export function EmptyTriage({onClick} : Props) {
   return(
    <div className="flex justify-center items-center w-full h-[80vh]">
        <button
            className="px-6 py-4 bg-red-400 text-white rounded-[15px] hover:bg-red-500 shadow-md"
            onClick={onClick}
         >
            <h1 className="text-md font-bold">Create Triage Flow 🔗</h1>
         </button>
    </div>
   )
}