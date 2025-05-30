import { PatientQueueData,TriageColors, TriageTags } from "@/type";
import { Text, View } from "tamagui";

export function PatientInfo({patient} : {patient : PatientQueueData}) {
 // console.log(JSON.stringify(patient))
  return (
    <View
      width="90%"
      p={20}
      gap={20}
      bg="gray"
      rounded={20}
      shadowColor="black"
      shadowOffset={{ width: 0, height: 0 }}
      shadowOpacity={0.25}
      shadowRadius={3.84}
    >
      <Text text='center' fontWeight='bold' fontSize={20} color={"black"}>
        📌 Your Appointment  📌
      </Text>

      <View flexDirection='row' justify='space-between' gap={10}>
        <View width='20%' items='center' justify='center' p={10} bg='black' rounded={50}>
          <Text fontSize={26} color='white' fontWeight='bold'>
            #{patient.number}
          </Text>
        </View>
        <View
          width='70%'
          items='center'
          justify='center'
          bg={`$${TriageColors[patient.assignedLabel]}8`}
          rounded={50}
        >
          <Text fontSize={26} fontWeight='bold' color={"black"}>
            {patient.assignedLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}