import CustomButton from "./core/CustomButton";

type EditButtonProps = {
    onPress: () => void;
};

export default function EditButton(props: EditButtonProps): JSX.Element {
    const { onPress } = props;
    return <CustomButton text="Edit" onPress={onPress} />;
}
