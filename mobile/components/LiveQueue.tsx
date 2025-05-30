import { Queue, TriageColors } from "@/type";
import { FlatList } from "react-native";
import { ListItem, Text,View } from "tamagui";

interface Props {
    data?: Queue;
    isLoading: boolean;
    refetch: () => void
}

export  function LiveQueue({data, isLoading, refetch}: Props) {
   // console.log(JSON.stringify(data))
   console.log("data size is: " + data?.length)
   return  (
    <View width="90%" flex={1}>
         <Text my={20} text={"center"} fontWeight={"bold"} fontSize={30} color="black"
           >
             🚨 Live Queue 🚨
           </Text>
   
    <FlatList
        onRefresh={refetch}
        refreshing={isLoading}
        data={data}
        keyExtractor={({number}) => number.toString()}
        
        ListEmptyComponent={() => (
            <Text
            m={20} text={"center"} fontSize={20} fontWeight={400}
            >
                {isLoading ? "Loading..." : "Currently there is no one in the queue"}
            </Text>
        )}
        ItemSeparatorComponent={() => <View height={15}/>}
        style={{width: "100%", marginBottom: 20}}
        renderItem={({item}) => (
            <View
                flexDirection="row"
                p={16}
                self={"center"}
                justify={"space-around"}
                items={"center"}
                width="80%"
                bg={`$${TriageColors[item.assignedLabel]}8`}
                rounded={50}
                shadowColor={"black"}
                shadowOffset={{width: 0, height: 0}}
                shadowOpacity={0.25}
                shadowRadius={3.84}
            >
                <View
                  bg={`$${TriageColors[item.assignedLabel]}8`}
                  rounded={50}
                  px={16}
                  py={2}
                >
                    <Text
                        fontWeight={"bold"} fontSize={24} color={"black"}
                    >
                        #{item.number}
                    </Text>
                </View>
                <Text fontWeight={"bold"} fontSize={24}>
                    {item.assignedLabel}
                </Text>
            </View>
        )}
    />
     </View>
   )
}