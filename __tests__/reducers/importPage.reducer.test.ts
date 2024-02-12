import { UpdateError } from "../../data/reducers/common";
import {
    ImportPageState,
    UpdateText,
    importPageReducer,
} from "../../data/reducers/importPage.reducer";
import { assertImportPageStateEqual } from "../testUtils";

describe("Import Page Redcuer", () => {
    const encodedData: string =
        "W3sibmFtZSI6IkEiLCJsaXN0VHlwZSI6Ikxpc3QiLCJkZWZhdWx0TmV3SXRlbVBvc2l0aW9uIjoiYm90dG9tIiwiaXNTZWxlY3RlZCI6ZmFsc2UsIml0ZW1zIjpbXX0seyJuYW1lIjoiQiIsImxpc3RUeXBlIjoiTGlzdCIsImRlZmF1bHROZXdJdGVtUG9zaXRpb24iOiJib3R0b20iLCJpc1NlbGVjdGVkIjpmYWxzZSwiaXRlbXMiOlt7Im5hbWUiOiIxIiwicXVhbnRpdHkiOjEsImlzQ29tcGxldGUiOmZhbHNlLCJpc1NlbGVjdGVkIjpmYWxzZX1dfSx7Im5hbWUiOiJDIiwibGlzdFR5cGUiOiJMaXN0IiwiZGVmYXVsdE5ld0l0ZW1Qb3NpdGlvbiI6ImJvdHRvbSIsImlzU2VsZWN0ZWQiOmZhbHNlLCJpdGVtcyI6W119XQ==";

    const state: ImportPageState = {
        text: "",
        error: "No data provided",
    };

    it("updates text", () => {
        const newState: ImportPageState = importPageReducer(
            state,
            new UpdateText(encodedData)
        );
        assertImportPageStateEqual(newState, { text: encodedData });
    });

    it("updates error", () => {
        const newState: ImportPageState = importPageReducer(
            state,
            new UpdateError("Unable to parse provided data")
        );

        assertImportPageStateEqual(newState, {
            text: "",
            error: "Unable to parse provided data",
        });
    });
});
