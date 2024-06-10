import { View, Text, Pressable } from "react-native";
import { SelectionValue } from "../../types";
import { BLACK } from "../../utils";

type RadioButtonsProps<T> = {
    title?: string;
    data: SelectionValue<T>[];
    selectedValue?: T;
    setSelectedValue: (newValue: T) => void;
};

export default function CustomRadioButtons<T>(
    props: RadioButtonsProps<T>
): JSX.Element {
    const { title, data, selectedValue, setSelectedValue } = props;

    const value: SelectionValue<T> | undefined = data.filter(
        (d) => d.value === selectedValue
    )[0];

    return (
        <View style={{ gap: 10 }}>
            <View style={{ alignItems: "center" }}>
                {title !== undefined && (
                    <Text style={{ fontSize: 18 }}>{title}</Text>
                )}
            </View>

            {data.map((d: SelectionValue<T>, index: number): JSX.Element => {
                const testIdTitle: string =
                    title !== undefined ? title : "No Title";
                const testId = `${testIdTitle}-${d.label}`;

                return (
                    <Pressable
                        onPress={() => {
                            setSelectedValue(d.value);
                        }}
                        key={index}
                        style={{ flexDirection: "row", gap: 10 }}
                        testID={testId}
                    >
                        <RadioButtonView
                            isSelected={d === value}
                            text={d.label}
                        />
                    </Pressable>
                );
            })}
        </View>
    );
}

type RadioButtonProps = {
    isSelected: boolean;
    text: string;
};

function RadioButtonView(props: RadioButtonProps): JSX.Element {
    const { isSelected, text } = props;

    return (
        <>
            <View
                style={{
                    height: 24,
                    width: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: BLACK,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {isSelected ? (
                    <View
                        style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: BLACK,
                        }}
                    />
                ) : null}
            </View>
            <Text>{text}</Text>
        </>
    );
}
