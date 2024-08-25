import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/src/utils/fileMock.ts",
  },
  roots: ["<rootDir>/src/tests"],
  testMatch: ["**/*.test.(ts|tsx)"],
};

export default config;
