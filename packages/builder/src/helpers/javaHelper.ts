import { isOneOf } from '../utils';

export const javaMapTypes = [
  'java.util.Map',
  'java.util.NavigableMap',
  'java.util.SortedMap',
  'java.util.AbstractMap',
  'java.util.Dictionary',
  'java.util.HashMap',
  'java.util.Hashtable',
  'java.util.IdentityHashMap',
  'java.util.LinkedHashMap',
  'java.util.TreeMap',
  'java.util.Properties',
  'java.util.WeakHashMap',
] as const;

export const javaListTypes = [
  'java.util.Collection',
  'java.util.List',
  'java.util.Deque',
  'java.util.Iterator',
  'java.util.ListIterator',
  'java.util.Set',
  'java.util.NavigableSet',
  'java.util.Queue',
  'java.util.SortedSet',
  'java.util.AbstractCollection',
  'java.util.AbstractList',
  'java.util.AbstractQueue',
  'java.util.AbstractSequentialList',
  'java.util.AbstractSet',
  'java.util.ArrayDeque',
  'java.util.ArrayList',
  'java.util.HashSet',
  'java.util.LinkedHashSet',
  'java.util.LinkedList',
  'java.util.PriorityQueue',
  'java.util.Stack',
  'java.util.TreeSet',
  'java.util.Vector',
] as const;

export const isJavaPrimitiveTypes = [
  'byte',
  'char',
  'short',
  'int',
  'long',
  'float',
  'double',
  'void',
  'boolean',
] as const;

export const isJavaStringTypes = [
  'java.lang.String',
  'java.lang.StringBuffer',
  'java.time.LocalDateTime',
  'java.time.LocalDate',
  'java.time.OffsetDateTime',
  'java.time.OffsetTime',
  'java.time.ZonedDateTime',
  'java.time.LocalTime',
  'java.lang.Class',
  'java.net.URL',
  'java.net.URI',
  'java.io.File',
  'char',
] as const;

export const isJavaFloatTypes = [
  'double',
  'float',
  'java.lang.Double',
  'java.lang.Float',
  'java.lang.Number',
  'java.math.BigDecimal',
] as const;

export const isJavaIntegerTypes = [
  'byte',
  'short',
  'int',
  'java.lang.Integer',
  'java.lang.Short',
  'java.lang.Byte',
] as const;

export const isJavaLongTypes = [
  'long',
  'java.sql.Date',
  'java.util.Date',
  'java.sql.Timestamp',
  'java.lang.Long',
  'java.math.BigInteger',
] as const;

const javaUnknownTypePrefixes = [
  'java.',
  'javax.',
  'org.springframework.',
  'com.alibaba.fastjson.',
  'com.fasterxml.jackson.',
];

const javaTupleTypePrefixes = ['groovy.lang.Tuple'];

const javaWrapperTypes = ['java.lang.ThreadLocal', 'java.util.Optional'];

export const isJavaBooleanTypes = ['boolean', 'java.lang.Boolean'] as const;

export const isJavaVoidTypes = ['void', 'java.lang.Void'] as const;

export const isJavaPrimitive = isOneOf(isJavaPrimitiveTypes);
export const isJavaList = isOneOf(javaListTypes);
export const isJavaMap = isOneOf(javaMapTypes);
export const isJavaWrapper = isOneOf(javaWrapperTypes);
export const isJavaString = isOneOf(isJavaStringTypes);
export const isJavaFloat = isOneOf(isJavaFloatTypes);
export const isJavaInteger = isOneOf(isJavaIntegerTypes);
export const isJavaLong = isOneOf(isJavaLongTypes);
export const isJavaBoolean = isOneOf(isJavaBooleanTypes);
export const isJavaVoid = isOneOf(isJavaVoidTypes);
export const isJavaNumber = (v: string) => isJavaInteger(v) || isJavaLong(v) || isJavaFloat(v);

export const isJavaUnknown = (v: string) => javaUnknownTypePrefixes.some((preifx) => v.startsWith(preifx));
export const isJavaTuple = (v: string) => javaTupleTypePrefixes.some((preifx) => v.startsWith(preifx));

export const isJavaNonClass = (v: string) =>
  isJavaString(v) ||
  isJavaNumber(v) ||
  isJavaBoolean(v) ||
  isJavaList(v) ||
  isJavaMap(v) ||
  isJavaVoid(v) ||
  isJavaUnknown(v) ||
  isJavaTuple(v);
