import { useContext, useEffect, useState } from "react";
import CustomModal from "./core/CustomModal";
import CustomDropdown from "./core/CustomDropdown";
import { SelectionValue } from "../types";
import { View } from "react-native";
import { AppContext } from "../contexts/app.context";
import {
    ActionsModalVisible,
    SelectAllLists,
} from "../data/reducers/app.reducer";

type CellActionsModalProps = {};

export default function CellActionsModal(
    props: CellActionsModalProps
): JSX.Element {
    const [action, setAction] = useState<string>("");
    const [subAction, setSubAction] = useState<string>("");

    const appContext = useContext(AppContext);
    const {
        data: {
            listsState: { isActionsModalVisible },
        },
        dispatch,
    } = appContext;

    useEffect(() => {
        setAction("");
        setSubAction("");
    }, [props]);

    const closeModal = (): void => dispatch(new ActionsModalVisible(false));

    const executeAction = (): void => {
        switch (action) {
            case "Select": {
                switch (subAction) {
                    case "All": {
                        dispatch(new SelectAllLists(true));
                        break;
                    }
                    default:
                        break;
                }
                break;
            }

            case "Deselect": {
                switch (subAction) {
                    case "All": {
                        dispatch(new SelectAllLists(false));
                        break;
                    }
                    default:
                        break;
                }
                break;
            }

            default:
                break;
        }

        // Dismiss the actions modal
        dispatch(new ActionsModalVisible(false));
    };

    const actionOptions: SelectionValue<string>[] = [
        { label: "Select", value: "Select" },
        { label: "Deselect", value: "Deselect" },
    ];

    const selectActions: SelectionValue<string>[] = [
        { label: "All", value: "All" },
    ];

    return (
        <CustomModal
            title="Actions"
            isVisible={isActionsModalVisible}
            positiveActionText={"Execute"}
            positiveAction={executeAction}
            negativeActionText="Cancel"
            negativeAction={closeModal}
        >
            <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                    <CustomDropdown
                        placeholder="Select Action"
                        selectedValue={action}
                        data={actionOptions}
                        setSelectedValue={(newAction: string): void =>
                            setAction(newAction)
                        }
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <CustomDropdown
                        placeholder="Select Sub Action"
                        selectedValue={subAction}
                        data={selectActions}
                        setSelectedValue={(newSubAction: string): void =>
                            setSubAction(newSubAction)
                        }
                    />
                </View>
            </View>
        </CustomModal>
    );
}
