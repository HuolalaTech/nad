package cn.lalaframework.nad.exceptions;

public class NoHandlerMappingException extends RuntimeException {
    public NoHandlerMappingException() {
        super("The HandlerMapping has not been implemented");
    }
}
