package cn.lalaframework.nad;

import cn.lalaframework.nad.exceptions.NoHandlerMappingException;
import cn.lalaframework.nad.interfaces.NadResult;
import cn.lalaframework.nad.models.NadContext;
import cn.lalaframework.nad.utils.ClassExcluder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Import;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@Controller
@RequestMapping("nad/api")
@ConditionalOnProperty(prefix = "nad", value = "enable", havingValue = "true")
@Import(NadUiConfiguration.class)
public class NadApiController {
    @Autowired(required = false)
    private RequestMappingHandlerMapping rhMapping;

    @Nullable
    private NadResult defsCache;

    synchronized void initCache() {
        if (rhMapping == null) throw new NoHandlerMappingException();
        if (defsCache == null) {
            ClassExcluder filter = new ClassExcluder();
            filter.addRule("java.*");
            filter.addRule("javax.*");
            filter.addRule("org.springframework.*");
            filter.addRule("com.alibaba.fastjson.*");
            filter.addRule("com.fasterxml.jackson.*");
            filter.addRule(NadApiController.class.getTypeName());
            defsCache = NadContext.run(() -> {
                NadContext.collectSpringWeb(rhMapping);
                return NadContext.dump();
            }, filter);
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
