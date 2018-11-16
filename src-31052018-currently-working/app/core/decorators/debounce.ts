/**
 * Decorator to provide debouncing functionality
 * @param delay debounce delay time
 */
export function debounce(delay: number = 300): MethodDecorator {
    /**
     * function to assign debouncing timeout
     */
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let timeout = null;

        const original = descriptor.value;

        descriptor.value = function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => original.apply(this, args), delay);
        };

        return descriptor;
    };
}
