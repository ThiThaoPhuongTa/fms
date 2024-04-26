import { ReponseStrategyFactory, ResponseStrategy } from "../strategies/ResponseStrategy"
import { ForwardRequestStrategy } from "../strategies/ForwardRequestStrategy"
import { RuleMatcher } from "./RuleMatcher"
import { Request } from "express"
import { pathToRegexp } from "path-to-regexp"
import { RatesResponseStrategy } from "../strategies/RatesResponseStrategy"
import { CountBasedResponseStrategy } from "../strategies/CountBasedResponseStrategy"
import { StaticResponseStrategy } from "../strategies/StaticResponseStrategy"

type Method = "GET" | "POST" | "OPTIONS" | "HEAD" | "PUT" | "PATCH" | "DELETE" | string

export class Rule {

    static all(strategy: ResponseStrategy): Rule {
        return new Rule(["*"], ["/"], null, strategy)
    }

    static fromJsonString(definition: string) {
        const { methods, routes, header, strategy } = JSON.parse(definition)

        return new Rule(methods, routes, header, ReponseStrategyFactory.parse(strategy))
    }

    public get patterns (): RegExp[] {
        return this.routes.map(r => pathToRegexp(r))
    }

    constructor(
        public methods: Method[] = ["*"],
        public routes: string[],
        public header: string | null = null,
        public strategy: ForwardRequestStrategy = new ForwardRequestStrategy()
    ) {}

    isMatch(req: Request): boolean {
        return new RuleMatcher().isMatch(this, req)
    }
}