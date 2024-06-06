export class RootOptions {
  public uniqueNameSeparator?: string;
  public apis?: string[];
  public fixClassName: (s: string) => string;
  public fixModuleName: (s: string) => string;
  public fixApiName: (s: string) => string;
  public fixPropertyName: (s: string) => string;

  constructor(raw: Partial<RootOptions>) {
    this.uniqueNameSeparator = raw.uniqueNameSeparator;
    this.apis = raw.apis;
    this.fixClassName = raw.fixClassName || ((s) => s || 'UnknownClass');
    this.fixModuleName = raw.fixModuleName || ((s) => s || 'unknownModule');
    this.fixApiName = raw.fixApiName || ((s) => s || 'unknownApi');
    this.fixPropertyName = raw.fixPropertyName || ((s) => s);
  }
}
