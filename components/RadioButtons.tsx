import { View, Text, Pressable } from "react-native";
import { Position, RadioButton } from "../types";

interface RadioButtonsProps {
    title: string;
    data: RadioButton[];
    position: Position;
    setPosition: (newPosition: Position) => void;
}

export default function RadioButtons(props: RadioButtonsProps): JSX.Element {
    return (
        <>
            <Text>{props.title}</Text>
            <View style={{ gap: 10 }}>
                {props.data.map(
                    (data: RadioButton, index: number): JSX.Element => {
                        return (
                            <Pressable
                                onPress={() => {
                                    props.setPosition(data.position);
                                }}
                                key={index}
                                style={{ flexDirection: "row", gap: 10 }}
                            >
                                <RadioButtonView
                                    isSelected={
                                        data.position === props.position
                                    }
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

function RadioButtonView(props: RadioButtonProps): JSX.Element {
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
