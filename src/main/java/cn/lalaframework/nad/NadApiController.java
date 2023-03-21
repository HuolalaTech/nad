package cn.lalaframework.nad;

import cn.lalaframework.nad.models.ClassFilter;
import cn.lalaframework.nad.models.NadResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Import;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller()
@RequestMapping("nad/api")
@ConditionalOnProperty(prefix = "nad", value = "enable", havingValue = "true")
@Import(NadWebMvcConfiguration.class)
public class NadApiController {
    @Autowired
    private NadCore core;

    @Nullable
    private NadResult defsCache;

    @NonNull
    synchronized void initCache() {
        if (defsCache == null) {
            ClassFilter filter = new ClassFilter();
            filter.addRule("java.*");
            filter.addRule("javax.*");
            filter.addRule("org.springframework.*");
            filter.addRule("com.alibaba.fastjson.*");
            filter.addRule("com.fasterxml.jackson.*");
            defsCache = core.create(filter);
        }
    }

    @GetMapping("defs")
    @ResponseBody
    @NonNull
    public NadResult getDefs() {
        if (defsCache == null) initCache();
        return defsCache;
    }
}
