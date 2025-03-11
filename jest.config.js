export default {
    preset: "ts-jest", // for TypeScript projects
    testEnvironment: "node", // or 'jsdom' for browser-like environments
    transform: {
        "^.+\\.[tj]sx?$": "babel-jest", // Use babel-jest to handle TypeScript/JS
    },
    moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
    testMatch: ["**/unit/?(*.)+(spec|test).[tj]s?(x)"], // Test file naming pattern
    coverageDirectory: "coverage", // output directory for coverage reports
    collectCoverageFrom: ["src/**/*.{js,ts,jsx,tsx}"], // coverage includes files in src
    globals: {
        "ts-jest": {
            useBabelrc: true, // Use babel config if present
        },
    },
}
