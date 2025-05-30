import { Platform } from "react-native";
import {PatientQueueData, Queue, TriageStep } from "./type";

const HOST = Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1"
const URL = `http://${HOST}:3000`

export async function getQueue(): Promise<Queue> {
    return fetch(`${URL}/queue`)
    .then(res => res.json())
}

export async function getTriageDecisionTree(nextStep: string=""): Promise<TriageStep>{
    return (
        fetch(`${URL}/triage/decision-tree?nextStepId=${nextStep}`)
        .then(res => res.json())
    )
}

export async function pushToQueue(assignedlabel: string): Promise<PatientQueueData> {
    return fetch(`${URL}/queue/new-patient`, {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
        },
        body: JSON.stringify({assignedlabel})
    }).then(res => res.json())
}