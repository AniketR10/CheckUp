import { useMutation, useQuery } from "@tanstack/react-query";
import { callForAssess, getQueue } from "../../service";
import clsx from "clsx";
import { TriageTags } from "../../types";
import PusherJs from "pusher-js";
import { useEffect } from "react";

const pusher  = new PusherJs('fb71023c8f1ef67c0a1b', {cluster: 'eu'})

export const colors = {
    [TriageTags.Emergency] : {
        background : "bg-red-100",
        label: "bg-red-500"
    },
    [TriageTags.Delayed] : {
        background:"bg-yellow-100",
        label:"bg-yellow-500"
    },
     [TriageTags.Minor] : {
        background : "bg-green-100",
        label: "bg-green-500"
    },
 };

export function LiveQueue() {
   
    const {data, isLoading, isError, refetch} = useQuery({
        queryKey: ['queue'],
        queryFn: getQueue
    });

 // console.log(data?.length)
const {mutate} = useMutation({
    mutationFn: callForAssess,
    onSuccess: () => refetch()
});

    useEffect(() => {
        const channel = pusher.subscribe("live-queue")
        channel.bind("patient-in", () => refetch())
        // return () => {
        //     channel.unsubscribe()
        // }
    },[])

    if (isError) {
        return <div>Error fetching queue</div>
    }

    if(!data?.length) {
        return (
            <div className="p-4 mt-20 flex justify-center items-center text-[20px]">
                {isLoading ? "Loading...⏳" : "There's no one in the queue"}
            </div>
        )
    }
 

    return (
        <div className="p-4 flex flex-col justify-center items-center max-w-[500px] mx-auto">
            <h1 className="mt-5 text-3xl font-bold  mb-4 animate-pulse"> 🚨 Live Queue 🚨</h1>
                <ul className="my-5 w-full">
                    
                   {data.map((patient) => (
  <div
    key={patient.number}
    className={clsx(
      "mb-8 flex flex-col justify-between items-center shadow-lg px-5 py-5 rounded-[20px]",
      colors[patient.assignedLabel].background
    )}
  >
    <div className="flex justify-between items-center full">
      <div className="flex flex-col items-center w-[20%]">
        <span className="text-gray-600 mb-2 text-sm">Patient</span>
        <div className="bg-black text-white rounded-[40px] font-bold text-[25px] px-5 py-1">
          #{patient.number}
        </div>
      </div>
      <div className="flex flex-col items-center w-[75%]">
        <span className="text-gray-600 mb-2 text-sm">Priority</span>
        <li
          className={clsx(
            "w-[80%] px-10 py-2 flex items-center justify-center rounded-[50px]",
            colors[patient.assignedLabel].label
          )}
        >
          <h2 className="text-[20px] font-bold">{patient.assignedLabel}</h2>
        </li>
      </div>
    </div>

    <button
      onClick={() => mutate(patient.number)}
      className="bg-white w-full mt-5 rounded-[50px] font-bold border-2 border-dashed border-gray-400 py-2 px-4 hover:bg-gray-500 hover:text-amber-100 transition-colors duration-100 ease-in-out cursor-pointer"
    >
      Call for Assessment 📢
    </button>
  </div>
))}

                </ul>
        </div>
    )

}