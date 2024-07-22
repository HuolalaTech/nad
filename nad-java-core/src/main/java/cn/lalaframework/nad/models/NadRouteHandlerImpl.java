package cn.lalaframework.nad.models;

import cn.lalaframework.nad.interfaces.NadRouteHandler;
import org.springframework.lang.NonNull;
import org.springframework.web.method.HandlerMethod;

public class NadRouteHandlerImpl extends NadMethodImpl implements NadRouteHandler {
    @NonNull
    private final String bean;

    public NadRouteHandlerImpl(@NonNull HandlerMethod handler) {
        super(handler);
        bean = handler.getBeanType().getTypeName();
        NadContext.collectModule(handler.getBeanType());
    }

    @Override
    @NonNull
    public String getBean() {
        return bean;
    }
}
