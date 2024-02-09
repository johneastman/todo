import { Text } from "react-native";
import { RED } from "../utils";

type CustomErrorProps = {
    error?: string;
};

export default function CustomError(props: CustomErrorProps): JSX.Element {
    const { error } = props;
    return <Text style={{ color: RED }}>{error}</Text>;
}
