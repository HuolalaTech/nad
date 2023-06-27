package cn.lalaframework.nad.models;

import cn.lalaframework.nad.interfaces.NadModule;

public class NadModuleImpl extends NadDefImpl implements NadModule {
    public NadModuleImpl(Class<?> clz) {
        super(clz);
    }
}
