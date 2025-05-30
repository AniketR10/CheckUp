import { useRef, useState } from "react";
import { View,Text,Button } from "tamagui";
import { TriageOption, TriageStep } from "@/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getTriageDecisionTree, pushToQueue } from "@/services";
import { ActivityIndicator, Alert, Animated, Dimensions, Easing, FlatList } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TriageScreen() {

    const [nextStep, setNextStep] = useState<TriageStep["step"]>();
    const ref = useRef(new Animated.Value(0))

    const mutation = useMutation({
        mutationKey: ['triage','confirm'],
        mutationFn: pushToQueue,
        onSuccess: async (data) => {
            await AsyncStorage.setItem('patient', JSON.stringify(data))
            router.back();
        },
        onError:({message}) => Alert.alert("Error", message)
    });

    const query = useQuery({
        queryKey:["triage", nextStep],
        queryFn:() => getTriageDecisionTree(nextStep),
    });

    const animationConfig = {
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: false,
    };

    async function onNextStep(option: TriageOption) {
        Animated.timing(ref.current, {
            toValue: -Dimensions.get("window").width,
            ...animationConfig
        }).start(() => {
            if(option.assignedLabel) mutation.mutate(option.assignedLabel);
            if(option.nextStep) setNextStep(option.nextStep);

            ref.current.setValue(Dimensions.get("window").width);
            Animated.timing(ref.current, {
                toValue: 0,
                ...animationConfig
            }).start();

        })
    }

   // console.log("Triage query:", JSON.stringify(query.data,null,2))
    if(query.isError) {
        return (
            <View
            flex={1}
            items={"center"}
            justify={"center"}
            >
                <Text>Error Loading Data</Text>
            </View>
        )
    }
console.log(JSON.stringify(query.data))

    return (
        <View
        flex={1}
        items={"center"}
        justify={"center"}
        bg={"$red9"}
        >
            <View position="absolute">
                <Text opacity={0.7} color={"red"} fontSize={300}>🚑</Text>
            </View>
            <Animated.View
            style={{transform:[{translateX: ref.current}], flex: 1, width:"100%"}}
            >
                {query.isLoading ? (
                    <View flex={1} items={"center"} justify={"center"}>
                        <ActivityIndicator animating size={"large"}/>
                    </View>
                ) : (
                    <View items={"center"} justify={"center"}>
                        <Text px={"$3"} py={"$5"} fontSize={30} fontWeight={400} color={"white"} fontStyle="italic">
                            {query.data?.step}
                        </Text>
                        <FlatList
                        data={query.data?.options}
                        keyExtractor={({value}) => value}
                        style={{width:"100%"}}
                        renderItem={({item}) => (
                            <Button
                                onPress={() => onNextStep(item)}
                                bg={"white"}
                                m={20}
                                color={"black"}
                                hoverStyle={{bg:"gray", scale:1.05}}
                                width="90%"
                                rounded={50}
                                size={"$6"}
                                textProps={{fontSize: 30, fontWeight: 700}}
                                pressStyle={{bg: "$red5"}}
                            >
                                {item.value}
                            </Button>
                        )}
                        />
                    </View>
                )}
                </Animated.View>  
            
        </View>
            
    )
}