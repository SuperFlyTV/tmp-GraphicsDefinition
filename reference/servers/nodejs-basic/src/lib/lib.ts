import Router from "@koa/router"
import { ServerAPI } from "html-graphics-definition"
import { ParameterizedContext, DefaultState, DefaultContext } from "koa"

export function literal<T>(o: T): T {
	return o
}


export type CTX =  ParameterizedContext<DefaultState, DefaultContext & Router.RouterParamContext<DefaultState, DefaultContext>,  ServerAPI.AnyReturnValue>
