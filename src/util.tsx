export class EnumParser {
  static parse<T>(raw: any, type: T, defaultValue: T[keyof T]): T[keyof T] {
    let value = type[raw as keyof typeof type];
    return value !== undefined ? value : defaultValue;
  }
}
