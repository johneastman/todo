import { useContext, useEffect, useState } from "react";
import CustomModal from "./core/CustomModal";
import CustomDropdown from "./core/CustomDropdown";
import { CollectionViewCellType, SelectionValue } from "../types";
import { AppContext } from "../contexts/app.context";
import { ActionsModalVisible, DeleteLists } from "../data/reducers/app.reducer";

type CellActionsModalProps = {
    isVisible: boolean;
    cellsType: CollectionViewCellType;
    cellSelectActions: Map<string, () => void>;
};

export default function CellActionsModal(
    props: CellActionsModalProps
): JSX.Element {
    const { cellsType, isVisible, cellSelectActions } = props;

    const [items, setItems] = useState<string>("");
    const [actions, setActions] = useState<string[]>([]);

    const { dispatch } = useContext(AppContext);

    useEffect(() => {
        setItems("");
        setActions([]);
    }, [props]);

    const closeModal = (): void =>
        dispatch(new ActionsModalVisible(cellsType, false));

    const executeAction = (): void => {
        // Select Items
        const selectItems: (() => void) | undefined =
            cellSelectActions.get(items);
        if (selectItems) selectItems();

        // Perform Action
        for (const action of actions) {
            if (action === "Delete") dispatch(new DeleteLists());
        }

        // Dismiss the actions modal
        dispatch(new ActionsModalVisible(cellsType, false));
    };

    const setNewAction = (index: number, newAction: string): void =>
        setActions(actions.map((a, i) => (i === index ? newAction : a)));

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
