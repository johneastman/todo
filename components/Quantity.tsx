import { View, Button } from "react-native";
import { STYLES } from "../utils";
import Header from "./Header";

type QuantityProps = {
    value: number;
    setValue: (newValue: number) => void;
};

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
            <Header text={value} testID="ItemModal-quantity" />
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
