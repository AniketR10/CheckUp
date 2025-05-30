import { useQuery } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { View, Button } from "tamagui";
import { getQueue } from "@/services";
import { LiveQueue } from "@/components/LiveQueue";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PatientQueueData } from "@/type";
import { PatientInfo } from "@/components/PatientInfo";
import { useMutation } from "@tanstack/react-query";
import PusherJs from 'pusher-js';
import { useEffect, useRef } from "react";
import { Alert } from "react-native";

const pusher = new PusherJs(process.env.EXPO_PUBLIC_PUSHER_KEY!, { cluster: "eu" });

export default function IndexScreen() {
  const patientNumRef = useRef<number | null>(null);

  const queue = useQuery({ queryKey: ['queue'], queryFn: getQueue });
  const patient = useQuery({
    queryKey: ["patient"],
    queryFn: async () =>
      AsyncStorage.getItem('patient')
        .then(data => data ? (JSON.parse(data) as PatientQueueData) : null)
  });

  const patientMutation = useMutation({
    mutationKey: ['patient'],
    mutationFn: async () => AsyncStorage.removeItem('patient'),
    onSuccess: () => {
      queue.refetch();
      patient.refetch();
    }
  });

  function goToTriage() {
    router.push("/triage");
  }

  useEffect(() => {
    patientNumRef.current = patient.data?.number ?? null;
  }, [patient.data?.number]);

  useEffect(() => {
    const channel = pusher.subscribe('live-queue');

    channel.bind('patient-in', (data: number) => {
      if (patientNumRef.current !== data) queue.refetch();
    });

    channel.bind('patient-out', (data: any) => {
        console.log('patient has been assessed...');
      if (patientNumRef.current === data) {
        Alert.alert("It's now your turn", "Have a nice meeting with the doctor...", [
          { text: "OK", onPress: () => patientMutation.mutate() }
        ]);
      } else {
        queue.refetch();
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  useFocusEffect(() => {
    patient.refetch();
    queue.refetch();
    // Removed AsyncStorage cleanup here to avoid race conditions
  });

  const hasActiveTriage = !!patient.data && queue.data?.some(p => p.number === patient.data?.number);

  return (
    <View
      items="center"
      flex={1}
      pt={20}
      gap={20}
      $theme-light={{ bg: "$red3" }}
      $theme-dark={{ bg: "$white1" }}
    >
      {hasActiveTriage && patient.data ? (
        <PatientInfo patient={patient.data} />
      ) : (
        <Button
          onPress={goToTriage}
          size="$5"
          bg={"$red10"}
          rounded={50}
          my={20}
          width="90%"
          pressStyle={{ bg: "$red8" }}
          textProps={{ color: "white", fontWeight: "bold", fontSize: 20 }}
        >
          +    START ASSESSMENT    +
        </Button>
      )}

      <LiveQueue
        data={queue.data}
        isLoading={queue.isLoading}
        refetch={queue.refetch}
      />
    </View>
  );
}
