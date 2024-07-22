package cn.lalaframework.nad.interfaces;

import org.springframework.lang.NonNull;

public interface NadRouteHandler extends NadMethod {
    @NonNull
    String getBean();
}
