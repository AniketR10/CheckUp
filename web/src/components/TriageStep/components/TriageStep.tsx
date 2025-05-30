import { Position, useEdges, type NodeProps } from "@xyflow/react";
import type { TriageNode } from "../../../types";
import { useMemo } from "react";
import clsx from "clsx";
import { Handle } from "@xyflow/react";
import { TriageInput } from "./TriageInput";
import { TriageAddOptions } from "./TriageAddOptions";
import { TriageType } from "./TriageType";
import { TriageLabel } from "./TriageLabel";

export function TriageStep(props : NodeProps<TriageNode>){
    const edges = useEdges();
    const isConnectable = useMemo(() => {
        return !edges.find(e => e.target === props.id)
    },[edges, props.id])

    return(
        <>
        <div className="w-[300px] flex flex-col items-center rounded-[20px] border-[3px] border-black p-5 gap-2 shadow-lg bg-white">
          <TriageInput {...props}/>
           <TriageAddOptions {...props}/>
           <TriageType {...props}/>
            <TriageLabel {...props}/>
        </div>
        {!props.data.isRoot && (
               <div
              className={clsx(
                'absolute', // required to position it correctly
                'top-1/2 -translate-y-1/2 left-[-25px]', // position on the right edge
                'w-[40px] h-[40px] rounded-full flex items-center justify-center z-10',
                {
                  'bg-black border-none': !isConnectable,
                  'bg-white border-[2px] border-dotted border-[lightgray] hover:bg-gray-200': isConnectable,
                }
              )}
              
            >
              <Handle
                type="target"
                position={Position.Left}
                id={props.id}
                isConnectable={isConnectable}
                className="w-full h-full opacity-0"
              />
              🔗
            </div>
            )}
        </>
    )
}


