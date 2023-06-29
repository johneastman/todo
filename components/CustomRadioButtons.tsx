import { View, Text, Pressable } from "react-native";
import { Position, RadioButton } from "../types";

interface RadioButtonsProps {
    title: string;
    data: RadioButton[];
    position: Position;
    setPosition: (newPosition: Position) => void;
}

export default function CustomRadioButtons(
    props: RadioButtonsProps
): JSX.Element {
    return (
        <View style={{ gap: 10 }}>
            <Text style={{ alignContent: "flex-start", fontSize: 18 }}>
                {props.title}:
            </Text>
            {props.data.map((data: RadioButton, index: number): JSX.Element => {
                return (
                    <Pressable
                        onPress={() => {
                            props.setPosition(data.position);
                        }}
                        key={index}
                        style={{ flexDirection: "row", gap: 10 }}
                    >
                        <RadioButtonView
                            isSelected={data.position === props.position}
                        />
                        <Text>{data.displayValue}</Text>
                    </Pressable>
                );
            })}
        </View>
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
