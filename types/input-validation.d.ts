export {}

declare global {
    type ValidatorFunction = (field: Field) => null | string // returns error message or null

    interface Field {
        input: string
        errors: string[]
        validators: ValidatorFunction[]
        default?: string | number
    }

    interface FormInput {
        [key: string]: Field
    }
}
