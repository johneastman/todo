import { View, Button, Text } from "react-native";

interface QuantityProps {
    value: number;
    setValue: (newValue: number) => void;
}

export default function Quantity(props: QuantityProps): JSX.Element {
    const { value, setValue } = props;

    let buttonWidth: number = 30;

    return (
        <View
            style={{
                flexDirection: "row",
                gap: 20,
            }}
        >
            <View style={{ width: buttonWidth }}>
                <Button
                    title="-"
                    onPress={() => setValue(value - 1)}
                    disabled={value <= 1}
                />
            </View>
            <Text testID="ItemModal-quantity" style={{ fontSize: 20 }}>
                {value}
            </Text>
            <View style={{ width: buttonWidth }}>
                <Button title="+" onPress={() => setValue(value + 1)} />
            </View>
        </View>
    );
}
