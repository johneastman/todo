import { useEffect, useState } from "react";
import CustomModal from "./core/CustomModal";
import CustomDropdown from "./core/CustomDropdown";
import { CollectionViewCellType, SelectionValue } from "../types";

type ActionsModalProps = {
    isVisible: boolean;
    cellsType: CollectionViewCellType;
    cellSelectActions: Map<string, () => void>;
    setVisible: (isVisible: boolean) => void;
};

export default function ActionsModal(props: ActionsModalProps): JSX.Element {
    const { cellsType, isVisible, cellSelectActions, setVisible } = props;

    const [items, setItems] = useState<string>("");
    const [actions, setActions] = useState<string[]>([]);

    useEffect(() => {
        setItems("");
        setActions([]);
    }, [props]);

    const selectedItems: SelectionValue<string>[] = Array.from<string>(
        cellSelectActions.keys()
    ).map((key) => ({ label: key, value: key }));

    const itemsAction: SelectionValue<string>[] = [
        { label: "Complete", value: "Complete" },
        { label: "Incomplete", value: "Incomplete" },
        { label: "Lock", value: "Lock" },
        { label: "Unlock", value: "Unlock" },
        { label: "Delete", value: "Delete" },
        { label: "Move", value: "Move" },
    ];

    const closeModal = (): void => setVisible(false);

    const executeAction = (): void => {
        // Select Items
        const selectItems: (() => void) | undefined =
            cellSelectActions.get(items);
        if (selectItems === undefined)
            throw Error(`No method for action: ${items}`);

        selectItems();

        // Perform Action
        // TODO: implement actions after selecting items

        // Dismiss the actions modal
        setVisible(false);
    };

    const setNewAction = (index: number, newAction: string): void =>
        setActions(actions.map((a, i) => (i === index ? newAction : a)));

    return (
        <CustomModal
            title={`${cellsType} Actions`}
            isVisible={isVisible}
            positiveActionText="Run"
            positiveAction={executeAction}
            negativeActionText="Cancel"
            negativeAction={closeModal}
            altActionText="Add"
            altAction={() => setActions([...actions, ""])}
        >
            <CustomDropdown
                placeholder="Select items"
                data={selectedItems}
                selectedValue={items}
                setSelectedValue={(newItems: string): void =>
                    setItems(newItems)
                }
            />

            {actions.map((action, index) => (
                <CustomDropdown
                    key={index}
                    placeholder="Select action"
                    data={itemsAction}
                    selectedValue={action}
                    setSelectedValue={(newAction: string) =>
                        setNewAction(index, newAction)
                    }
                />
            ))}
        </CustomModal>
    );
}
