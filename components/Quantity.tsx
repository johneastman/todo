import { View, Button, Text } from "react-native";
import { STYLES } from "../utils";

interface QuantityProps {
    value: number;
    setValue: (newValue: number) => void;
}

export default function Quantity(props: QuantityProps): JSX.Element {
    const { value, setValue } = props;

    return (
        <View
            style={{
                flexDirection: "row",
                gap: 20,
            }}
        >
            <View style={STYLES.quantityValueChangeButton}>
                <Button
                    title="-"
                    onPress={() => setValue(value - 1)}
                    disabled={value <= 1}
                    testID="decrease-quantity"
                />
            </View>
            <Text testID="ItemModal-quantity" style={{ fontSize: 20 }}>
                {value}
            </Text>
            <View style={STYLES.quantityValueChangeButton}>
                <Button
                    title="+"
                    onPress={() => setValue(value + 1)}
                    testID="increase-quantity"
                />
            </View>
        </View>
    );
}
