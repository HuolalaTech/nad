/**
 * NadResult
 * @iface cn.lalaframework.nad.interfaces.NadResult
 */
export interface NadResult {
  classes: NadClass[];
  enums: NadEnum[];
  modules: NadModule[];
  routes: NadRoute[];
}

/**
 * NadClass
 * @iface cn.lalaframework.nad.interfaces.NadClass
 */
export interface NadClass extends NadDef {
  interfaces: string[];
  members: NadMember[];
  superclass?: string;
  typeParameters: string[];
}

/**
 * NadDef
 * @iface cn.lalaframework.nad.interfaces.NadDef
 */
export interface NadDef {
  annotations: NadAnnotation[];
  name: string;
}

/**
 * NadAnnotation
 * @iface cn.lalaframework.nad.interfaces.NadAnnotation
 */
export interface NadAnnotation {
  attributes: Record<string, unknown>;
  type: string;
}

/**
 * NadMember
 * @iface cn.lalaframework.nad.interfaces.NadMember
 */
export interface NadMember {
  annotations: NadAnnotation[][];
  name: string;
  type?: string;
}

/**
 * NadEnum
 * @iface cn.lalaframework.nad.interfaces.NadEnum
 */
export interface NadEnum extends NadDef {
  constants: NadEnumConstant[];
}

/**
 * NadEnumConstant
 * @iface cn.lalaframework.nad.interfaces.NadEnumConstant
 */
export interface NadEnumConstant {
  annotations: NadAnnotation[];
  name: string;
  properties: Record<string, unknown>;
  value: unknown;
}

/**
 * NadModule
 * @iface cn.lalaframework.nad.interfaces.NadModule
 */
export type NadModule = NadDef;

/**
 * NadRouteHandler
 * @iface cn.lalaframework.nad.interfaces.NadRouteHandler
 */
export interface NadRouteHandler {
  name: string;
  bean: string;
  parameters: NadParameter[];
  annotations: NadAnnotation[];
  returnType: string;
}

/**
 * NadRouteInfo
 * @iface cn.lalaframework.nad.interfaces.NadRouteInfo
 */
export interface NadRouteInfo {
  methods: string[];
  patterns: string[];
  headers: NameValuePair[];
  consumes: string[];
  produces: string[];
  customFlags: string[];
}

/**
 * NadRoute
 * @iface cn.lalaframework.nad.interfaces.NadRoute
 */
export type NadRoute = NadRouteHandler & NadRouteInfo;

/**
 * NameValuePair
 * @iface cn.lalaframework.nad.models.NameValuePair
 */
export interface NameValuePair {
  name: string;
  value?: string;
}

/**
 * NadParameter
 * @iface cn.lalaframework.nad.interfaces.NadParameter
 */
export interface NadParameter {
  annotations: NadAnnotation[];
  name?: string;
  type: string;
}
