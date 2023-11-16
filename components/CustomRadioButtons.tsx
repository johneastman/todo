import { View, Text, Pressable } from "react-native";
import { SelectionValue } from "../types";

interface RadioButtonsProps<T> {
    title?: string;
    data: SelectionValue<T>[];
    selectedValue: T | undefined;
    setSelectedValue: (newValue: SelectionValue<T>) => void;
}

export default function CustomRadioButtons<T>(
    props: RadioButtonsProps<T>
): JSX.Element {
    const { title, data, selectedValue, setSelectedValue } = props;

    const value: SelectionValue<T> | undefined = data.filter(
        (d) => d.value === selectedValue
    )[0];

    return (
        <View style={{ gap: 10 }}>
            {title !== undefined ? (
                <Text style={{ alignContent: "flex-start", fontSize: 18 }}>
                    {title}
                </Text>
            ) : null}

            {data.map((d: SelectionValue<T>, index: number): JSX.Element => {
                return (
                    <Pressable
                        onPress={() => {
                            setSelectedValue(d);
                        }}
                        key={index}
                        style={{ flexDirection: "row", gap: 10 }}
                        testID={`${title !== undefined ? title : "no-title"}-${
                            d.label
                        }-testID`}
                    >
                        <RadioButtonView isSelected={d === value} />
                        <Text>{d.label}</Text>
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
