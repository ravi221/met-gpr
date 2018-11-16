/**
 * An interface to represent the datepicker output
 */
export interface IDatePickerOutput {
    /**
     * The dates selected
     */
    selectedDates?: Date[];

    /**
     * The date entered as a text field
     */
    dateString: string;

    /**
     * The instance of the flatpickr
     */
    flatpickerInstance: any;
}
