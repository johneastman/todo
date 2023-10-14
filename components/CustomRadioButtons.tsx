import { View, Text, Pressable } from "react-native";
import { SelectionValue } from "../types";

interface RadioButtonsProps<T> {
    title: string;
    data: SelectionValue<T>[];
    selectedValue: T;
    setSelectedValue: (newPosition: T) => void;
}

export default function CustomRadioButtons<T>(
    props: RadioButtonsProps<T>
): JSX.Element {
    const { title, data, selectedValue, setSelectedValue } = props;

    return (
        <View style={{ gap: 10 }}>
            <Text style={{ alignContent: "flex-start", fontSize: 18 }}>
                {title}:
            </Text>
            {data.map((data: SelectionValue<T>, index: number): JSX.Element => {
                return (
                    <Pressable
                        onPress={() => {
                            setSelectedValue(data.value);
                        }}
                        key={index}
                        style={{ flexDirection: "row", gap: 10 }}
                        testID={`${data.label}-testID`}
                    >
                        <RadioButtonView
                            isSelected={data.value === selectedValue}
                        />
                        <Text>{data.label}</Text>
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
