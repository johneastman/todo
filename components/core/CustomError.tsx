import { Color } from "../../utils";
import CustomText from "./CustomText";

type CustomErrorProps = {
    error?: string;
};

export default function CustomError(props: CustomErrorProps): JSX.Element {
    const { error } = props;
    return (
        <>{error && <CustomText text={error} style={{ color: Color.Red }} />}</>
    );
}
