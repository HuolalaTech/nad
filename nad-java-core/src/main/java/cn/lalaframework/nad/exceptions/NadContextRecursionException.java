package cn.lalaframework.nad.exceptions;

public class NadContextRecursionException extends RuntimeException {
    public NadContextRecursionException() {
        super("NadContext is running, do not call it recursively");
    }
}
