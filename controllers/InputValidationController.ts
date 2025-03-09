export function required(field: Field): string | null {
    if (field.input.trim() === "") return `This field is required.`
    return null
}

export function isValidEmail(field: Field): string | null {
    if (typeof field.input === "number") return null // Proper number check

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const isValid = emailRegex.test(field.input)

    return isValid ? null : "Please input a valid email"
}

export function containsUppercase(field: Field): string | null {
    if (typeof field.input !== "string" || !/[A-Z]/.test(field.input)) return "Must contain an uppercase letter."
    return null
}

export function containsSpecialChar(field: Field): string | null {
    if (typeof field.input !== "string" || !/[!@#$%^&*(),.?":{}|<>]/.test(field.input))
        return "Must contain a special character."
    return null
}

export class InputValidationController {
    static validate(inputObject: Ref<FormInput>): boolean {
        this.resetErrors(inputObject)
        let isValid = true

        Object.entries(inputObject.value).forEach(([fieldName, field]) => {
            for (let validator of field.validators) {
                const result = validator(field)

                if (result !== null) {
                    isValid = false
                    field.errors.push(result)
                    console.log(field)
                }
            }
        })

        return isValid
    }

    static resetErrors(inputObject: Ref<FormInput>): void {
        Object.entries(inputObject.value).forEach(([fieldName, field]) => {
            field.errors = []
        })
    }

    static destructure(inputObject: Ref<FormInput>) {
        Object.entries(inputObject.value).forEach(([fieldName, field]) => {
            fieldName = field.input
        })
    }

    static reset(inputObject: Ref<FormInput>): void {
        Object.entries(inputObject.value).forEach(([fieldName, field]) => {
            if (field.default) {
                field.input = field.default
            } else {
                field.input = ""
            }
        })
    }
}
