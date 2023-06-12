import { View, Text, Pressable } from "react-native";
import { Position } from "../types";

export interface RadioButtonsData {
    displayValue: string;
    id: Position;
}

interface RadioButtonsProps {
    title: string;
    data: RadioButtonsData[];
    selectedId: Position;
    setSelectedId: (newValue: Position) => void;
}

export default function RadioButtons(props: RadioButtonsProps): JSX.Element {
    return (
        <>
            <Text>{props.title}</Text>
            <View style={{ gap: 10 }}>
                {props.data.map(
                    (data: RadioButtonsData, index: number): JSX.Element => {
                        return (
                            <Pressable
                                onPress={() => {
                                    props.setSelectedId(data.id);
                                }}
                                key={index}
                                style={{ flexDirection: "row", gap: 10 }}
                            >
                                <RadioButton
                                    isSelected={data.id === props.selectedId}
                                />
                                <Text>{data.displayValue}</Text>
                            </Pressable>
                        );
                    }
                )}
            </View>
        </>
    );
}

interface RadioButtonProps {
    isSelected: boolean;
}

function RadioButton(props: RadioButtonProps): JSX.Element {
    return (
        <View
            style={{
                height: 24,
                width: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: "#000",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {props.isSelected ? (
                <View
                    style={{
                        height: 12,
                        width: 12,
                        borderRadius: 6,
                        backgroundColor: "#000",
                    }}
                />
            ) : null}
        </View>
    );
}
