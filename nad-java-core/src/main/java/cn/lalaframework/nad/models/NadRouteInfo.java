package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;

import java.util.List;

public interface NadRouteInfo {
    @NonNull
    List<String> getMethods();

    @NonNull
    List<String> getPatterns();

    @NonNull
    List<NameValuePair> getHeaders();

    @NonNull
    List<String> getConsumes();

    @NonNull
    List<String> getProduces();
}
