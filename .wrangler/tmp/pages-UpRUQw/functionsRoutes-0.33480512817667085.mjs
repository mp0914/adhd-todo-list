import { onRequestOptions as __api_auth_login_js_onRequestOptions } from "C:\\Users\\Admin\\adhd-todo-list\\functions\\api\\auth\\login.js"
import { onRequestPost as __api_auth_login_js_onRequestPost } from "C:\\Users\\Admin\\adhd-todo-list\\functions\\api\\auth\\login.js"
import { onRequestOptions as __api_auth_register_js_onRequestOptions } from "C:\\Users\\Admin\\adhd-todo-list\\functions\\api\\auth\\register.js"
import { onRequestPost as __api_auth_register_js_onRequestPost } from "C:\\Users\\Admin\\adhd-todo-list\\functions\\api\\auth\\register.js"
import { onRequestGet as __api_state_js_onRequestGet } from "C:\\Users\\Admin\\adhd-todo-list\\functions\\api\\state.js"
import { onRequestOptions as __api_state_js_onRequestOptions } from "C:\\Users\\Admin\\adhd-todo-list\\functions\\api\\state.js"
import { onRequestPut as __api_state_js_onRequestPut } from "C:\\Users\\Admin\\adhd-todo-list\\functions\\api\\state.js"

export const routes = [
    {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_auth_login_js_onRequestOptions],
    },
  {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_js_onRequestPost],
    },
  {
      routePath: "/api/auth/register",
      mountPath: "/api/auth",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_auth_register_js_onRequestOptions],
    },
  {
      routePath: "/api/auth/register",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_register_js_onRequestPost],
    },
  {
      routePath: "/api/state",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_state_js_onRequestGet],
    },
  {
      routePath: "/api/state",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_state_js_onRequestOptions],
    },
  {
      routePath: "/api/state",
      mountPath: "/api",
      method: "PUT",
      middlewares: [],
      modules: [__api_state_js_onRequestPut],
    },
  ]