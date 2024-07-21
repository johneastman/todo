import { Text } from "react-native";
import { Color } from "../../utils";

type CustomErrorProps = {
    error?: string;
};

export default function CustomError(props: CustomErrorProps): JSX.Element {
    const { error } = props;
    return <Text style={{ color: Color.Red }}>{error}</Text>;
}
