interface User {
    id: string
}

interface UserPayment {
    amount: number
}

type Path = string

interface Project {
    id: string
}

// this is what the user will use

interface Schema {
    users: {
        type: User

        collections: {
            payments: {
                type: UserPayment
            }
        }
    }

    projects: {
        type: Project

        collections: {}
    }
}

// this is what is inferred from above: preferablly
interface Schema {
    users: {
        $: User[]
        [userId: string]: {
            $: User
            payments: {
                $: UserPayment[]
                [paymentId: string]: {
                    $: UserPayment
                }
            }
        }
    }

    projects: {
        $: Project[]
        [projectId: string]: {
            $: Project
        }
    }
}

// Split a string path into segments (e.g., "users/123" → ["users", "123"])
type Split<S extends string, D extends string> = S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S]

// Reuse the existing GetTypeAtPath logic with the split segments
type GetTypeAtPath<S, Path extends string[]> = Path extends [infer First extends string, ...infer Rest extends string[]]
    ? First extends keyof S
        ? GetTypeAtPath<S[First], Rest>
        : S extends { [key: string]: infer Child }
        ? GetTypeAtPath<Child, Rest>
        : never
    : S extends { $: infer T }
    ? T
    : never

// Updated function to accept a string path
function readData<const T extends Path>(path: T): GetTypeAtPath<Schema, Split<T, "/">> {
    return null!
}

// Example usage with string paths:
const users = readData("users") // User[]
const user = readData("users/123") // User
user.id = "hello"
const payments = readData("users/123/payments") // UserPayment[]
const payment = readData("users/123/payments/456") // UserPayment
const projects = readData("projects") // UserPayment
