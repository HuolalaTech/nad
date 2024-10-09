/* istanbul ignore file */
/**
 * From java.lang.reflect.Modifier
 */
export abstract class Modifier {
  /**
   * Return {@code true} if the integer argument includes the
   * {@code public} modifier, {@code false} otherwise.
   *
   * @param   mod a set of modifiers
   * @return {@code true} if {@code mod} includes the
   * {@code public} modifier; {@code false} otherwise.
   */
  public static isPublic(mod: number): boolean {
    return (mod & Modifier.PUBLIC) !== 0;
  }

  /**
   * Return {@code true} if the integer argument includes the
   * {@code private} modifier, {@code false} otherwise.
   *
   * @param   mod a set of modifiers
   * @return {@code true} if {@code mod} includes the
   * {@code private} modifier; {@code false} otherwise.
   */
  public static isPrivate(mod: number): boolean {
    return (mod & Modifier.PRIVATE) !== 0;
  }

  /**
   * Return {@code true} if the integer argument includes the
   * {@code protected} modifier, {@code false} otherwise.
   *
   * @param   mod a set of modifiers
   * @return {@code true} if {@code mod} includes the
   * {@code protected} modifier; {@code false} otherwise.
   */
  public static isProtected(mod: number): boolean {
    return (mod & Modifier.PROTECTED) !== 0;
  }

  /**
   * Return {@code true} if the integer argument includes the
   * {@code static} modifier, {@code false} otherwise.
   *
   * @param   mod a set of modifiers
   * @return {@code true} if {@code mod} includes the
   * {@code static} modifier; {@code false} otherwise.
   */
  public static isStatic(mod: number): boolean {
    return (mod & Modifier.STATIC) !== 0;
  }

  /**
   * Return {@code true} if the integer argument includes the
   * {@code final} modifier, {@code false} otherwise.
   *
   * @param   mod a set of modifiers
   * @return {@code true} if {@code mod} includes the
   * {@code final} modifier; {@code false} otherwise.
   */
  public static isFinal(mod: number): boolean {
    return (mod & Modifier.FINAL) !== 0;
  }

  /**
   * Return {@code true} if the integer argument includes the
   * {@code synchronized} modifier, {@code false} otherwise.
   *
   * @param   mod a set of modifiers
   * @return {@code true} if {@code mod} includes the
   * {@code synchronized} modifier; {@code false} otherwise.
   */
  public static isSynchronized(mod: number): boolean {
    return (mod & Modifier.SYNCHRONIZED) !== 0;
  }

  /**
   * Return {@code true} if the integer argument includes the
   * {@code volatile} modifier, {@code false} otherwise.
   *
   * @param   mod a set of modifiers
   * @return {@code true} if {@code mod} includes the
   * {@code volatile} modifier; {@code false} otherwise.
   */
  public static isVolatile(mod: number): boolean {
    return (mod & Modifier.VOLATILE) !== 0;
  }

  /**
   * Return {@code true} if the integer argument includes the
   * {@code transient} modifier, {@code false} otherwise.
   *
   * @param   mod a set of modifiers
   * @return {@code true} if {@code mod} includes the
   * {@code transient} modifier; {@code false} otherwise.
   */
  public static isTransient(mod: number): boolean {
    return (mod & Modifier.TRANSIENT) !== 0;
  }

  /**
   * Return {@code true} if the integer argument includes the
   * {@code native} modifier, {@code false} otherwise.
   *
   * @param   mod a set of modifiers
   * @return {@code true} if {@code mod} includes the
   * {@code native} modifier; {@code false} otherwise.
   */
  public static isNative(mod: number): boolean {
    return (mod & Modifier.NATIVE) !== 0;
  }

  /**
   * Return {@code true} if the integer argument includes the
   * {@code interface} modifier, {@code false} otherwise.
   *
   * @param   mod a set of modifiers
   * @return {@code true} if {@code mod} includes the
   * {@code interface} modifier; {@code false} otherwise.
   */
  public static isInterface(mod: number): boolean {
    return (mod & Modifier.INTERFACE) !== 0;
  }

  /**
   * Return {@code true} if the integer argument includes the
   * {@code abstract} modifier, {@code false} otherwise.
   *
   * @param   mod a set of modifiers
   * @return {@code true} if {@code mod} includes the
   * {@code abstract} modifier; {@code false} otherwise.
   */
  public static isAbstract(mod: number): boolean {
    return (mod & Modifier.ABSTRACT) !== 0;
  }

  /**
   * Return {@code true} if the integer argument includes the
   * {@code strictfp} modifier, {@code false} otherwise.
   *
   * @param   mod a set of modifiers
   * @return {@code true} if {@code mod} includes the
   * {@code strictfp} modifier; {@code false} otherwise.
   */
  public static isStrict(mod: number): boolean {
    return (mod & Modifier.STRICT) !== 0;
  }

  /*
   * Access modifier flag constants from tables 4.1, 4.4, 4.5, and 4.7 of
   * <cite>The Java Virtual Machine Specification</cite>
   */

  /**
   * The {@code int} value representing the {@code public}
   * modifier.
   */
  public static PUBLIC = 0x00000001;

  /**
   * The {@code int} value representing the {@code private}
   * modifier.
   */
  public static PRIVATE = 0x00000002;

  /**
   * The {@code int} value representing the {@code protected}
   * modifier.
   */
  public static PROTECTED = 0x00000004;

  /**
   * The {@code int} value representing the {@code static}
   * modifier.
   */
  public static STATIC = 0x00000008;

  /**
   * The {@code int} value representing the {@code final}
   * modifier.
   */
  public static FINAL = 0x00000010;

  /**
   * The {@code int} value representing the {@code synchronized}
   * modifier.
   */
  public static SYNCHRONIZED = 0x00000020;

  /**
   * The {@code int} value representing the {@code volatile}
   * modifier.
   */
  public static VOLATILE = 0x00000040;

  /**
   * The {@code int} value representing the {@code transient}
   * modifier.
   */
  public static TRANSIENT = 0x00000080;

  /**
   * The {@code int} value representing the {@code native}
   * modifier.
   */
  public static NATIVE = 0x00000100;

  /**
   * The {@code int} value representing the {@code interface}
   * modifier.
   */
  public static INTERFACE = 0x00000200;

  /**
   * The {@code int} value representing the {@code abstract}
   * modifier.
   */
  public static ABSTRACT = 0x00000400;

  /**
   * The {@code int} value representing the {@code strictfp}
   * modifier.
   */
  public static STRICT = 0x00000800;

  // Bits not (yet) exposed in the public API either because they
  // have different meanings for fields and methods and there is no
  // way to distinguish between the two in this class, or because
  // they are not Java programming language keywords
  static BRIDGE = 0x00000040;
  static VARARGS = 0x00000080;
  static SYNTHETIC = 0x00001000;
  static ANNOTATION = 0x00002000;
  static ENUM = 0x00004000;
  static MANDATED = 0x00008000;

  static isSynthetic(mod: number): boolean {
    return (mod & Modifier.SYNTHETIC) !== 0;
  }

  static isMandated(mod: number): boolean {
    return (mod & Modifier.MANDATED) !== 0;
  }

  // Note on the FOO_MODIFIERS fields and fooModifiers() methods:
  // the sets of modifiers are not guaranteed to be constants
  // across time and Java SE releases. Therefore, it would not be
  // appropriate to expose an external interface to this information
  // that would allow the values to be treated as Java-level
  // constants since the values could be constant folded and updates
  // to the sets of modifiers missed. Thus, the fooModifiers()
  // methods return an unchanging values for a given release, but a
  // value that can potentially change over time.

  /**
   * The Java source modifiers that can be applied to a class.
   * @jls 8.1.1 Class Modifiers
   */
  private static CLASS_MODIFIERS =
    Modifier.PUBLIC |
    Modifier.PROTECTED |
    Modifier.PRIVATE |
    Modifier.ABSTRACT |
    Modifier.STATIC |
    Modifier.FINAL |
    Modifier.STRICT;

  /**
   * The Java source modifiers that can be applied to an interface.
   * @jls 9.1.1 Interface Modifiers
   */
  private static INTERFACE_MODIFIERS =
    Modifier.PUBLIC | Modifier.PROTECTED | Modifier.PRIVATE | Modifier.ABSTRACT | Modifier.STATIC | Modifier.STRICT;

  /**
   * The Java source modifiers that can be applied to a constructor.
   * @jls 8.8.3 Constructor Modifiers
   */
  private static CONSTRUCTOR_MODIFIERS = Modifier.PUBLIC | Modifier.PROTECTED | Modifier.PRIVATE;

  /**
   * The Java source modifiers that can be applied to a method.
   * @jls 8.4.3  Method Modifiers
   */
  private static METHOD_MODIFIERS =
    Modifier.PUBLIC |
    Modifier.PROTECTED |
    Modifier.PRIVATE |
    Modifier.ABSTRACT |
    Modifier.STATIC |
    Modifier.FINAL |
    Modifier.SYNCHRONIZED |
    Modifier.NATIVE |
    Modifier.STRICT;

  /**
   * The Java source modifiers that can be applied to a field.
   * @jls 8.3.1 Field Modifiers
   */
  private static FIELD_MODIFIERS =
    Modifier.PUBLIC |
    Modifier.PROTECTED |
    Modifier.PRIVATE |
    Modifier.STATIC |
    Modifier.FINAL |
    Modifier.TRANSIENT |
    Modifier.VOLATILE;

  /**
   * The Java source modifiers that can be applied to a method or constructor parameter.
   * @jls 8.4.1 Formal Parameters
   */
  private static PARAMETER_MODIFIERS = Modifier.FINAL;

  static ACCESS_MODIFIERS = Modifier.PUBLIC | Modifier.PROTECTED | Modifier.PRIVATE;

  /**
   * Return an {@code int} value OR-ing together the source language
   * modifiers that can be applied to a class.
   * @return an {@code int} value OR-ing together the source language
   * modifiers that can be applied to a class.
   *
   * @jls 8.1.1 Class Modifiers
   * @since 1.7
   */
  public static classModifiers() {
    return Modifier.CLASS_MODIFIERS;
  }

  /**
   * Return an {@code int} value OR-ing together the source language
   * modifiers that can be applied to an interface.
   * @return an {@code int} value OR-ing together the source language
   * modifiers that can be applied to an interface.
   *
   * @jls 9.1.1 Interface Modifiers
   * @since 1.7
   */
  public static interfaceModifiers() {
    return Modifier.INTERFACE_MODIFIERS;
  }

  /**
   * Return an {@code int} value OR-ing together the source language
   * modifiers that can be applied to a constructor.
   * @return an {@code int} value OR-ing together the source language
   * modifiers that can be applied to a constructor.
   *
   * @jls 8.8.3 Constructor Modifiers
   * @since 1.7
   */
  public static constructorModifiers() {
    return Modifier.CONSTRUCTOR_MODIFIERS;
  }

  /**
   * Return an {@code int} value OR-ing together the source language
   * modifiers that can be applied to a method.
   * @return an {@code int} value OR-ing together the source language
   * modifiers that can be applied to a method.
   *
   * @jls 8.4.3 Method Modifiers
   * @since 1.7
   */
  public static methodModifiers() {
    return Modifier.METHOD_MODIFIERS;
  }

  /**
   * Return an {@code int} value OR-ing together the source language
   * modifiers that can be applied to a field.
   * @return an {@code int} value OR-ing together the source language
   * modifiers that can be applied to a field.
   *
   * @jls 8.3.1 Field Modifiers
   * @since 1.7
   */
  public static fieldModifiers() {
    return Modifier.FIELD_MODIFIERS;
  }

  /**
   * Return an {@code int} value OR-ing together the source language
   * modifiers that can be applied to a parameter.
   * @return an {@code int} value OR-ing together the source language
   * modifiers that can be applied to a parameter.
   *
   * @jls 8.4.1 Formal Parameters
   * @since 1.8
   */
  public static parameterModifiers() {
    return Modifier.PARAMETER_MODIFIERS;
  }
}
