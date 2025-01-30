//#######################################################################
// With user friendly interface

// // Define your entity interfaces as before
// interface UserPayment {
//     amount: number
// }
// interface User {
//     id: string
// }
// interface Project {
//     id: string
// }

// interface Profile {
//     id: string
// }

// // Helper types to transform your schema definition
// type CollectionDef<T, C extends Record<string, CollectionDef<any, any>> = {}> = {
//     type: T
//     collections?: C
// }

// type SchemaFromDef<D extends Record<string, CollectionDef<any, any>>> = {
//     [K in keyof D]: {
//         $: D[K]["type"][]
//     } & {
//         [id: string]: {
//             $: D[K]["type"]
//         } & (D[K]["collections"] extends Record<string, CollectionDef<any, any>>
//             ? { [C in keyof D[K]["collections"]]: SchemaFromDef<D[K]["collections"]> }
//             : {})
//     }
// }

// // User-friendly schema definition
// const schemaDefinition = {
//     users: {
//         type: {} as User,

//         collections: {

//             payments: {
//                 type: {} as UserPayment,
//             },
//         },
//     },

//     projects: {
//         type: {} as Project,
//     },

//     profiles: {
//         type: {} as Profile,

//         collections: {
//             users: {
//                 type: {} as User
//             }
//         }
//     }
// }

// // Generate the complex schema type
// type Schema = SchemaFromDef<typeof schemaDefinition>

// // Keep the existing path parsing and type resolution utilities
// type Split<S extends string, D extends string> = S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S]

// type GetTypeAtPath<S, Path extends string[]> = Path extends [infer First extends string, ...infer Rest extends string[]]
//     ? First extends keyof S
//         ? GetTypeAtPath<S[First], Rest>
//         : S extends { [key: string]: infer Child }
//         ? GetTypeAtPath<Child, Rest>
//         : never
//     : S extends { $: infer T }
//     ? T
//     : never

// // Typed read function remains the same
// function readData<const T extends string>(path: T): GetTypeAtPath<Schema, Split<T, "/">> {
//     return null!
// }

// // Usage examples remain type-safe:
// const user = readData("users/") // User
// const payments = readData("users/aaaa/payments") // UserPayment[]
// const payment = readData("users/123/payments/456") // UserPayment
// const projects = readData("projects") // Project[]
// const profiles = readData("profiles/2343/users")

// const users = readData("users") // User[]

// type Example2 = Split<"orders.items[0].price", ".">
