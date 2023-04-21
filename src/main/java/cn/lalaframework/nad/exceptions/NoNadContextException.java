package cn.lalaframework.nad.exceptions;

public class NoNadContextException extends RuntimeException {
    public NoNadContextException() {
        super("The NadContext was not found. The code must run at NadContext.run(...)");
    }
}
