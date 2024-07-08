import { useContext, useEffect, useState } from "react";
import CustomModal from "./core/CustomModal";
import CustomDropdown from "./core/CustomDropdown";
import { SelectionValue } from "../types";
import { AppContext } from "../contexts/app.context";
import {
    ActionsModalVisible,
    DeleteLists,
    SelectAllLists,
} from "../data/reducers/app.reducer";

type CellActionsModalProps = {};

export default function CellActionsModal(
    props: CellActionsModalProps
): JSX.Element {
    const [items, setItems] = useState<string>("");
    const [actions, setActions] = useState<string[]>([]);

    const appContext = useContext(AppContext);
    const {
        data: { isActionsModalVisible },
        dispatch,
    } = appContext;

    useEffect(() => {
        setItems("");
        setActions([]);
    }, [props]);

    const closeModal = (): void => dispatch(new ActionsModalVisible(false));

    const executeAction = (): void => {
        // Select Items
        if (items === "All") dispatch(new SelectAllLists(true));
        else if (items === "None") dispatch(new SelectAllLists(false));

        // Perform Action
        for (const action of actions) {
            if (action === "Delete") dispatch(new DeleteLists());
        }

        // Dismiss the actions modal
        dispatch(new ActionsModalVisible(false));
    };

    const setNewAction = (index: number, newAction: string): void =>
        setActions(actions.map((a, i) => (i === index ? newAction : a)));

    const selectedItems: SelectionValue<string>[] = [
        { label: "All", value: "All" },
        { label: "None", value: "None" },
        { label: "Complete", value: "Complete" },
        { label: "Incomplete", value: "Incomplete" },
        { label: "Locked", value: "Locked" },
        { label: "Unlocked", value: "Unlocked" },
    ];

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
            title="Actions"
            isVisible={isActionsModalVisible}
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
