import { ReactFlow, useReactFlow, type NodeProps } from "@xyflow/react";
import { TriageTags, type TriageNode } from "../../../types";
import clsx from "clsx";

export const colors = {
    [TriageTags.Emergency] : {
        selected : "bg-red-500",
        default: "bg-red-50 hover:bg-red-300"
    },
    [TriageTags.Delayed] : {
        selected:"bg-yellow-500",
        default:"bg-yellow-50 hover:bg-yellow-300"
    },
     [TriageTags.Minor] : {
        selected : "bg-green-500",
        default: "bg-green-50 hover:bg-green-300"
    }
}
export function TriageLabel(props: NodeProps<TriageNode>){
  const {updateNodeData} = useReactFlow();

  if(props.data.stepType === 'step') return null;

    return (
        <>
        {[TriageTags.Emergency, TriageTags.Delayed, TriageTags.Minor].map(tag => (
            <div
            key={tag}
            onClick={() => updateNodeData(props.id, {assignedLabel : tag})}
            className={clsx({
                'flex items-center justify-center w-full h-10 rounded-[10px] px-2 py-1 text-black font-bold ':true,
                [colors[tag].selected] : props.data.assignedLabel === tag,
                [colors[tag].default] : props.data.assignedLabel !== tag,
            })}
            >{tag}</div>
        ))}
        </>
    )
}