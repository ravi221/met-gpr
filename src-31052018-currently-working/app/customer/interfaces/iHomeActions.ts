/**
 * Interface for home screen tool tip action.
 */
export interface IHomeAction {
    /**
     * The label to display for home action
    */
    label: string;

    /**
     * The function to run when the action is clicked
     */
    action: Function;
}
